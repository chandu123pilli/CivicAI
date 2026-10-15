# CivicAI — AI-Powered Civic Issue Detection, Prioritization & Resolution Platform
### VORTEX 2K26 Global AI Innovation Hackathon Prototype

> *"Smarter Reports. Safer Communities."*

CivicAI is a high-fidelity frontend prototype showcasing how computer vision and local NLP heuristics streamline municipal triage, detect duplicate civic complaints, estimate real-time priority, and route issues to municipal departments.

---

## 🚀 Quick Start (Zero Dependencies)

This project has **no backend, no database, and zero complex build tools**. You can run it directly using any web browser or local static file server.

### Option 1: VS Code Live Server (Recommended)
1. Extract `civicai_prototype.zip` into a folder.
2. Open the folder in **Visual Studio Code**.
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The prototype will open at `http://127.0.0.1:5500/index.html`.

### Option 2: Direct Browser Launch
Simply double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.

---

## 📂 Project Structure

```
civicai-vortex-prototype/
│
├── index.html        # Semantic HTML5 single-page application structure
├── style.css         # Smart-city design system, glassmorphism, & cyber styling
├── script.js         # Reactive state engine, AI heuristics, Chart.js & Leaflet logic
└── README.md         # Judge walk-through instructions & scenario guide
```

---

## 🏆 10-Step Judging Demonstration Script

Follow this script to demonstrate the prototype to hackathon judges:

1. **Authentication Gateway:**
   - Launch `index.html`. Show the smart-city authentication screen with preset demo buttons.
   - Click **"Citizen Portal"** to log in as *Jane Doe* with a single click.

2. **Overview Dashboard:**
   - Review the 4 core metric cards (*Total Reported, Pending, High/Critical, Resolved*).
   - Point out the dynamic **Chart.js** category doughnut and resolution status charts calculated from state.

3. **Citizen Reporting & Real-time AI Heuristics:**
   - Click **"Report an Issue"** in the sidebar.
   - Type in the Title: `Deep pothole near school crossing`.
   - Watch the right-hand **AI Live Prediction Box** immediately predict:
     - **Category:** *Roads & Public Works*
     - **Priority:** *Critical* (triggered by safety-critical keywords)
     - **Department:** *Roads & Public Works*
     - **Rationale:** Explains the reasoning behind the school zone danger factor.

4. **Duplicate Detection:**
   - Notice the amber **"Potential Duplicate Detected"** banner pop up if the keywords match an existing unresolved complaint.

5. **Dispatched to Application State:**
   - Upload any photo or use the prefilled sample.
   - Click **"Dispatch Civic Report"**.
   - Note the success toast notification with the new tracking ID (e.g. `TKT-8291`) and immediate inclusion into local state.

6. **Interactive Community Map:**
   - Switch to **"Community Map"**.
   - Show the interactive **Leaflet OpenStreetMap** with colored priority pins (Red for Critical, Amber for High, Electric Blue for Medium).
   - Click on any marker to open its mini inspection card.

7. **Switch to Administrator Mode:**
   - In the top-right header, toggle the role switch from **"Citizen"** to **"Admin"** (or switch to Marcus Vance).

8. **Admin Lifecycle Triage & Timeline Audit:**
   - Open **"All Complaints"**, find the newly submitted ticket, and click **"Inspect"**.
   - Show the full incident modal, photograph preview, and the AI explanation.
   - Under the Admin section, change the status to **"In Progress"** and click **"Apply Status"**.
   - Demonstrate the **Audit & Lifecycle Timeline** instantly recording the timestamped administrator update.

9. **Municipal Analytics Hub & Autonomous Insights:**
   - Click **"Admin Analytics"** in the sidebar.
   - View the polar workload chart and resolution performance by department.
   - Highlight the **"CivicAI Autonomous Intelligence Insights"** strip detecting workload bottlenecks and high-risk concentrations.

10. **Interactive CivicAI Assistant:**
    - Open **"AI Assistant"** and test queries like:
      - *"How do I report a pothole?"*
      - *"Which department handles garbage?"*
      - *"Which issues are high priority?"*
    - Show how it answers questions based on the current sample data in memory.

---

## 🛠️ Built With
- **HTML5 & CSS3** (Vanilla, CSS custom properties, grid/flexbox)
- **Vanilla JavaScript** (State-driven reactive rendering, zero node modules)
- **Leaflet.js & OpenStreetMap** (Geospatial priority markers)
- **Chart.js** (Dynamic operational visual analytics)
- **Lucide Icons** (Clean municipal UI iconography)
- **LocalStorage API** (Persistent updates across browser refreshes)
