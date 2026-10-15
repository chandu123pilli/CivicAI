/**
 * CivicAI — Core Application Engine
 * VORTEX 2K26 Global AI Innovation Hackathon Prototype
 */

// ================= INITIAL STATE & BENCHMARK FIXTURES =================
const DEFAULT_COMPLAINTS = [
  {
    id: "TKT-1082",
    title: "Deep crater-like pothole near school zone crossing",
    description: "Major pothole approximately 12 inches deep right by St. Jude Academy crossing. Multiple sedans scraped undercarriages; severe bicycle hazard during morning rush.",
    category: "Roads & Public Works",
    priority: "Critical",
    department: "Roads & Public Works",
    status: "In Progress",
    location: "Oakridge Ave & 5th Cross",
    lat: 12.9716,
    lng: 77.5946,
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    reportedAt: "2026-10-14 08:30 AM",
    aiExplanation: "Keywords 'crater', 'pothole', 'school zone' triggered Critical priority due to pedestrian school danger.",
    timeline: [
      { time: "2026-10-14 08:30 AM", text: "Logged via Citizen Mobile Portal" },
      { time: "2026-10-14 08:32 AM", text: "AI prioritized as Critical (School pedestrian safety risk)" },
      { time: "2026-10-14 09:15 AM", text: "Dispatched to Roads & Public Works rapid repair squad" }
    ]
  },
  {
    id: "TKT-1081",
    title: "Overflowing garbage dump polluting commercial walkway",
    description: "Four commercial dumpsters overflowing onto sidewalk for three consecutive days. Stray dogs scattering rotten food waste across pedestrian market path.",
    category: "Sanitation",
    priority: "High",
    department: "Sanitation",
    status: "Assigned",
    location: "Central Market Complex, Block C",
    lat: 12.9780,
    lng: 77.6010,
    photoUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80",
    reportedAt: "2026-10-14 07:15 AM",
    aiExplanation: "Keywords 'overflowing dumpsters', 'food waste', 'commercial' classified under Sanitation with High public health urgency.",
    timeline: [
      { time: "2026-10-14 07:15 AM", text: "Submitted by resident merchant" },
      { time: "2026-10-14 07:45 AM", text: "Assigned to Ward 14 Sanitation Route Truck #4" }
    ]
  },
  {
    id: "TKT-1080",
    title: "Ruptured municipal water pipe flooding basement street",
    description: "Underground main burst causing pressurized clean drinking water to flood street corner and sub-level garages. Significant water wastage.",
    category: "Water Department",
    priority: "Critical",
    department: "Water Department",
    status: "Under Review",
    location: "Highland Parkway, Sector 2",
    lat: 12.9650,
    lng: 77.5890,
    photoUrl: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80",
    reportedAt: "2026-10-14 06:40 AM",
    aiExplanation: "Keywords 'burst', 'pressurized water', 'flooding' flagged as Critical Water Department emergency.",
    timeline: [
      { time: "2026-10-14 06:40 AM", text: "Reported via emergency citizen hotline" },
      { time: "2026-10-14 06:45 AM", text: "Valves crew alerted for emergency shutoff" }
    ]
  },
  {
    id: "TKT-1079",
    title: "Sparks emitting from open low-voltage junction box",
    description: "Metal access box door hanging open at child eye-level with exposed frayed wiring buzzing and sparking during drizzle.",
    category: "Electricity Department",
    priority: "Critical",
    department: "Electricity Department",
    status: "In Progress",
    location: "Greenfield Park Pathway",
    lat: 12.9820,
    lng: 77.5980,
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    reportedAt: "2026-10-13 10:20 PM",
    aiExplanation: "Keywords 'sparks', 'open junction', 'exposed frayed wiring' identified severe electrocution hazard.",
    timeline: [
      { time: "2026-10-13 10:20 PM", text: "Night citizen report logged" },
      { time: "2026-10-13 10:35 PM", text: "Emergency isolation team dispatched" }
    ]
  },
  {
    id: "TKT-1078",
    title: "Storm drain choked with construction debris",
    description: "Storm drain inlet completely blocked with dry plaster sacks and concrete wash from neighboring construction site. Standing puddle forming.",
    category: "Drainage & Flooding",
    priority: "Medium",
    department: "Drainage",
    status: "Assigned",
    location: "Industrial Corridor Rd 4",
    lat: 12.9590,
    lng: 77.6120,
    photoUrl: "",
    reportedAt: "2026-10-13 04:10 PM",
    aiExplanation: "Keywords 'storm drain', 'construction debris', 'puddle' categorized to Drainage with Medium priority.",
    timeline: [
      { time: "2026-10-13 04:10 PM", text: "Report filed" },
      { time: "2026-10-13 05:00 PM", text: "Assigned to Drainage Clearance Unit" }
    ]
  },
  {
    id: "TKT-1077",
    title: "Flickering high-mast streetlights creating dark zone",
    description: "Three consecutive LED streetlights intermittent and flashing rapidly, causing unsafe visibility for women and evening commuters.",
    category: "Electricity Department",
    priority: "Medium",
    department: "Electricity Department",
    status: "Submitted",
    location: "Metro Link Road, Pillar 42",
    lat: 12.9750,
    lng: 77.5820,
    photoUrl: "",
    reportedAt: "2026-10-13 01:25 PM",
    aiExplanation: "Keywords 'flickering', 'streetlights', 'dark zone' assigned to Electricity Department.",
    timeline: [
      { time: "2026-10-13 01:25 PM", text: "Submitted by transit commuter" }
    ]
  },
  {
    id: "TKT-1076",
    title: "Missing manhole cover on pedestrian jogging trail",
    description: "Cast-iron manhole cover displaced or stolen; deep drop left unguarded without caution barriers.",
    category: "Public Safety",
    priority: "Critical",
    department: "Public Safety",
    status: "Resolved",
    location: "Riverside Promenade Mile 2",
    lat: 12.9870,
    lng: 77.6080,
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
    reportedAt: "2026-10-12 09:00 AM",
    aiExplanation: "Keywords 'missing manhole', 'deep drop unguarded' categorized as Critical Public Safety emergency.",
    timeline: [
      { time: "2026-10-12 09:00 AM", text: "Report logged" },
      { time: "2026-10-12 09:20 AM", text: "Temporary safety barricade installed" },
      { time: "2026-10-12 02:40 PM", text: "Heavy duty ductile cover fitted and bolted. Marked Resolved." }
    ]
  },
  {
    id: "TKT-1075",
    title: "Broken pedestrian handrail on overpass bridge",
    description: "Rusty iron railing detached from concrete joint; wobble makes bridge unsafe for elderly pedestrians.",
    category: "Roads & Public Works",
    priority: "High",
    department: "Roads & Public Works",
    status: "Resolved",
    location: "Civic Center Pedestrian Overpass",
    lat: 12.9690,
    lng: 77.6050,
    photoUrl: "",
    reportedAt: "2026-10-11 11:30 AM",
    aiExplanation: "Keywords 'handrail', 'bridge', 'elderly' categorized to Public Works with High priority.",
    timeline: [
      { time: "2026-10-11 11:30 AM", text: "Submitted" },
      { time: "2026-10-12 11:00 AM", text: "Welding repairs completed" }
    ]
  },
  {
    id: "TKT-1074",
    title: "Dead tree limb hanging precarious over roadway",
    description: "Thick dead branch fractured during thunderstorm, suspended by thin bark directly above commuter lane.",
    category: "Public Safety",
    priority: "High",
    department: "Public Safety",
    status: "In Progress",
    location: "Boulevard West, Tree #88",
    lat: 12.9620,
    lng: 77.5790,
    photoUrl: "",
    reportedAt: "2026-10-11 08:45 AM",
    aiExplanation: "Keywords 'tree limb hanging', 'suspended', 'roadway' flagged as High Public Safety hazard.",
    timeline: [
      { time: "2026-10-11 08:45 AM", text: "Logged" },
      { time: "2026-10-11 10:15 AM", text: "Horticulture emergency pruning team dispatched" }
    ]
  },
  {
    id: "TKT-1073",
    title: "Persistent low water pressure across residential colony",
    description: "Taps running at faint trickle during scheduled supply hours across 30 row houses.",
    category: "Water Department",
    priority: "Low",
    department: "Water Department",
    status: "Under Review",
    location: "Shanti Enclave, Ward 9",
    lat: 12.9550,
    lng: 77.5990,
    photoUrl: "",
    reportedAt: "2026-10-10 03:00 PM",
    aiExplanation: "Keywords 'low water pressure', 'residential trickle' classified under Water Department as Low priority.",
    timeline: [
      { time: "2026-10-10 03:00 PM", text: "Resident association complaint logged" }
    ]
  },
  {
    id: "TKT-1072",
    title: "Illegal fly-tipping of chemical paint barrels",
    description: "Abandoned metallic drums leaking solvent smell near neighborhood stormwater canal.",
    category: "Sanitation",
    priority: "High",
    department: "Sanitation",
    status: "Assigned",
    location: "Canal Link Ring Road",
    lat: 12.9800,
    lng: 77.6150,
    photoUrl: "",
    reportedAt: "2026-10-09 02:10 PM",
    aiExplanation: "Keywords 'chemical barrels', 'solvent smell', 'fly-tipping' prioritized High under Sanitation & Environment.",
    timeline: [
      { time: "2026-10-09 02:10 PM", text: "Citizen alert registered" }
    ]
  },
  {
    id: "TKT-1071",
    title: "Submerged underpass following 30-minute rain shower",
    description: "Vehicles stalling in 3 feet of pooled water due to non-functioning sump pumps at railway underpass.",
    category: "Drainage & Flooding",
    priority: "Critical",
    department: "Drainage",
    status: "Resolved",
    location: "Railway Underpass No. 3",
    lat: 12.9730,
    lng: 77.5740,
    photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    reportedAt: "2026-10-08 05:40 PM",
    aiExplanation: "Keywords 'submerged underpass', '3 feet water', 'sump pump' classified Critical Drainage hazard.",
    timeline: [
      { time: "2026-10-08 05:40 PM", text: "Citizen reports received" },
      { time: "2026-10-08 06:10 PM", text: "Auxiliary diesel pumps deployed. Water drained." }
    ]
  }
];

