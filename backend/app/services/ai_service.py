import re
import json
import logging
from typing import Dict, Any, List, Optional
import requests
from app.core.config import settings

logger = logging.getLogger(__name__)

CATEGORY_KEYWORDS = {
    "Roads and potholes": [
        "pothole", "crater", "road", "asphalt", "pavement", "speed breaker", "tar", 
        "curb", "divider", "sinkhole", "bump", "footpath", "sidewalk", "cobblestone"
    ],
    "Garbage and sanitation": [
        "garbage", "trash", "bin", "waste", "dump", "litter", "smell", "stench", 
        "rotting", "debris", "sanitation", "sweep", "filth", "dumpster", "cleanliness"
    ],
    "Water supply and leakage": [
        "water", "pipe", "leak", "leakage", "burst", "faucet", "contaminated", "dirty water", 
        "supply", "pressure", "valve", "drinking", "pipeline", "tap", "seepage"
    ],
    "Streetlights and electricity": [
        "light", "streetlight", "dark", "lamp", "electrical", "transformer", "wire", 
        "spark", "sparking", "dangling", "power", "pole", "blackout", "bulb", "cabling"
    ],
    "Drainage and flooding": [
        "drain", "sewer", "blockage", "waterlogging", "flood", "flooding", "gutter", 
        "manhole", "overflow", "stormwater", "monsoon", "stagnant", "clogged"
    ],
    "Public safety": [
        "collapsed", "hanging wire", "open manhole", "danger", "cave-in", "unsafe", 
        "hazard", "structural", "bridge", "crack", "accident", "emergency", "fire", "risk"
    ]
}

CATEGORY_TO_DEPARTMENT = {
    "Roads and potholes": "Roads and Public Works",
    "Garbage and sanitation": "Sanitation",
    "Water supply and leakage": "Water Department",
    "Streetlights and electricity": "Electricity Department",
    "Drainage and flooding": "Drainage and Public Health",
    "Public safety": "Public Safety",
    "Other": "General Administration"
}

CRITICAL_INDICATORS = [
    "open manhole", "live wire", "sparking", "cave-in", "collapse", "gas leak", 
    "electrocution", "severe flood", "life threatening", "toxic", "deep crater"
]

HIGH_INDICATORS = [
    "blocked road", "major leak", "burst pipe", "overflowing sewer", "pitch dark", 
    "accident prone", "dangling wire", "large pothole", "foul smell entering homes",
    "flooded street", "school", "hospital"
]

LOW_INDICATORS = [
    "minor", "cosmetic", "paint", "faded", "small weed", "dusty", "flyer", "suggestion"
]

