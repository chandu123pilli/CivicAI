def test_ai_classify_endpoint(client):
    payload = {
        "title": "Sparking exposed electrical wire hanging from light pole",
        "description": "Dangerous wire dangling near sidewalk sparking when touching metal fence."
    }
    response = client.post("/api/ai/classify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] in ["Streetlights and electricity", "Public safety"]
    assert data["priority"] in ["Critical", "High"]
    assert "priority_explanation" in data
    assert "summary" in data

def test_ai_chat_assistant_endpoint(client):
    payload = {
        "message": "How do I report a pothole on my street?",
        "conversation_history": []
    }
    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 20

def test_duplicate_detection_flow(client, citizen1_headers, admin_headers):
    # Report original complaint
    report1 = {
        "title": "Severe road crater near 5th and market avenue",
        "description": "Pothole deep enough to crack car wheels.",
        "latitude": "37.7749",
        "longitude": "-122.4194",
        "address": "5th Ave & Market"
    }
    r1 = client.post("/api/issues", data=report1, headers=citizen1_headers)
    assert r1.status_code == 201

    # Report highly similar complaint at same location
    report2 = {
        "title": "Large pothole crater 5th ave and market avenue",
        "description": "Road surface crater deep enough to crack car wheels and tires.",
        "latitude": "37.7750",
        "longitude": "-122.4193",
        "address": "5th Ave & Market St"
    }
    r2 = client.post("/api/issues", data=report2, headers=citizen1_headers)
    assert r2.status_code == 201

    # Admin checks duplicates list
    dups_resp = client.get("/api/admin/duplicates", headers=admin_headers)
    assert dups_resp.status_code == 200
    dups = dups_resp.json()
    assert len(dups) >= 1
    target_dup = dups[0]
    assert target_dup["similarity_score"] >= 0.50

    # Admin updates duplicate status
    update_resp = client.patch(
        f"/api/admin/duplicates/{target_dup['id']}",
        json={"review_status": "Confirmed Duplicate"},
        headers=admin_headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["review_status"] == "Confirmed Duplicate"