// Application State
let appState = {
  userRole: "citizen", // "citizen" or "admin"
  currentUser: {
    name: "Jane Doe",
    email: "jane.doe@metro.org",
    roleText: "Resident Contributor",
    avatar: "JD"
  },
  complaints: [],
  selectedComplaintId: null,
  activeView: "overview",
  mapInstance: null,
  mapMarkers: [],
  charts: {
    categoryChart: null,
    statusChart: null,
    deptChart: null,
    priorityChart: null,
    resolutionChart: null
  },
  uploadedImageDataUrl: ""
};

// ================= STORAGE MANAGEMENT =================
function initAppData() {
  const stored = localStorage.getItem("civicai_complaints_v1");
  if (stored) {
    try {
      appState.complaints = JSON.parse(stored);
    } catch (e) {
      console.warn("Storage corrupted, loading defaults:", e);
      appState.complaints = [...DEFAULT_COMPLAINTS];
    }
  } else {
    appState.complaints = [...DEFAULT_COMPLAINTS];
    persistAppData();
  }
}

function persistAppData() {
  localStorage.setItem("civicai_complaints_v1", JSON.stringify(appState.complaints));
}

// ================= AUTH & LOGIN SIMULATION =================
function quickFillRole(role) {
  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-password");
  
  if (role === "citizen") {
    emailInput.value = "jane.doe@metro.org";
    passInput.value = "citizen2026";
    appState.userRole = "citizen";
    appState.currentUser = {
      name: "Jane Doe",
      email: "jane.doe@metro.org",
      roleText: "Resident Contributor",
      avatar: "JD"
    };
  } else {
    emailInput.value = "marcus.vance@city.gov";
    passInput.value = "admin2026";
    appState.userRole = "admin";
    appState.currentUser = {
      name: "Marcus Vance",
      email: "marcus.vance@city.gov",
      roleText: "Municipal Administrator",
      avatar: "MV"
    };
  }
  
  // Submit instantly for convenience
  executeLogin();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  
  if (email.includes("admin") || email.includes(".gov")) {
    appState.userRole = "admin";
    appState.currentUser = {
      name: "Marcus Vance",
      email: email,
      roleText: "Municipal Administrator",
      avatar: "MV"
    };
  } else {
    appState.userRole = "citizen";
    appState.currentUser = {
      name: email.split("@")[0].replace(".", " ").toUpperCase() || "Citizen User",
      email: email,
      roleText: "Resident Contributor",
      avatar: email.substring(0, 2).toUpperCase()
    };
  }
  executeLogin();
}

