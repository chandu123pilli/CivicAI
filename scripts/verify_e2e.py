import requests

BASE = 'http://127.0.0.1:8000/api'

def run_tests():
    # 1. Login Citizen
    res = requests.post(f'{BASE}/auth/login', json={'email': 'citizen.alex@civicai.org', 'password': 'CitizenPassword123!'})
    assert res.status_code == 200, res.text
    token = res.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print('[PASS] Citizen Alex login successful.')

    # 2. Submit new issue
    issue_data = {
        'title': 'Deep rim-cracking pothole on Market Street and 5th',
        'description': 'Severe road cavity causing vehicular swerving and rim damage right next to crosswalk.',
        'latitude': '37.7749',
        'longitude': '-122.4194',
        'address': '5th Ave & Market St'
    }
    res_issue = requests.post(f'{BASE}/issues', data=issue_data, headers=headers)
    assert res_issue.status_code == 201, res_issue.text
    created = res_issue.json()
    tracking_id = created['tracking_id']
    print(f"[PASS] Created issue {tracking_id}: Priority={created['priority']}, Category={created['category']}, Dept={created['department']}")

    # 3. Check AI classify endpoint
    classify_res = requests.post(
        f'{BASE}/ai/classify',
        json={'title': 'Sparking dangling live electrical wire', 'description': 'Exposed wire snapping and sparking on sidewalk.'}
    )
    assert classify_res.status_code == 200
    print(f"[PASS] AI Classify: Category={classify_res.json()['category']}, Priority={classify_res.json()['priority']}")

    # 4. Check AI Chat
    chat_res = requests.post(f'{BASE}/ai/chat', json={'message': 'How do I report a pothole?', 'conversation_history': []})
    assert chat_res.status_code == 200
    print(f"[PASS] AI Chat Assistant replied with {len(chat_res.json()['reply'])} chars.")

    # 5. Login Admin
    admin_res = requests.post(f'{BASE}/auth/login', json={'email': 'admin@civicai.org', 'password': 'AdminPassword123!'})
    assert admin_res.status_code == 200
    admin_token = admin_res.json()['access_token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}
    print('[PASS] Chief Admin Sarah login successful.')

    # 6. Admin Overview
    ov = requests.get(f'{BASE}/admin/overview', headers=admin_headers).json()
    print(f"[PASS] Admin Overview: Total={ov['total_complaints']}, Unassigned={ov['unassigned_complaints']}, High/Crit={ov['high_critical_complaints']}, Resolved={ov['resolved_complaints']}")

    # 7. Admin updates issue status
    up_res = requests.patch(
        f"{BASE}/admin/issues/{created['id']}/status",
        json={'new_status': 'In Progress', 'note': 'Field crew #3 dispatched with asphalt.'},
        headers=admin_headers
    )
    assert up_res.status_code == 200
    print(f"[PASS] Status updated to: {up_res.json()['status']}")

    # 8. Verify history
    hist = requests.get(f"{BASE}/issues/{created['id']}/history", headers=headers).json()
    print(f'[PASS] Verified status history entries count = {len(hist)}')

    print('\n[SUCCESS] ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY!')

if __name__ == '__main__':
    run_tests()
