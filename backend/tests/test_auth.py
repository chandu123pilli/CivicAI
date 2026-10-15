def test_register_new_citizen(client):
    payload = {
        "full_name": "New Resident",
        "email": "new.resident@example.com",
        "password": "Password123!",
        "phone": "+1-555-9988"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "new.resident@example.com"
    assert data["user"]["role"] == "citizen"

def test_register_duplicate_email(client):
    payload = {
        "full_name": "Duplicate User",
        "email": "new.resident@example.com",
        "password": "Password123!"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success(client):
    payload = {
        "email": "testadmin@civicai.org",
        "password": "TestAdmin123!"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_login_wrong_password(client):
    payload = {
        "email": "testadmin@civicai.org",
        "password": "WrongPassword!"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401

def test_get_me_endpoint(client, citizen1_headers):
    response = client.get("/api/auth/me", headers=citizen1_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "citizen1@civicai.org"
    assert data["role"] == "citizen"