function executeLogin() {
  const btn = document.getElementById("btn-login-submit");
  btn.innerHTML = `<span class="flex-align gap-2"><i data-lucide="loader-2" class="spin"></i> Authenticating...</span>`;
  lucide.createIcons();

  setTimeout(() => {
    document.getElementById("login-view").style.display = "none";
    document.getElementById("app-container").style.display = "flex";
    
    updateUserSessionUI();
    setRole(appState.userRole, false);
    renderAllViews();
    showToast(`Welcome back, ${appState.currentUser.name} (${appState.userRole.toUpperCase()})`);
    btn.innerHTML = `<i data-lucide="log-in"></i><span>Enter Platform</span>`;
    lucide.createIcons();
  }, 450);
}

function handleLogout() {
  document.getElementById("app-container").style.display = "none";
  document.getElementById("login-view").style.display = "flex";
  showToast("Logged out successfully");
}

function updateUserSessionUI() {
  document.getElementById("sidebar-avatar").textContent = appState.currentUser.avatar;
  document.getElementById("sidebar-user-name").textContent = appState.currentUser.name;
  document.getElementById("sidebar-user-role").textContent = appState.currentUser.roleText;
}

// ================= ROLE MANAGEMENT =================
function setRole(role, notify = true) {
  appState.userRole = role;
  
  const citizenBtn = document.getElementById("btn-role-citizen");
  const adminBtn = document.getElementById("btn-role-admin");
  const adminActionBox = document.getElementById("modal-admin-actions");
  
  if (role === "admin") {
    citizenBtn.classList.remove("active");
    adminBtn.classList.add("active");
    if (adminActionBox) adminActionBox.style.display = "block";
    if (notify) showToast("Switched to Municipal Administrator mode");
  } else {
    adminBtn.classList.remove("active");
    citizenBtn.classList.add("active");
    if (adminActionBox) adminActionBox.style.display = "none";
    if (notify) showToast("Switched to Citizen Contributor mode");
  }
}

