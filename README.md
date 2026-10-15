# CivicAI — AI-Powered Civic Issue Management Platform

> **"Smarter Reports. Safer Communities."**  
> *Developed for the VORTEX 2K26 Global AI Innovation Hackathon.*

---

## 🌟 Executive Summary

CivicAI is a full-stack, AI-powered smart-city platform designed to resolve urban infrastructure challenges (potholes, water leaks, damaged streetlights, sewer blockages, and hazardous debris).

Unlike fragmented complaint hotlines or static submission forms, CivicAI features:
1. **Instant AI Severity & Category Triage**: Automatically estimates complaint urgency (`Critical`, `High`, `Medium`, `Low`) with auditable rationale and routes tasks to the appropriate municipal department.
2. **Geospatial & Textual Duplicate Detection**: Uses Haversine distance and token-based similarity to identify suspected duplicate reports within a 1km radius, saving field crews from duplicate dispatches.
3. **Interactive Hotspot GIS Mapping**: OpenStreetMap integration with real-time priority markers, cluster radiuses, and category filters.
4. **Transparent Status Tracking**: Real-time lifecycle timelines (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`), status change histories, and community communication threads.
5. **Context-Aware AI Assistant**: Natural language civic chatbot powered by actual database records without hallucinated status claims.
6. **Zero-API-Key Offline Ready**: Seamlessly runs with a Google Gemini API key or a built-in deterministic local heuristic classifier.

---

## 🏗️ Architecture & Tech Stack

```
CivicAI Platform
├── Frontend (React 19 + TypeScript + Vite + Tailwind CSS v4)
│   ├── React Router v7 (Role-based protected routes)
│   ├── React Leaflet + OpenStreetMap (Interactive GIS Incident Map)
│   ├── Lucide React Icons (Modern civic SaaS design system)
│   └── Recharts (Department workload, monthly trends & priority distributions)
│
└── Backend (Python 3.11+ / 3.13 + FastAPI)
    ├── Pydantic v2 (Input & response schemas with email validation)
    ├── SQLAlchemy ORM (SQLite for zero-config local dev, PostgreSQL / Supabase ready)
    ├── JWT Authentication with secure Bcrypt password hashing
    ├── AI Service Layer (Gemini 2.5 Flash API + Deterministic Local Fallback)
    ├── Duplicate Detection Engine (Haversine formula + Jaccard token overlap)
    └── Controlled Static Uploads (MIME & size validated image serving)
```

---

## 🚀 Quick Start Guide (Windows 11 & VS Code)

### Prerequisites
- **Python 3.11+** (Tested on Python 3.13)
- **Node.js v18+** (Tested on Node.js v24 & npm 11)
- **Git** (optional)

---

### Step 1: Open Workspace Directory
Open PowerShell or your preferred terminal inside the project root:
```powershell
cd C:\Users\ACER\.gemini\antigravity-ide\scratch\civicai
```

---

### Step 2: Setup & Launch Backend

1. Navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Activate the virtual environment (created during setup):
   ```powershell
   # In Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Or directly run through venv python:
   .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
   ```

3. Initialize and Seed the Database with Fictional Complaints:
   ```powershell
   .\venv\Scripts\python.exe ..\scripts\seed_data.py
   ```
   *(Inserts 1 Administrator, 2 Citizens, 16 realistic civic complaints across all categories, duplicate pairs, and status histories).*

4. Start the FastAPI Development Server:
   ```powershell
   .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
   ```
   - **Backend API:** `http://127.0.0.1:8000`
   - **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
   - **Health Check:** `http://127.0.0.1:8000/api/health`

---

### Step 3: Setup & Launch Frontend (In a Second Terminal)

1. Open a new terminal tab and navigate to `frontend`:
   ```powershell
   cd C:\Users\ACER\.gemini\antigravity-ide\scratch\civicai\frontend
   ```

2. Install dependencies (if not already cached):
   ```powershell
   npm install
   ```

3. Launch the Vite Development Server:
   ```powershell
   npm run dev
   ```
   - **Web Application URL:** `http://localhost:5173`

---

## 🔑 Pre-Seeded Hackathon Demo Accounts

Both the **Landing Page** (`/`) and **Sign In Page** (`/login`) include **1-Click Instant Demo Login Buttons** for instant evaluation without typing:

| Role | Name | Email | Password | Pre-Assigned Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Chief Administrator** | Sarah Jenkins | `admin@civicai.org` | `AdminPassword123!` | Executive overview, manage all complaints, override priorities, reassign departments, review duplicates |
| **Citizen Reporter** | Alex Rivera | `citizen.alex@civicai.org` | `CitizenPassword123!` | File reports, track personal complaints, view GIS map, comment on issues |
| **Citizen Reporter** | Maya Chen | `citizen.maya@civicai.org` | `CitizenPassword123!` | File reports, track personal complaints, view GIS map, comment on issues |

> ⚠️ *Note: These credentials are strictly development seeds. Do not use in production.*

---

## 🧪 Running Automated Backend Tests

CivicAI comes with an automated pytest suite covering authentication, role isolation, complaint submission, status transitions, department routing, and duplicate matching:

```powershell
cd backend
.\venv\Scripts\pytest.exe -v
```

**Test Results:**
```
tests/test_admin.py::test_admin_endpoints_forbidden_for_citizen PASSED   [  6%]
tests/test_admin.py::test_admin_overview_and_analytics PASSED            [ 12%]
tests/test_admin.py::test_admin_status_transition_and_history PASSED     [ 18%]
tests/test_admin.py::test_admin_department_assignment PASSED             [ 25%]
tests/test_ai_and_duplicates.py::test_ai_classify_endpoint PASSED        [ 31%]
tests/test_ai_and_duplicates.py::test_ai_chat_assistant_endpoint PASSED  [ 37%]
tests/test_ai_and_duplicates.py::test_duplicate_detection_flow PASSED    [ 43%]
tests/test_auth.py::test_register_new_citizen PASSED                     [ 50%]
tests/test_auth.py::test_register_duplicate_email PASSED                 [ 56%]
tests/test_auth.py::test_login_success PASSED                            [ 62%]
tests/test_auth.py::test_login_wrong_password PASSED                     [ 68%]
tests/test_auth.py::test_get_me_endpoint PASSED                          [ 75%]
tests/test_issues.py::test_create_issue_with_ai_fallback PASSED          [ 81%]
tests/test_issues.py::test_list_citizen_issues_isolation PASSED          [ 87%]
tests/test_issues.py::test_issue_detail_and_comments PASSED              [ 93%]
tests/test_issues.py::test_public_map_endpoint PASSED                    [100%]
======================= 16 passed in 3.90s =======================
```

---

## 🧠 AI Capabilities & Configuration

CivicAI implements a dual-mode AI architecture:

### 1. Deterministic Local Fallback (Default - Zero API Key Needed)
- Analyzes title and description against high-risk civic keywords (e.g. "open manhole", "sparking wire", "burst pipe").
- Automatically predicts category, maps the responsible municipal department, and calculates an urgency rating (`Critical`, `High`, `Medium`, `Low`).
- Supplies an auditable natural language explanation to aid human administrators.

### 2. Google Gemini API Integration (Optional)
If you have a Gemini API key, configure it in `backend/.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
The platform automatically switches to Gemini 2.5 Flash for natural language reasoning while maintaining automatic fallback if the network or API key fails.

---

## 🗺️ Application Pages Overview

1. **Landing Page (`/`)**: Hero banner, live civic metrics, 1-click demo logins, problem/solution breakdown.
2. **Citizen Dashboard (`/dashboard`)**: Personal submission statistics, status pie chart, search and filter controls.
3. **Report an Issue (`/report`)**: Interactive Leaflet map coordinate picker, evidence photo upload, real-time AI category recommendation, and Tracking ID modal.
4. **Issue Details & Timeline (`/issues/:id`)**: Comprehensive incident log, status progression timeline with admin notes, photo preview, GIS location, duplicate alerts, and interactive comments thread.
5. **Community GIS Map (`/map`)**: Full-screen OpenStreetMap with priority-colored pins, emergency hotspot radiuses, and category filters.
6. **Administrator Dashboard (`/admin`)**: KPI cards (total, unassigned, critical, avg resolution time, duplicates), Recharts department workload bar chart, category pie chart, and live triage table.
7. **Manage Complaints (`/admin/complaints`)**: Advanced search, filters by status/priority/department, pagination, and status update modal.
8. **Duplicate Reviews (`/admin/duplicates`)**: Side-by-side comparison modal with similarity score gauges, "Confirm Duplicate", and "Mark Independent" workflows.
9. **Analytics & Performance Reports (`/admin/analytics`)**: Time-series complaint volume area chart, priority distributions, and one-click CSV export.
10. **User Profile & Settings (`/profile`)**: Persona credentials, 1-click role switcher, and database architecture summary.
11. **Custom 404 Page (`*`)**: Responsive route recovery with quick links back to dashboard and map.

---

## 🚢 Production Deployment Guide

### Backend (Render, Railway, or Docker)
1. Set the following environment variables on your backend host:
   - `DATABASE_URL`: Your PostgreSQL / Supabase connection string.
   - `SECRET_KEY`: A secure random 64-character string.
   - `BACKEND_CORS_ORIGINS`: `["https://your-frontend-domain.vercel.app"]`
2. Start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend (Vercel or Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variables:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api`

---

## 🛠️ Troubleshooting Common Issues

- **Port 8000 or 5173 already in use:**
  ```powershell
  # Check and kill processes on port 8000
  Get-NetTCPConnection -LocalPort 8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
- **PowerShell Script Execution Policy Error:**
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- **Leaflet Map Tiles Not Loading:**
  CivicAI uses standard OpenStreetMap tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) requiring standard internet connectivity.
