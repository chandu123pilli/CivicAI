import os
import sys
from datetime import datetime, timedelta, timezone

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app.db.session import SessionLocal, engine
from app.db.init_db import init_db
from app.core.security import hash_password
from app.models.models import User, Issue, IssueStatusHistory, PotentialDuplicates, Comment, Notification

def seed():
    print("Initializing database tables...")
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_admin = db.query(User).filter(User.email == "admin@civicai.org").first()
        if existing_admin:
            print("Database already contains seed data. Skipping creation.")
            return

        print("Seeding demo users...")
        # 1. Administrator
        admin = User(
            full_name="Chief Admin Sarah Jenkins",
            email="admin@civicai.org",
            password_hash=hash_password("AdminPassword123!"),
            role="admin",
            phone="+1-555-0199",
            department="Public Works & Municipal Oversight"
        )
        # 2. Citizen Alex
        alex = User(
            full_name="Alex Rivera",
            email="citizen.alex@civicai.org",
            password_hash=hash_password("CitizenPassword123!"),
            role="citizen",
            phone="+1-555-0142"
        )
        # 3. Citizen Maya
        maya = User(
            full_name="Maya Chen",
            email="citizen.maya@civicai.org",
            password_hash=hash_password("CitizenPassword123!"),
            role="citizen",
            phone="+1-555-0188"
        )
        db.add_all([admin, alex, maya])
        db.commit()
        db.refresh(admin)
        db.refresh(alex)
        db.refresh(maya)

        now = datetime.now(timezone.utc)

        # 16 Diverse Complaints
        raw_issues = [
            {
                "tracking_id": "CIVIC-2026-A10101",
                "user_id": alex.id,
                "title": "Severe Deep Pothole on 5th Ave & Market St",
                "description": "Large dangerous pothole measuring approx 3 feet wide and 6 inches deep in the middle vehicular lane. Cars are swerving dangerously into oncoming traffic to avoid rim damage.",
                "category": "Roads and potholes",
                "priority": "High",
                "ai_priority_explanation": "Assigned High priority based on severe traffic hazard indicators and swerving risk on primary arterial avenue.",
                "department": "Roads and Public Works",
                "status": "In Progress",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "address": "5th Ave & Market St, Downtown",
                "ai_summary": "Deep 3-foot pothole on central lane of 5th Ave creating vehicular rim damage and collision risk.",
                "days_ago": 4,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-A10102",
                "user_id": maya.id,
                "title": "Road Crater and Cracked Asphalt near 5th and Market",
                "description": "Very big hole in the road surface right next to the bus stop on 5th Ave. Bus tires hit it loudly every morning.",
                "category": "Roads and potholes",
                "priority": "High",
                "ai_priority_explanation": "High priority due to road surface impact near public transit stop.",
                "department": "Roads and Public Works",
                "status": "Under Review",
                "latitude": 37.7752,
                "longitude": -122.4190,
                "address": "480 Market St near 5th Ave",
                "ai_summary": "Bus stop pavement crater reported near 5th and Market.",
                "days_ago": 2,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-B20201",
                "user_id": alex.id,
                "title": "Main Water Pipe Burst Flooding Elm Street Pedestrian Walkway",
                "description": "Clean pressurized drinking water gushing across Elm Street from an underground municipal main. Water is pooling around store entrances and wasting immense volume.",
                "category": "Water supply and leakage",
                "priority": "Critical",
                "ai_priority_explanation": "Elevated to Critical priority due to detected hazard indicators: pipe burst, continuous gushing water, property flooding risk.",
                "department": "Water Department",
                "status": "Assigned",
                "latitude": 37.7833,
                "longitude": -122.4167,
                "address": "742 Elm St, Civic Center",
                "ai_summary": "Pressurized water main rupture causing urban flooding on Elm St sidewalk.",
                "days_ago": 3,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-B20202",
                "user_id": maya.id,
                "title": "Massive Water Leak and Pavement Geyser on 700 block Elm St",
                "description": "Water pipe under sidewalk has cracked open and water is streaming down Elm Street gutter toward sewer. Urgent shutoff needed.",
                "category": "Water supply and leakage",
                "priority": "Critical",
                "ai_priority_explanation": "Critical priority: high pressure pipe rupture requiring immediate main shutoff.",
                "department": "Water Department",
                "status": "Under Review",
                "latitude": 37.7831,
                "longitude": -122.4165,
                "address": "710 Elm St, Commercial Corridor",
                "ai_summary": "Sidewalk water pipe rupture near 700 Elm St.",
                "days_ago": 1,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-C30301",
                "user_id": maya.id,
                "title": "Overflowing Public Waste Bins and Scattered Trash in Oak Park",
                "description": "All four garbage bins near the playground have been overflowing for over three days. Wind is blowing food wrappers, plastic containers, and litter across the grass.",
                "category": "Garbage and sanitation",
                "priority": "Medium",
                "ai_priority_explanation": "Assigned Medium priority for regular operational processing under Sanitation.",
                "department": "Sanitation",
                "status": "Resolved",
                "latitude": 37.7690,
                "longitude": -122.4467,
                "address": "Oak Park Playground Area, Mission District",
                "ai_summary": "Overflowing public trash cans and litter dispersion at Oak Park playground.",
                "days_ago": 7,
                "resolved": True,
                "resolved_days_ago": 5,
                "resolution_details": "Sanitation crew emptied all 4 municipal bins, sanitized surrounding turf, and installed 2 high-capacity wildlife-proof receptacles."
            },
            {
                "tracking_id": "CIVIC-2026-D40401",
                "user_id": alex.id,
                "title": "Dangling Live Electrical Cable Sparking at Bush St Crosswalk",
                "description": "High voltage overhead utility cable snapped during high winds. The wire is dangling within 6 feet of the pedestrian crosswalk and sparking occasionally against the metal guardrail.",
                "category": "Public safety",
                "priority": "Critical",
                "ai_priority_explanation": "Elevated to Critical priority due to detected hazard indicators: live wire, sparking, hanging wire, severe electrocution hazard.",
                "department": "Public Safety",
                "status": "Resolved",
                "latitude": 37.7895,
                "longitude": -122.4089,
                "address": "Bush St & Montgomery St Intersection",
                "ai_summary": "Snapped live electrical wire sparking near pedestrian crossing.",
                "days_ago": 8,
                "resolved": True,
                "resolved_days_ago": 7,
                "resolution_details": "Emergency electrical response team isolated the circuit within 45 minutes, replaced damaged line tensioners, and restored safe grid connectivity."
            },
            {
                "tracking_id": "CIVIC-2026-E50501",
                "user_id": maya.id,
                "title": "Three Consecutive Streetlights Blacked Out on Maple Ave",
                "description": "Entire block of Maple Ave between 14th and 15th streets is pitch dark at night. Students and elderly residents walk here from the light rail station.",
                "category": "Streetlights and electricity",
                "priority": "High",
                "ai_priority_explanation": "Assigned High priority based on public disruption risk factors: pitch dark corridor on commuter pedestrian route.",
                "department": "Electricity Department",
                "status": "In Progress",
                "latitude": 37.7601,
                "longitude": -122.4220,
                "address": "Maple Ave between 14th & 15th St",
                "ai_summary": "3 non-functioning street lamps creating pitch dark corridor on Maple Ave.",
                "days_ago": 5,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-F60601",
                "user_id": alex.id,
                "title": "Stormwater Drain Clogged with Tree Debris Causing Street Flood",
                "description": "Storm drain inlet at the lowest dip of Pine St is completely blocked with palm leaves and gravel. Rainwater is backing up onto the sidewalks and driveway ramps.",
                "category": "Drainage and flooding",
                "priority": "High",
                "ai_priority_explanation": "Assigned High priority based on stormwater inundation and sidewalk waterlogging risk.",
                "department": "Drainage and Public Health",
                "status": "Assigned",
                "latitude": 37.7910,
                "longitude": -122.4150,
                "address": "1240 Pine St, Nob Hill",
                "ai_summary": "Debris-clogged stormwater catch basin causing sidewalk flooding.",
                "days_ago": 3,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-G70701",
                "user_id": maya.id,
                "title": "Illegal Commercial Construction Waste Dumped in Alleyway",
                "description": "Large pile of broken drywall, paint buckets, and concrete rubble dumped overnight behind the supermarket in commercial alley.",
                "category": "Garbage and sanitation",
                "priority": "Medium",
                "ai_priority_explanation": "Assigned Medium priority for regular operational processing under Sanitation.",
                "department": "Sanitation",
                "status": "Submitted",
                "latitude": 37.7550,
                "longitude": -122.4180,
                "address": "Alley behind 2200 Mission St",
                "ai_summary": "Illegal drywall and construction debris dump in commercial alleyway.",
                "days_ago": 1,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-H80801",
                "user_id": alex.id,
                "title": "Missing Heavy Cast-Iron Manhole Cover near Elementary School",
                "description": "Open sewer manhole with no barrier or warning cone on school morning route. Severe risk of a child or cyclist falling in.",
                "category": "Public safety",
                "priority": "Critical",
                "ai_priority_explanation": "Elevated to Critical priority due to detected hazard indicators: open manhole, severe accident risk adjacent to school zone.",
                "department": "Public Safety",
                "status": "Resolved",
                "latitude": 37.7780,
                "longitude": -122.4350,
                "address": "Webster St & Grove St School Crossing",
                "ai_summary": "Open storm manhole missing lid near elementary school crossing.",
                "days_ago": 6,
                "resolved": True,
                "resolved_days_ago": 5,
                "resolution_details": "Emergency barricade placed within 20 mins. Public Works installed a locking tamper-proof ductile iron manhole cover."
            },
            {
                "tracking_id": "CIVIC-2026-I90901",
                "user_id": maya.id,
                "title": "Faded Crosswalk Paint at Busy Senior Community Intersection",
                "description": "Zebra crossing markings on Sutter St have almost completely faded. Vehicles do not stop for pedestrians navigating with walkers and wheelchairs.",
                "category": "Roads and potholes",
                "priority": "Medium",
                "ai_priority_explanation": "Assigned Medium priority for road markings repaint schedule.",
                "department": "Roads and Public Works",
                "status": "Under Review",
                "latitude": 37.7870,
                "longitude": -122.4280,
                "address": "Sutter St & Laguna St",
                "ai_summary": "Faded zebra crosswalk lines causing vehicle compliance issues near senior home.",
                "days_ago": 6,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-J10001",
                "user_id": alex.id,
                "title": "Flickering Street Lamp Causing Strobe Effect in Residential Bedroom",
                "description": "Streetlight #402 flickers on and off every two seconds like a strobe light, disturbing sleep of residents in adjacent apartments.",
                "category": "Streetlights and electricity",
                "priority": "Low",
                "ai_priority_explanation": "Categorized as Low priority as description indicates routine maintenance (flickering ballast component).",
                "department": "Electricity Department",
                "status": "Assigned",
                "latitude": 37.7630,
                "longitude": -122.4330,
                "address": "402 Castro St",
                "ai_summary": "Flickering streetlight bulb causing strobe nuisance at night.",
                "days_ago": 4,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-K11001",
                "user_id": maya.id,
                "title": "Low Water Pressure and Discolored Tap Water in High-Rise Complex",
                "description": "Residents on floors 4 through 12 have experienced brown rusty water and very low pressure for the past 12 hours.",
                "category": "Water supply and leakage",
                "priority": "High",
                "ai_priority_explanation": "Assigned High priority based on public health and drinking water contamination indicators.",
                "department": "Water Department",
                "status": "In Progress",
                "latitude": 37.7950,
                "longitude": -122.4020,
                "address": "550 Battery St Financial District",
                "ai_summary": "Turbid discolored municipal water and pressure drop affecting residential building.",
                "days_ago": 2,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-L12001",
                "user_id": alex.id,
                "title": "Collapsed Concrete Retaining Wall Curbing after Heavy Rain",
                "description": "A 10-foot section of the public park stone retaining wall collapsed onto the bicycle pathway, scattering heavy rocks.",
                "category": "Public safety",
                "priority": "High",
                "ai_priority_explanation": "Assigned High priority based on structural collapse blocking active transit pathway.",
                "department": "Roads and Public Works",
                "status": "Submitted",
                "latitude": 37.7670,
                "longitude": -122.4550,
                "address": "Buena Vista Park North Trailhead",
                "ai_summary": "Stone retaining wall partial collapse obstructing bicycle trail.",
                "days_ago": 1,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-M13001",
                "user_id": maya.id,
                "title": "Foul Odor and Raw Sewage Backing Up into Curbside Gutter",
                "description": "Sanitary sewer line appears to be blocked down the line, causing foul-smelling gray water to bubble up from curb grates.",
                "category": "Drainage and flooding",
                "priority": "Critical",
                "ai_priority_explanation": "Elevated to Critical priority due to detected hazard indicators: raw sewage backup, public health hazard.",
                "department": "Drainage and Public Health",
                "status": "In Progress",
                "latitude": 37.7520,
                "longitude": -122.4130,
                "address": "26th St & Folsom St",
                "ai_summary": "Sanitary sewer surge and odor emission at curbside grate.",
                "days_ago": 2,
                "resolved": False
            },
            {
                "tracking_id": "CIVIC-2026-N14001",
                "user_id": alex.id,
                "title": "Overgrown Tree Branches Obscuring Stop Sign at Intersecting Roads",
                "description": "Dense leafy eucalyptus branches completely block view of the Stop sign for drivers traveling westbound, nearly causing a collision.",
                "category": "Public safety",
                "priority": "High",
                "ai_priority_explanation": "Assigned High priority due to traffic sign obstruction and imminent collision hazard.",
                "department": "Roads and Public Works",
                "status": "Resolved",
                "latitude": 37.7450,
                "longitude": -122.4380,
                "address": "Noe St & 28th St",
                "ai_summary": "Vegetation obscuring regulatory Stop sign at residential junction.",
                "days_ago": 9,
                "resolved": True,
                "resolved_days_ago": 7,
                "resolution_details": "City arborists trimmed branches back 15 feet. Stop sign is now clearly visible from 200 feet."
            }
        ]

        print("Inserting fictional demo civic complaints...")
        created_issue_objs = []
        for item in raw_issues:
            created_time = now - timedelta(days=item["days_ago"], hours=2)
            resolved_time = (
                now - timedelta(days=item["resolved_days_ago"])
                if item.get("resolved") and "resolved_days_ago" in item
                else None
            )

            issue = Issue(
                tracking_id=item["tracking_id"],
                user_id=item["user_id"],
                title=item["title"],
                description=item["description"],
                category=item["category"],
                priority=item["priority"],
                ai_priority_explanation=item["ai_priority_explanation"],
                department=item["department"],
                status=item["status"],
                image_path=None,
                latitude=item["latitude"],
                longitude=item["longitude"],
                address=item["address"],
                ai_summary=item["ai_summary"],
                admin_notes="Reviewed during daily municipal civic triage." if item["status"] != "Submitted" else None,
                resolution_details=item.get("resolution_details"),
                created_at=created_time,
                updated_at=created_time + timedelta(hours=3),
                resolved_at=resolved_time
            )
            db.add(issue)
            created_issue_objs.append(issue)

        db.commit()
        for i in created_issue_objs:
            db.refresh(i)

        print("Seeding status history timelines and comments...")
        # Add realistic history entries
        for issue in created_issue_objs:
            # 1. Submission
            h1 = IssueStatusHistory(
                issue_id=issue.id,
                previous_status=None,
                new_status="Submitted",
                changed_by=issue.user_id,
                note="Report submitted via citizen mobile web platform.",
                created_at=issue.created_at
            )
            db.add(h1)

            if issue.status in ["Under Review", "Assigned", "In Progress", "Resolved"]:
                h2 = IssueStatusHistory(
                    issue_id=issue.id,
                    previous_status="Submitted",
                    new_status="Under Review",
                    changed_by=admin.id,
                    note="AI classification verified. Case opened for departmental coordination.",
                    created_at=issue.created_at + timedelta(hours=2)
                )
                db.add(h2)

            if issue.status in ["Assigned", "In Progress", "Resolved"]:
                h3 = IssueStatusHistory(
                    issue_id=issue.id,
                    previous_status="Under Review",
                    new_status="Assigned",
                    changed_by=admin.id,
                    note=f"Dispatched task to {issue.department} regional service division.",
                    created_at=issue.created_at + timedelta(hours=5)
                )
                db.add(h3)

            if issue.status in ["In Progress", "Resolved"]:
                h4 = IssueStatusHistory(
                    issue_id=issue.id,
                    previous_status="Assigned",
                    new_status="In Progress",
                    changed_by=admin.id,
                    note="Field crew arrived on site with equipment. Remediation commenced.",
                    created_at=issue.created_at + timedelta(hours=14)
                )
                db.add(h4)

            if issue.status == "Resolved":
                h5 = IssueStatusHistory(
                    issue_id=issue.id,
                    previous_status="In Progress",
                    new_status="Resolved",
                    changed_by=admin.id,
                    note=f"Resolution verified by inspector: {issue.resolution_details}",
                    created_at=issue.resolved_at
                )
                db.add(h5)

            # Sample citizen comments
            c1 = Comment(
                issue_id=issue.id,
                user_id=issue.user_id,
                message="Thank you for acknowledging this report. Will check back for progress.",
                created_at=issue.created_at + timedelta(hours=1)
            )
            db.add(c1)

            if issue.status in ["In Progress", "Resolved"]:
                c2 = Comment(
                    issue_id=issue.id,
                    user_id=admin.id,
                    message=f"Work crew is actively handling this under work order #{issue.tracking_id[-4:]}.",
                    created_at=issue.created_at + timedelta(hours=16)
                )
                db.add(c2)

        # Potential Duplicates
        # Pair 1: Pothole on 5th Ave (issue 0 and issue 1)
        # Pair 2: Water leak on Elm St (issue 2 and issue 3)
        print("Seeding potential duplicate relations...")
        dup1 = PotentialDuplicates(
            source_issue_id=created_issue_objs[1].id,
            matched_issue_id=created_issue_objs[0].id,
            similarity_score=0.88,
            review_status="Pending",
            created_at=now - timedelta(days=2)
        )
        dup2 = PotentialDuplicates(
            source_issue_id=created_issue_objs[3].id,
            matched_issue_id=created_issue_objs[2].id,
            similarity_score=0.92,
            review_status="Confirmed Duplicate",
            created_at=now - timedelta(days=1)
        )
        db.add_all([dup1, dup2])

        # Notifications
        notif1 = Notification(
            user_id=alex.id,
            issue_id=created_issue_objs[0].id,
            message="Your complaint CIVIC-2026-A10101 is now 'In Progress' with Roads and Public Works.",
            is_read=False,
            created_at=now - timedelta(days=1)
        )
        notif2 = Notification(
            user_id=maya.id,
            issue_id=created_issue_objs[4].id,
            message="Great news! Complaint CIVIC-2026-C30301 has been marked Resolved.",
            is_read=True,
            created_at=now - timedelta(days=5)
        )
        db.add_all([notif1, notif2])

        db.commit()
        print("Fictional demo data seeded successfully with 3 users, 16 complaints, histories, and duplicate pairs!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