// ================= VIEW SWITCHER =================
function switchView(viewName) {
  appState.activeView = viewName;
  
  // Update nav buttons
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  const activeBtn = Array.from(document.querySelectorAll(".nav-item")).find(btn => 
    btn.getAttribute("onclick")?.includes(viewName)
  );
  if (activeBtn) activeBtn.classList.add("active");

  // Update panels
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.remove("active"));
  const currentPanel = document.getElementById(`view-${viewName}`);
  if (currentPanel) currentPanel.classList.add("active");

  // Dynamic headers
  const titleMap = {
    overview: { title: "City Operations Overview", sub: "Real-time civic intelligence and resolution pipeline" },
    report: { title: "Report a Civic Issue", sub: "Instant AI semantic classification and priority triage" },
    complaints: { title: "Complaints Directory", sub: "Comprehensive registry with full audit lifecycle" },
    map: { title: "Geospatial Heatmap", sub: "Interactive Leaflet pins colored by priority danger" },
    analytics: { title: "Municipal Analytics Hub", sub: "Workload distribution & dynamic AI intelligence summaries" },
    assistant: { title: "CivicAI Assistant", sub: "Context-aware chatbot powered by platform heuristics" },
    settings: { title: "Hackathon Settings", sub: "Demonstration fixtures and sandbox utilities" }
  };

  const header = titleMap[viewName] || titleMap.overview;
  document.getElementById("page-title").textContent = header.title;
  document.getElementById("page-subtitle").textContent = header.sub;

  // Lifecycle view actions
  if (viewName === "map") {
    setTimeout(initOrRefreshMap, 200);
  } else if (viewName === "analytics") {
    setTimeout(renderAnalyticsCharts, 150);
  } else if (viewName === "overview") {
    setTimeout(renderOverviewCharts, 150);
  }

  // Close mobile sidebar if open
  document.getElementById("sidebar").classList.remove("open");
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// ================= AI HEURISTICS ENGINE (LOCAL SIMULATION) =================
function simulateAiPrediction(title, desc) {
  const combined = `${title} ${desc}`.toLowerCase();
  
  let category = "Roads & Public Works";
  let priority = "Medium";
  let dept = "Roads & Public Works";
  let explanation = "";

  // 1. Classification & Department Heuristics
  if (combined.match(/garbage|trash|waste|dump|smell|litter|bins|stench|sanitary|debris/)) {
    category = "Sanitation";
    dept = "Sanitation";
  } else if (combined.match(/water|pipe|leak|pressure|tap|flood|submerged|overflow|drain|drainage|sewage|sewer/)) {
    if (combined.match(/drain|sewage|flood|storm/)) {
      category = "Drainage & Flooding";
      dept = "Drainage";
    } else {
      category = "Water Department";
      dept = "Water Department";
    }
  } else if (combined.match(/light|streetlight|wire|cable|spark|electric|power|transformer|dark/)) {
    category = "Electricity Department";
    dept = "Electricity Department";
  } else if (combined.match(/pothole|road|asphalt|curb|sidewalk|bridge|crack|divider|traffic sign/)) {
    category = "Roads & Public Works";
    dept = "Roads & Public Works";
  } else if (combined.match(/danger|hazard|manhole|collapse|accident|child|school|unauthorized|crime|unsafe/)) {
    category = "Public Safety";
    dept = "Public Safety";
  }

  // 2. Priority Heuristics
  const criticalKeywords = ["spark", "fire", "electrocution", "school", "child", "collapsed", "burst", "unguarded", "submerged underpass", "crater", "severe"];
  const highKeywords = ["overflowing", "deep", "fused", "unlit", "major", "commercial", "pedestrian", "heavy", "stray dogs", "spill"];
  const lowKeywords = ["minor", "aesthetic", "small", "paint", "trickle", "faint", "slight"];

  if (criticalKeywords.some(kw => combined.includes(kw))) {
    priority = "Critical";
    explanation = `High severity keywords detected relating to immediate physical risk, electrocution, or major infrastructure rupture.`;
  } else if (highKeywords.some(kw => combined.includes(kw))) {
    priority = "High";
    explanation = `Keywords suggest substantial impact on neighborhood sanitation, arterial transport, or public pedestrian flow.`;
  } else if (lowKeywords.some(kw => combined.includes(kw))) {
    priority = "Low";
    explanation = `Standard maintenance queue. Issue presents minimal direct hazard to civilian safety.`;
  } else {
    priority = "Medium";
    explanation = `Typical civic defect assigned standard 48-hour resolution benchmark SLA.`;
  }

  return { category, priority, dept, explanation };
}

// Live typing trigger for Report Form
function triggerAiPrediction() {
  const title = document.getElementById("report-title").value;
  const desc = document.getElementById("report-desc").value;

  if (title.length < 3 && desc.length < 5) return;

  const result = simulateAiPrediction(title, desc);

  // Update UI live
  document.getElementById("ai-pred-category").textContent = result.category;
  
  const priBadge = document.getElementById("ai-pred-priority");
  priBadge.innerHTML = `<span class="badge badge-${result.priority.toLowerCase()}">${result.priority}</span>`;
  
  document.getElementById("ai-pred-dept").textContent = result.dept;
  document.getElementById("ai-pred-explanation").textContent = result.explanation;

  // Auto-sync category dropdown if user hasn't touched it
  const catSelect = document.getElementById("report-category");
  catSelect.value = result.category;

  // Duplicate Check
  checkForPotentialDuplicates(title, desc);
}

