import pytest
import os
import sys
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure backend root is on sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.db.session import Base
from app.core.deps import get_db
from app.core.security import hash_password, create_access_token
from app.models.models import User, Issue, IssueStatusHistory
from app.main import app

# Use isolated test SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_civicai.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed test admin
    admin = User(
        full_name="Test Admin",
        email="testadmin@civicai.org",
        password_hash=hash_password("TestAdmin123!"),
        role="admin",
        department="Public Works"
    )
    # Seed test citizen 1
    citizen1 = User(
        full_name="Citizen One",
        email="citizen1@civicai.org",
        password_hash=hash_password("CitizenPass123!"),
        role="citizen"
    )
    # Seed test citizen 2
    citizen2 = User(
        full_name="Citizen Two",
        email="citizen2@civicai.org",
        password_hash=hash_password("CitizenPass123!"),
        role="citizen"
    )
    db.add_all([admin, citizen1, citizen2])
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_civicai.db"):
        try:
            os.remove("./test_civicai.db")
        except Exception:
            pass

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def admin_headers():
    token = create_access_token(subject=1)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def citizen1_headers():
    token = create_access_token(subject=2)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def citizen2_headers():
    token = create_access_token(subject=3)
    return {"Authorization": f"Bearer {token}"}