class AIService:
    @staticmethod
    def local_classify(title: str, description: str) -> Dict[str, Any]:
        """Deterministic local classifier with keyword matching, priority estimation and explanation."""
        text = f"{title} {description}".lower()
        
        # 1. Category Classification
        scores = {cat: 0 for cat in CATEGORY_KEYWORDS}
        for cat, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', text):
                    scores[cat] += 2 if kw in title.lower() else 1

        best_category = max(scores, key=scores.get)
        if scores[best_category] == 0:
            category = "Other"
        else:
            category = best_category

        # 2. Priority Estimation & Explanation
        priority = "Medium"
        explanation = "Issue classified as Medium priority based on standard civic impact analysis."

        # Check critical
        matched_crit = [kw for kw in CRITICAL_INDICATORS if kw in text]
        if matched_crit:
            priority = "Critical"
            explanation = f"Elevated to Critical priority due to detected hazard indicators: {', '.join(matched_crit)}. Immediate intervention recommended."
        else:
            matched_high = [kw for kw in HIGH_INDICATORS if kw in text]
            if matched_high or category in ["Public safety", "Drainage and flooding"]:
                priority = "High"
                reasons = matched_high if matched_high else [f"high-risk category '{category}'"]
                explanation = f"Assigned High priority based on public disruption risk factors: {', '.join(reasons)}."
            else:
                matched_low = [kw for kw in LOW_INDICATORS if kw in text]
                if matched_low:
                    priority = "Low"
                    explanation = f"Categorized as Low priority as description indicates routine maintenance ({', '.join(matched_low)})."
                else:
                    priority = "Medium"
                    explanation = f"Assigned Medium priority for regular operational processing under {category}."

        # 3. Department
        department = CATEGORY_TO_DEPARTMENT.get(category, "General Administration")

        # 4. Summary
        clean_title = title.strip()
        summary = f"{category} report regarding '{clean_title}'. Estimated priority: {priority} (routed to {department})."

        return {
            "category": category,
            "priority": priority,
            "priority_explanation": explanation,
            "department": department,
            "summary": summary,
            "is_ai_powered": False
        }

    @classmethod
    def classify_issue(cls, title: str, description: str) -> Dict[str, Any]:
        """Classify issue using Gemini API if key is available; fallback to deterministic local classifier."""
        if not settings.GEMINI_API_KEY:
            return cls.local_classify(title, description)

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            prompt = f"""
You are an expert civic AI analyst. Classify the following citizen report.

Report Title: {title}
Report Description: {description}

Valid Categories:
- Roads and potholes
- Garbage and sanitation
- Water supply and leakage
- Streetlights and electricity
- Drainage and flooding
- Public safety
- Other

Valid Priorities:
- Low
- Medium
- High
- Critical

Valid Departments:
- Roads and Public Works
- Sanitation
- Water Department
- Electricity Department
- Drainage and Public Health
- Public Safety
- General Administration

Respond ONLY with valid JSON in this exact structure:
{{
  "category": "one of the valid categories",
  "priority": "one of the valid priorities",
  "priority_explanation": "brief 1-2 sentence reason for this priority rating",
  "department": "one of the valid departments",
  "summary": "1 sentence executive summary of the complaint"
}}
"""
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}
            }
            resp = requests.post(url, json=payload, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_content)
                parsed["is_ai_powered"] = True
                return parsed
        except Exception as e:
            logger.warning(f"Gemini API classification failed, falling back to local: {e}")

        # Fallback to local
        result = cls.local_classify(title, description)
        return result

    @classmethod
    def chat_assistant(cls, user_message: str, history: List[Dict[str, str]], context_issues: List[Dict[str, Any]]) -> str:
        """AI Chat assistant answering citizen questions using actual database context."""
        # Check if Gemini key is available
        if settings.GEMINI_API_KEY:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                context_str = json.dumps(context_issues[:8], default=str)
                system_instruction = f"""
You are CivicAI Assistant, an AI helper for citizens on the CivicAI platform.
Your tagline is: "Smarter Reports. Safer Communities."
You assist users with reporting civic problems (potholes, garbage, water leaks, streetlights, drainage, public safety), tracking existing complaints, and checking recent issues.

CRITICAL INSTRUCTIONS:
- You must use ACTUAL civic issue data provided in the context below.
- Do NOT fabricate or hallucinate issue IDs, coordinates, or resolution claims.
- If asking about status, explain: Submitted -> Under Review -> Assigned -> In Progress -> Resolved (or Rejected).
- Keep answers warm, concise, and helpful.

Context of real complaints in database:
{context_str}
"""
                contents = []
                for msg in history[-6:]:
                    contents.append({
                        "role": "user" if msg.get("role") == "user" else "model",
                        "parts": [{"text": msg.get("content", "")}]
                    })
                contents.append({
                    "role": "user",
                    "parts": [{"text": f"System context:\n{system_instruction}\n\nUser Question: {user_message}"}]
                })

                resp = requests.post(url, json={"contents": contents}, timeout=6)
                if resp.status_code == 200:
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                logger.warning(f"Gemini chat failed, falling back to rule-based assistant: {e}")

        # Local Rule-Based Chat Assistant
        msg_lower = user_message.lower()
        
        # 1. Tracking query (e.g., checking tracking id)
        track_match = re.search(r'\b(civic-\d{4}-[a-z0-9]+)\b', msg_lower)
        if track_match:
            target_id = track_match.group(1).upper()
            found = next((i for i in context_issues if i.get("tracking_id") == target_id), None)
            if found:
                return (
                    f"Report **{found['tracking_id']}** ('{found['title']}') is currently **{found['status']}**.\n\n"
                    f"- **Category:** {found['category']}\n"
                    f"- **Priority:** {found['priority']}\n"
                    f"- **Department:** {found['department']}\n"
                    f"- **Reported On:** {str(found.get('created_at', ''))[:10]}\n\n"
                    f"You can view its full timeline and add comments on its details page."
                )
            else:
                return f"I searched the active records but could not locate tracking ID `{target_id}`. Please double check the ID format (e.g., `CIVIC-2026-XXXXX`)."

        # 2. How to report
        if any(w in msg_lower for w in ["how to report", "file a complaint", "new report", "submit issue"]):
            return (
                "To report a civic problem:\n\n"
                "1. Click **'Report Issue'** in the navigation menu.\n"
                "2. Enter a clear title and description of the situation.\n"
                "3. CivicAI will automatically predict the category and priority for you.\n"
                "4. Upload an optional photograph and pinpoint the location on our interactive map.\n"
                "5. Submit your report to receive a real-time tracking ID!"
            )

        # 3. Status explanation
        if any(w in msg_lower for w in ["status", "lifecycle", "how does status work", "in progress", "resolved"]):
            return (
                "CivicAI tracks complaints through transparent lifecycle stages:\n\n"
                "- **Submitted:** Received and logged into the system.\n"
                "- **Under Review:** AI has classified the issue and administrators are reviewing it.\n"
                "- **Assigned:** Dispatched to the relevant municipal department (e.g., Sanitation, Works).\n"
                "- **In Progress:** Field crews or maintenance teams are actively addressing the problem.\n"
                "- **Resolved:** Work has been verified and completed.\n"
                "- **Rejected:** Duplicate, outside municipal jurisdiction, or incomplete information."
            )

        # 4. Nearby / Recent issues query
        if any(w in msg_lower for w in ["nearby", "recent", "what issues", "current complaints", "latest"]):
            if context_issues:
                sample = context_issues[:4]
                issue_lines = [
                    f"- **{i['tracking_id']}**: {i['title']} ({i['category']} - *{i['status']}*)"
                    for i in sample
                ]
                return (
                    f"Here are recent civic issues recorded in the system:\n\n" +
                    "\n".join(issue_lines) +
                    "\n\nYou can explore all public reports on the interactive **Community Map**!"
                )
            return "There are currently no active civic complaints recorded in your area. You can be the first to report one!"

        # Default helpful assistant reply
        return (
            "Hello! I am your CivicAI Assistant. I can help you:\n\n"
            "- Learn **how to report** a civic issue (potholes, garbage, water leaks, etc.)\n"
            "- **Track an existing report** (just give me your tracking ID like `CIVIC-2026-XXXXX`)\n"
            "- Understand **issue statuses** and resolution timelines\n"
            "- Discover **recent community issues** in your area\n\n"
            "What would you like assistance with today?"
        )