// Duplicate Detection Heuristic
let detectedDuplicateRecord = null;
function checkForPotentialDuplicates(title, desc) {
  const combined = `${title} ${desc}`.toLowerCase();
  const warningBox = document.getElementById("duplicate-warning");
  const details = document.getElementById("duplicate-details");

  detectedDuplicateRecord = null;

  for (const item of appState.complaints) {
    if (item.status === "Resolved" || item.status === "Rejected") continue;
    
    // Check keyword overlap
    const itemWords = `${item.title} ${item.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    const matches = itemWords.filter(w => combined.includes(w));
    
    if (matches.length >= 2) {
      detectedDuplicateRecord = item;
      warningBox.style.display = "block";
      details.textContent = `High similarity to #${item.id} ("${item.title}") filed for ${item.location}.`;
      return;
    }
  }

  warningBox.style.display = "none";
}

function showDuplicateModal() {
  if (detectedDuplicateRecord) {
    openComplaintModal(detectedDuplicateRecord.id);
  }
}

// ================= REPORT SUBMISSION =================
function handleImagePreview(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    appState.uploadedImageDataUrl = e.target.result;
    document.getElementById("image-preview-img").src = e.target.result;
    document.getElementById("image-preview-container").style.display = "block";
  };
  reader.readAsDataURL(file);
}

function removeImagePreview() {
  appState.uploadedImageDataUrl = "";
  document.getElementById("report-photo").value = "";
  document.getElementById("image-preview-container").style.display = "none";
}

function handleReportSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("report-title").value.trim();
  const desc = document.getElementById("report-desc").value.trim();
  const category = document.getElementById("report-category").value;
  const location = document.getElementById("report-location").value.trim();

  if (!title || !desc || !location) {
    showToast("Please complete all required fields", "warning");
    return;
  }

  const aiResult = simulateAiPrediction(title, desc);
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // Random demonstration coordinates around metro center
  const randomLat = 12.96 + (Math.random() * 0.03 - 0.015);
  const randomLng = 77.59 + (Math.random() * 0.03 - 0.015);

  const newTicket = {
    id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: title,
    description: desc,
    category: category || aiResult.category,
    priority: aiResult.priority,
    department: aiResult.dept,
    status: "Submitted",
    location: location,
    lat: randomLat,
    lng: randomLng,
    photoUrl: appState.uploadedImageDataUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
    reportedAt: timestamp,
    aiExplanation: aiResult.explanation,
    timeline: [
      { time: timestamp, text: `Logged by ${appState.currentUser.name}` },
      { time: timestamp, text: `AI Classified as ${aiResult.category} (${aiResult.priority} Priority)` }
    ]
  };

  // Add to top of state
  appState.complaints.unshift(newTicket);
  persistAppData();

  // Reset form
  document.getElementById("report-form").reset();
  removeImagePreview();
  document.getElementById("duplicate-warning").style.display = "none";

  showToast(`Success! Ticket #${newTicket.id} created & prioritized by CivicAI.`);

  // Render & switch to complaints view
  renderAllViews();
  switchView("complaints");
}

// ================= COMPLAINTS DIRECTORY & FILTERS =================
function applyFilters() {
  const searchQuery = document.getElementById("filter-search").value.toLowerCase();
  const catFilter = document.getElementById("filter-category").value;
  const priFilter = document.getElementById("filter-priority").value;
  const statusFilter = document.getElementById("filter-status").value;

  const filtered = appState.complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery) ||
                          c.title.toLowerCase().includes(searchQuery) ||
                          c.location.toLowerCase().includes(searchQuery);
    
    const matchesCat = catFilter === "ALL" || c.category === catFilter;
    const matchesPri = priFilter === "ALL" || c.priority === priFilter;
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;

    return matchesSearch && matchesCat && matchesPri && matchesStatus;
  });

  renderComplaintsTable(filtered);
}

