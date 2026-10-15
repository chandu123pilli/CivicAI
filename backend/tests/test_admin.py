import pytest

def test_admin_endpoints_forbidden_for_citizen(client, citizen1_headers):
    # Overview forbidden
    resp1 = client.get("/api/admin/overview", headers=citizen1_headers)
    assert resp1.status_code == 403

    # Analytics forbidden
    resp2 = client.get("/api/admin/analytics", headers=citizen1_headers)
    assert resp2.status_code == 403

    # Status change forbidden
    resp3 = client.patch("/api/admin/issues/1/status", json={"new_status": "Resolved"}, headers=citizen1_headers)
    assert resp3.status_code == 403

def test_admin_overview_and_analytics(client, admin_headers, citizen1_headers):
    # Create an issue first so we have data
    issue_data = {
        "title": "Damaged guardrail on bridge",
        "description": "Metal guardrail cracked after vehicle scrape.",
        "latitude": "37.7749",
        "longitude": "-122.4194",
        "address": "Bay Bridge access ramp"
    }
    client.post("/api/issues", data=issue_data, headers=citizen1_headers)

    resp = client.get("/api/admin/overview", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_complaints" in data
    assert "unassigned_complaints" in data
    assert "resolved_complaints" in data
    assert data["total_complaints"] >= 1

    analytics_resp = client.get("/api/admin/analytics", headers=admin_headers)
    assert analytics_resp.status_code == 200
    analytics_data = analytics_resp.json()
    assert "category_distribution" in analytics_data
    assert "status_distribution" in analytics_data
    assert "department_workload" in analytics_data

def test_admin_status_transition_and_history(client, admin_headers, citizen1_headers):
    # Create a fresh issue to test
    create_resp = client.post(
        "/api/issues",
        data={
            "title": "Water seepage on curb",
            "description": "Continuous trickling water from curbside expansion joint.",
            "latitude": "37.7760",
            "longitude": "-122.4170"
        },
        headers=citizen1_headers
    )
    assert create_resp.status_code == 201
    issue_id = create_resp.json()["id"]

    # Change status to In Progress
    payload = {
        "new_status": "In Progress",
        "note": "Road crew dispatched with cold-mix asphalt.",
        "priority": "Critical"
    }
    resp = client.patch(f"/api/admin/issues/{issue_id}/status", json=payload, headers=admin_headers)
    assert resp.status_code == 200
    updated = resp.json()
    assert updated["status"] == "In Progress"
    assert updated["priority"] == "Critical"

    # Verify status history
    hist_resp = client.get(f"/api/issues/{issue_id}/history", headers=citizen1_headers)
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert len(history) >= 2
    assert any(h["new_status"] == "In Progress" for h in history)

    # Change to Resolved
    res_payload = {
        "new_status": "Resolved",
        "resolution_details": "Pothole filled, compacted and leveled.",
        "note": "Work completed and verified."
    }
    res_resp = client.patch(f"/api/admin/issues/{issue_id}/status", json=res_payload, headers=admin_headers)
    assert res_resp.status_code == 200
    res_data = res_resp.json()
    assert res_data["status"] == "Resolved"
    assert res_data["resolved_at"] is not None

def test_admin_department_assignment(client, admin_headers, citizen1_headers):
    # Create an issue to assign
    create_resp = client.post(
        "/api/issues",
        data={
            "title": "Street litter after festival",
            "description": "Food wrappers and empty cups left on sidewalk.",
            "address": "Festival plaza"
        },
        headers=citizen1_headers
    )
    issue_id = create_resp.json()["id"]

    payload = {
        "department": "Sanitation",
        "note": "Reassigned for specialized street sweeping."
    }
    resp = client.patch(f"/api/admin/issues/{issue_id}/assign", json=payload, headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["department"] == "Sanitation"
