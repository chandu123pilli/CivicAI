def test_create_issue_with_ai_fallback(client, citizen1_headers):
    data = {
        "title": "Deep dangerous pothole on Market street",
        "description": "Large road crater causing vehicles to swerve and puncture tires near the crosswalk.",
        "latitude": "37.7749",
        "longitude": "-122.4194",
        "address": "Market St & 5th St"
    }
    response = client.post("/api/issues", data=data, headers=citizen1_headers)
    assert response.status_code == 201
    created = response.json()
    assert created["title"] == "Deep dangerous pothole on Market street"
    assert created["category"] == "Roads and potholes"
    assert created["department"] == "Roads and Public Works"
    assert created["status"] == "Submitted"
    assert created["tracking_id"].startswith("CIVIC-2026-")

def test_list_citizen_issues_isolation(client, citizen1_headers, citizen2_headers):
    # Citizen 2 creates an issue
    data = {
        "title": "Overflowing dumpster and trash pile",
        "description": "Garbage has not been collected for two weeks in our apartment lane.",
        "address": "400 Oak St"
    }
    c2_resp = client.post("/api/issues", data=data, headers=citizen2_headers)
    assert c2_resp.status_code == 201

    # Citizen 1 lists issues; citizen 1 should NOT see citizen 2's issue in their own reports
    c1_list = client.get("/api/issues", headers=citizen1_headers)
    assert c1_list.status_code == 200
    c1_items = c1_list.json()["items"]
    for item in c1_items:
        assert item["title"] != "Overflowing dumpster and trash pile"

def test_issue_detail_and_comments(client, citizen1_headers, admin_headers):
    # Get issue 1 created by citizen 1
    resp = client.get("/api/issues/1", headers=citizen1_headers)
    assert resp.status_code == 200
    detail = resp.json()
    assert detail["id"] == 1
    assert "status_history" in detail
    assert "comments" in detail
    # Citizen should not see admin notes
    assert detail["admin_notes"] is None

    # Post comment
    c_resp = client.post(
        "/api/issues/1/comments",
        json={"message": "Please fix this quickly before the rainstorm."},
        headers=citizen1_headers
    )
    assert c_resp.status_code == 201
    comment_data = c_resp.json()
    assert comment_data["message"] == "Please fix this quickly before the rainstorm."

def test_public_map_endpoint(client):
    response = client.get("/api/issues/public/map")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    if items:
        # Check no private user details are exposed on map
        assert "user_id" not in items[0]
        assert "reporter_name" not in items[0]