function renderComplaintsTable(records) {
  const tbody = document.getElementById("complaints-table-tbody");
  const noRecords = document.getElementById("no-records-msg");
  
  if (!tbody) return;
  tbody.innerHTML = "";

  if (records.length === 0) {
    noRecords.style.display = "block";
    return;
  }
  noRecords.style.display = "none";

  records.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="font-bold text-xs" style="font-family:'JetBrains Mono';">${c.id}</span></td>
      <td>
        <div class="font-semibold">${escapeHtml(c.title)}</div>
        <div class="text-xs text-dim"><i data-lucide="map-pin" style="width:12px;height:12px;display:inline;"></i> ${escapeHtml(c.location)}</div>
      </td>
      <td><span class="text-xs">${c.category}</span></td>
      <td><span class="badge badge-${c.priority.toLowerCase()}">${c.priority}</span></td>
      <td><span class="text-xs font-semibold">${c.department}</span></td>
      <td><span class="badge badge-status-${formatStatusClass(c.status)}">${c.status}</span></td>
      <td><span class="text-xs text-dim">${c.reportedAt}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openComplaintModal('${c.id}')">
          <i data-lucide="external-link"></i> Inspect
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

function renderOverviewRecentTable() {
  const tbody = document.getElementById("overview-complaints-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const recent = appState.complaints.slice(0, 5);

  recent.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="font-bold text-xs" style="font-family:'JetBrains Mono';">${c.id}</span></td>
      <td>
        <div class="font-semibold">${escapeHtml(c.title)}</div>
        <div class="text-xs text-dim">${escapeHtml(c.location)}</div>
      </td>
      <td><span class="text-xs">${c.category}</span></td>
      <td><span class="badge badge-${c.priority.toLowerCase()}">${c.priority}</span></td>
      <td><span class="text-xs font-semibold">${c.department}</span></td>
      <td><span class="badge badge-status-${formatStatusClass(c.status)}">${c.status}</span></td>
      <td><span class="text-xs text-dim">${c.reportedAt}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openComplaintModal('${c.id}')">Inspect</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ================= MODAL & LIFECYCLE MANAGEMENT =================
function openComplaintModal(id) {
  const item = appState.complaints.find(c => c.id === id);
  if (!item) return;

  appState.selectedComplaintId = id;

  document.getElementById("modal-tracking-id").textContent = item.id;
  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-location").textContent = item.location;
  document.getElementById("modal-timestamp").textContent = item.reportedAt;
  document.getElementById("modal-desc").textContent = item.description;

  // Photo
  const imgWrapper = document.getElementById("modal-image-wrapper");
  const imgEl = document.getElementById("modal-image");
  if (item.photoUrl) {
    imgWrapper.style.display = "block";
    imgEl.src = item.photoUrl;
  } else {
    imgWrapper.style.display = "none";
  }

  // AI Info
  document.getElementById("modal-ai-cat").textContent = item.category;
  document.getElementById("modal-ai-pri").innerHTML = `<span class="badge badge-${item.priority.toLowerCase()}">${item.priority}</span>`;
  document.getElementById("modal-ai-dept").textContent = item.department;
  document.getElementById("modal-ai-reasoning").textContent = item.aiExplanation || "Automated civic heuristics categorization.";

  // Status Select
  document.getElementById("modal-status-select").value = item.status;

  // Admin Box visibility
  const adminBox = document.getElementById("modal-admin-actions");
  if (appState.userRole === "admin") {
    adminBox.style.display = "block";
    document.getElementById("admin-notice").textContent = "Admin Privileges Active";
  } else {
    adminBox.style.display = "none";
  }

  renderTimeline(item.timeline || []);

  document.getElementById("complaint-modal").style.display = "flex";
  lucide.createIcons();
}

function renderTimeline(timeline) {
  const container = document.getElementById("modal-timeline");
  container.innerHTML = "";

  timeline.forEach(event => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div>
        <div class="timeline-time">${event.time}</div>
        <div class="text-sm font-semibold">${event.text}</div>
      </div>
    `;
    container.appendChild(item);
  });
}

function updateComplaintStatus() {
  const newStatus = document.getElementById("modal-status-select").value;
  const item = appState.complaints.find(c => c.id === appState.selectedComplaintId);

  if (!item) return;

  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  item.status = newStatus;
  item.timeline.unshift({
    time: timestamp,
    text: `Status changed to ${newStatus} by Administrator (${appState.currentUser.name})`
  });

  persistAppData();
  renderTimeline(item.timeline);
  renderAllViews();
  showToast(`Ticket #${item.id} updated to: ${newStatus}`);
}

function closeModal() {
  document.getElementById("complaint-modal").style.display = "none";
  appState.selectedComplaintId = null;
}

function handleModalBackdropClick(e) {
  if (e.target.id === "complaint-modal") {
    closeModal();
  }
}

// ================= MAP INTEGRATION (LEAFLET) =================
function initOrRefreshMap() {
  const mapElement = document.getElementById("map-container");
  const fallback = document.getElementById("map-fallback");

  if (!window.L) {
    fallback.style.display = "flex";
    return;
  }
  fallback.style.display = "none";

  if (!appState.mapInstance) {
    appState.mapInstance = L.map('map-container').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(appState.mapInstance);
  } else {
    appState.mapInstance.invalidateSize();
  }

  // Clear existing markers
  appState.mapMarkers.forEach(m => appState.mapInstance.removeLayer(m));
  appState.mapMarkers = [];

  // Priority color map
  const colorMap = {
    Critical: "#EF4444",
    High: "#F59E0B",
    Medium: "#0284C7",
    Low: "#64748B"
  };

  appState.complaints.forEach(item => {
    if (!item.lat || !item.lng) return;

    const pinColor = colorMap[item.priority] || "#0284C7";
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color:${pinColor}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 6px rgba(0,0,0,0.4);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(appState.mapInstance);
    
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:180px;">
        <span style="font-size:0.75rem; font-weight:700; color:${pinColor}; text-transform:uppercase;">${item.priority} Priority</span>
        <h4 style="font-size:0.9rem; margin:2px 0 6px; font-weight:700;">${escapeHtml(item.title)}</h4>
        <p style="font-size:0.75rem; color:#64748B; margin-bottom:8px;">${escapeHtml(item.location)}</p>
        <button style="background:#0284C7; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" onclick="openComplaintModal('${item.id}')">Inspect Report</button>
      </div>
    `);

    appState.mapMarkers.push(marker);
  });
}

// ================= ANALYTICS & CHARTS =================
function calculateStats() {
  const total = appState.complaints.length;
  const pending = appState.complaints.filter(c => c.status === "Submitted" || c.status === "Under Review").length;
  const high = appState.complaints.filter(c => c.priority === "High" || c.priority === "Critical").length;
  const resolved = appState.complaints.filter(c => c.status === "Resolved").length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("stat-high").textContent = high;
  document.getElementById("stat-resolved").textContent = resolved;
}

function renderOverviewCharts() {
  if (!window.Chart) return;

  // 1. Categories
  const catCounts = {};
  appState.complaints.forEach(c => catCounts[c.category] = (catCounts[c.category] || 0) + 1);

  const ctxCat = document.getElementById("overviewCategoryChart")?.getContext("2d");
  if (ctxCat) {
    if (appState.charts.categoryChart) appState.charts.categoryChart.destroy();
    appState.charts.categoryChart = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: Object.keys(catCounts),
        datasets: [{
          data: Object.values(catCounts),
          backgroundColor: ['#0284C7', '#06B6D4', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
        }
      }
    });
  }

  // 2. Status
  const statusCounts = {};
  appState.complaints.forEach(c => statusCounts[c.status] = (statusCounts[c.status] || 0) + 1);

  const ctxStatus = document.getElementById("overviewStatusChart")?.getContext("2d");
  if (ctxStatus) {
    if (appState.charts.statusChart) appState.charts.statusChart.destroy();
    appState.charts.statusChart = new Chart(ctxStatus, {
      type: 'bar',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          label: 'Complaints',
          data: Object.values(statusCounts),
          backgroundColor: '#0F172A',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

function renderAnalyticsCharts() {
  if (!window.Chart) return;

  // Workload by Dept
  const deptCounts = {};
  appState.complaints.forEach(c => deptCounts[c.department] = (deptCounts[c.department] || 0) + 1);

  const ctxDept = document.getElementById("deptWorkloadChart")?.getContext("2d");
  if (ctxDept) {
    if (appState.charts.deptChart) appState.charts.deptChart.destroy();
    appState.charts.deptChart = new Chart(ctxDept, {
      type: 'polarArea',
      data: {
        labels: Object.keys(deptCounts),
        datasets: [{
          data: Object.values(deptCounts),
          backgroundColor: [
            'rgba(2, 132, 199, 0.75)',
            'rgba(6, 182, 212, 0.75)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(239, 68, 68, 0.75)',
            'rgba(139, 92, 246, 0.75)',
            'rgba(16, 185, 129, 0.75)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } }
      }
    });
  }

  // Priority Ratio
  const priCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  appState.complaints.forEach(c => {
    if (priCounts[c.priority] !== undefined) priCounts[c.priority]++;
  });

  const ctxPri = document.getElementById("priorityRatioChart")?.getContext("2d");
  if (ctxPri) {
    if (appState.charts.priorityChart) appState.charts.priorityChart.destroy();
    appState.charts.priorityChart = new Chart(ctxPri, {
      type: 'pie',
      data: {
        labels: Object.keys(priCounts),
        datasets: [{
          data: Object.values(priCounts),
          backgroundColor: ['#EF4444', '#F59E0B', '#0284C7', '#94A3B8']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Resolution Rate by Dept
  const deptResolved = {};
  Object.keys(deptCounts).forEach(d => {
    const total = appState.complaints.filter(c => c.department === d).length;
    const res = appState.complaints.filter(c => c.department === d && c.status === "Resolved").length;
    deptResolved[d] = total > 0 ? Math.round((res / total) * 100) : 0;
  });

  const ctxRes = document.getElementById("resolutionRateChart")?.getContext("2d");
  if (ctxRes) {
    if (appState.charts.resolutionChart) appState.charts.resolutionChart.destroy();
    appState.charts.resolutionChart = new Chart(ctxRes, {
      type: 'bar',
      data: {
        labels: Object.keys(deptResolved),
        datasets: [{
          label: 'Resolution Rate (%)',
          data: Object.values(deptResolved),
          backgroundColor: '#10B981',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { max: 100, beginAtZero: true }
        }
      }
    });
  }

  generateAiInsights();
}

function generateAiInsights() {
  const container = document.getElementById("ai-insights-container");
  if (!container) return;

  const total = appState.complaints.length;
  const critical = appState.complaints.filter(c => c.priority === "Critical" && c.status !== "Resolved").length;
  
  // Find top category
  const catCounts = {};
  appState.complaints.forEach(c => catCounts[c.category] = (catCounts[c.category] || 0) + 1);
  let topCat = "General";
  let maxCount = 0;
  for (const [k, v] of Object.entries(catCounts)) {
    if (v > maxCount) {
      maxCount = v;
      topCat = k;
    }
  }

  container.innerHTML = `
    <div class="ai-box">
      <div class="text-xs uppercase text-dim tracking-wider font-semibold mb-1">Bottleneck Warning</div>
      <div class="font-bold text-sm text-red mb-1">${critical} Unresolved Critical Hazards</div>
      <p class="text-xs text-dim">Urgent municipal triage required for high-risk safety and pipe rupture reports.</p>
    </div>
    <div class="ai-box">
      <div class="text-xs uppercase text-dim tracking-wider font-semibold mb-1">Volume Concentration</div>
      <div class="font-bold text-sm text-blue mb-1">${topCat} (${Math.round((maxCount/total)*100)}% of reports)</div>
      <p class="text-xs text-dim">Highest civic friction index observed in this department domain.</p>
    </div>
    <div class="ai-box">
      <div class="text-xs uppercase text-dim tracking-wider font-semibold mb-1">Resolution Velocity</div>
      <div class="font-bold text-sm text-green mb-1">${Math.round((appState.complaints.filter(c => c.status === "Resolved").length / total) * 100)}% Public Close Rate</div>
      <p class="text-xs text-dim">Satisfactory civic closure on benchmark test fixtures.</p>
    </div>
  `;
}

// ================= AI CONVERSATIONAL BOT =================
function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const query = input.value.trim();
  if (!query) return;

  appendChatBubble(query, "user");
  input.value = "";

  setTimeout(() => {
    const reply = generateBotResponse(query);
    appendChatBubble(reply, "bot");
  }, 400);
}

function askQuestion(question) {
  appendChatBubble(question, "user");
  setTimeout(() => {
    const reply = generateBotResponse(question);
    appendChatBubble(reply, "bot");
  }, 350);
}

function appendChatBubble(text, sender) {
  const container = document.getElementById("chat-messages");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function generateBotResponse(query) {
  const q = query.toLowerCase();

  if (q.includes("pothole") || q.includes("road")) {
    return `To report a pothole, navigate to <strong>Report an Issue</strong>, provide the street landmark, and upload a photo. CivicAI will classify it under <em>Roads & Public Works</em> and designate its severity based on traffic volume.`;
  }
  if (q.includes("garbage") || q.includes("trash") || q.includes("sanitation")) {
    return `Garbage overflow, street litter, and waste dump issues are assigned directly to the <strong>Sanitation Department</strong>. Urgent health violations receive High priority automatically.`;
  }
  if (q.includes("track") || q.includes("status") || q.includes("find")) {
    return `You can track complaints in the <strong>All Complaints</strong> registry by searching the unique tracking ID (e.g. <code>TKT-1082</code>) or filtering by status.`;
  }
  if (q.includes("high priority") || q.includes("critical")) {
    const highTickets = appState.complaints.filter(c => c.priority === "Critical" || c.priority === "High");
    return `There are currently <strong>${highTickets.length} high or critical priority incidents</strong> in the registry. These include dangerous issues such as open electrical junction boxes and water main ruptures.`;
  }
  if (q.includes("pending")) {
    const pending = appState.complaints.filter(c => c.status === "Submitted" || c.status === "Under Review").length;
    return `There are currently <strong>${pending} pending issues</strong> awaiting departmental review or squad assignment.`;
  }

  return `I understand you're asking about "<em>${escapeHtml(query)}</em>". CivicAI's simulation engine actively monitors public hazards, estimates urgency, and dispatches to appropriate departments: Roads, Sanitation, Water, Electricity, Drainage, or Public Safety.`;
}

function clearChat() {
  const container = document.getElementById("chat-messages");
  container.innerHTML = `
    <div class="chat-bubble bot">
      Chat session refreshed. How can I assist with municipal city triage or current demo reports?
    </div>
  `;
}

// ================= DEMO UTILITIES =================
function confirmResetData() {
  if (confirm("Reset all complaints back to the original 12 benchmark demo records?")) {
    appState.complaints = JSON.parse(JSON.stringify(DEFAULT_COMPLAINTS));
    persistAppData();
    renderAllViews();
    showToast("Application state reset to benchmark records");
  }
}

function injectDemoBurstIssue() {
  const burstId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const burstComplaint = {
    id: burstId,
    title: "Catastrophic 24-inch Water Main Rupture under Grand Arterial",
    description: "Road surface lifting and buckled from extreme underground hydraulic pressure. Flooding entire four-lane boulevard.",
    category: "Water Department",
    priority: "Critical",
    department: "Water Department",
    status: "Submitted",
    location: "Grand Arterial & 12th Avenue",
    lat: 12.9730,
    lng: 77.5990,
    photoUrl: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80",
    reportedAt: timestamp,
    aiExplanation: "Keywords 'catastrophic', 'rupture', 'hydraulic pressure' flagged top-level Critical emergency.",
    timeline: [
      { time: timestamp, text: "Automated hydraulic sensor and citizen burst alert" }
    ]
  };

  appState.complaints.unshift(burstComplaint);
  persistAppData();
  renderAllViews();
  showToast(`Simulated Influx: Urgent #${burstId} injected into city state!`, "warning");
}

// ================= GLOBAL HELPERS & TOASTS =================
function renderAllViews() {
  calculateStats();
  renderOverviewRecentTable();
  applyFilters();
  renderOverviewCharts();
  renderAnalyticsCharts();
  if (appState.activeView === "map") {
    initOrRefreshMap();
  }
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="bell" style="width:16px;height:16px;color:var(--cyan-accent);flex-shrink:0;"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================= LIFECYCLE MOUNT =================
window.addEventListener("DOMContentLoaded", () => {
  initAppData();
  lucide.createIcons();
});
