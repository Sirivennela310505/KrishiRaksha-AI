"""
Realistic Seed Data for Krishi Raksha AI.
Preloads Mandi prices, Government schemes, Weather alerts, and Farming videos.
"""

from datetime import datetime, timedelta
from database import SessionLocal
import models

def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.GovernmentScheme).first():
            return

        # 1. Seed Schemes
        schemes = [
            models.GovernmentScheme(
                title="PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                short_code="PM-KISAN",
                category="Cash Support",
                short_description="Direct income support of ₹6,000 per year transferred directly to landholding farmer families in 3 equal installments of ₹2,000.",
                who_can_benefit="All small, marginal, and medium landholder farmer families across all states of India.",
                eligibility_criteria=[
                    "Farmer family owning cultivable land registered in state land revenue records",
                    "Aadhaar card must be seeded with active bank account",
                    "Institutional landholders and high income taxpayers (income tax payees) are excluded",
                    "Mandatory biometric or OTP-based e-KYC on PM-KISAN portal"
                ],
                financial_benefits="₹6,000 per annum paid in 3 four-monthly installments directly through DBT.",
                required_documents=[
                    "Aadhaar Card (UIDAI)",
                    "Land Ownership Record (Pattadar Passbook / 7-12 Extract / Khasra-Khatauni)",
                    "Active Bank Account Passbook with IFSC code",
                    "Mobile number linked to Aadhaar for OTP"
                ],
                application_steps=[
                    "Visit the official PM-KISAN web portal (pmkisan.gov.in) or your local CSC / VAA center",
                    "Click on 'New Farmer Registration' under Farmers Corner",
                    "Enter Aadhaar Number, select State, and verify OTP",
                    "Fill in land survey number, sub-division, and bank account details",
                    "Submit application and track status via Aadhaar / mobile number"
                ],
                official_portal_url="https://pmkisan.gov.in",
                official_source="Ministry of Agriculture & Farmers Welfare, Govt of India",
                state_applicability="All India (Central)",
                last_verified_date="September 2026",
                is_active=True
            ),
            models.GovernmentScheme(
                title="PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                short_code="PMFBY",
                category="Crop Insurance",
                short_description="Comprehensive yield and weather insurance covering crop failure from pre-sowing to post-harvest natural calamities.",
                who_can_benefit="All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.",
                eligibility_criteria=[
                    "Cultivating notified food crops, oilseeds, or commercial crops in notified gram panchayat / mandal",
                    "Both loanee farmers (via KCC) and non-loanee farmers are eligible",
                    "Enrolled before the seasonal cut-off deadline (Kharif: July 31, Rabi: Dec 31)"
                ],
                financial_benefits="Minimal farmer premium: Only 2% for Kharif crops, 1.5% for Rabi food crops, and 5% for horticultural / commercial crops. Full claim settled in case of localized loss.",
                required_documents=[
                    "Aadhaar Card",
                    "Land Possession Certificate or Sowing Certificate from Village Revenue Officer (VRO)",
                    "Bank Account details / KCC Passbook",
                    "Crop Sowing declaration certificate"
                ],
                application_steps=[
                    "Apply through National Crop Insurance Portal (pmfby.gov.in), bank branch, or nearest CSC",
                    "In case of localized disaster (hailstorm, flood), notify within 72 hours via Crop Insurance Mobile App or Toll-Free 14447",
                    "Joint survey by revenue officer and insurance company surveyor",
                    "Claim credited directly to Aadhaar-linked bank account"
                ],
                official_portal_url="https://pmfby.gov.in",
                official_source="Department of Agriculture and Farmers Welfare, Govt of India",
                state_applicability="All India (Implementing States)",
                last_verified_date="September 2026",
                is_active=True
            ),
            models.GovernmentScheme(
                title="Sub-Mission on Agricultural Mechanization (SMAM)",
                short_code="SMAM",
                category="Equipment Subsidy",
                short_description="Subsidy ranging from 40% to 50% for purchasing tractors, power tillers, rotavators, drone sprayers, and laser land levelers.",
                who_can_benefit="Individual farmers, Small and Marginal farmers, SC/ST, Women farmers, and Farmer Producer Organizations (FPOs).",
                eligibility_criteria=[
                    "Small and marginal farmers, SC/ST, and women farmers receive 50% subsidy; other farmers receive 40%",
                    "Must have cultivable land holding suitable for requested farm machinery",
                    "Must not have availed subsidy for the same category machine in past 5 years"
                ],
                financial_benefits="40% to 50% financial subsidy on approved cost of machinery (up to ₹10 Lakhs for Custom Hiring Centers).",
                required_documents=[
                    "Aadhaar Card",
                    "Caste Certificate (for SC/ST beneficiaries)",
                    "Land Record (Passbook / Jamabandi)",
                    "Bank Account Passbook copy",
                    "Quotation from authorized implement dealer"
                ],
                application_steps=[
                    "Register on Agromachinery portal (agrimachinery.nic.in)",
                    "Select state, district, and required machinery category",
                    "Upload quotation from registered dealer",
                    "Upon approval from District Assistant Director of Agriculture, purchase machine",
                    "Physical verification and geotagging by agricultural engineer, followed by DBT subsidy release"
                ],
                official_portal_url="https://agrimachinery.nic.in",
                official_source="Ministry of Agriculture & Farmers Welfare",
                state_applicability="All India (Central + State 60:40)",
                last_verified_date="September 2026",
                is_active=True
            ),
            models.GovernmentScheme(
                title="PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
                short_code="PM-KUSUM",
                category="Solar & Irrigation",
                short_description="Up to 60% subsidy for installing standalone solar agriculture pumps (3HP to 7.5HP) in off-grid rural areas.",
                who_can_benefit="Individual farmers, water user associations, and cooperatives lacking regular grid power supply.",
                eligibility_criteria=[
                    "Must have borewell or surface water source with confirmed discharge",
                    "Land where electric pump connection does not already exist (for standalone pump component)",
                    "Sufficient open land free of shadows for solar panel array"
                ],
                financial_benefits="Central Govt 30% + State Govt 30% subsidy (Farmer pays only 40%, with up to 30% bank loan option).",
                required_documents=[
                    "Aadhaar Card",
                    "Land document showing ownership and borewell point",
                    "Bank passbook",
                    "Self-declaration of not having existing electrified connection"
                ],
                application_steps=[
                    "Apply through State Renewable Energy Development Agency portal (e.g. REDCO / TSREDCO / MEDA)",
                    "Submit online application with pump capacity required (3HP, 5HP, or 7.5HP)",
                    "Pay farmer share (usually 10% advance)",
                    "Authorized vendor conducts site survey and installs solar pump",
                    "Testing and commissioning by state nodal officer"
                ],
                official_portal_url="https://pmkusum.mnre.gov.in",
                official_source="Ministry of New and Renewable Energy (MNRE), Govt of India",
                state_applicability="All India",
                last_verified_date="September 2026",
                is_active=True
            ),
            models.GovernmentScheme(
                title="PMKSY - Per Drop More Crop (Micro-Irrigation)",
                short_code="PMKSY",
                category="Irrigation",
                short_description="Financial assistance for drip and sprinkler irrigation systems to conserve water and boost crop yield by up to 40%.",
                who_can_benefit="All farmers cultivating horticultural, cash, or food crops.",
                eligibility_criteria=[
                    "Perennial irrigation water source (well, borewell, canal)",
                    "Preference given to Small and Marginal Farmers (up to 55% central subsidy)"
                ],
                financial_benefits="Up to 55% subsidy for Small/Marginal farmers and 45% for other farmers on micro-irrigation systems.",
                required_documents=[
                    "Land Passbook / Pahani / 7-12 Extract",
                    "Aadhaar Card",
                    "Water and Electricity source certificate",
                    "Bank Passbook"
                ],
                application_steps=[
                    "Apply at the District Horticulture or Agriculture Office portal",
                    "Engineers survey field dimensions and water discharge",
                    "Select authorized drip manufacturer (e.g. Jain Irrigation, Netafim)",
                    "Installation and DBT release"
                ],
                official_portal_url="https://pmksy.gov.in",
                official_source="Department of Agriculture & Farmers Welfare",
                state_applicability="All India",
                last_verified_date="September 2026",
                is_active=True
            ),
            models.GovernmentScheme(
                title="Soil Health Card Scheme",
                short_code="SHC",
                category="Soil Health",
                short_description="Free soil testing and 12-parameter nutrient report with customized fertilizer recommendations for your farm plot.",
                who_can_benefit="All farmers across all agricultural districts.",
                eligibility_criteria=[
                    "Cultivable land parcel in rural areas. Card renewed every 3 years."
                ],
                financial_benefits="100% free soil sample testing, reducing unwanted fertilizer expenses by up to 25%.",
                required_documents=[
                    "Survey Number / Khasra Number of the plot",
                    "Farmer Aadhaar and Mobile Number"
                ],
                application_steps=[
                    "Agricultural extension officer collects soil sample from field grid (2.5 ha for irrigated, 10 ha for rainfed)",
                    "Tested at district soil testing laboratory for N, P, K, S, Zn, Fe, Cu, Mn, B, pH, EC, and OC",
                    "Card delivered to farmer via mobile SMS link and printed card"
                ],
                official_portal_url="https://soilhealth.dac.gov.in",
                official_source="Ministry of Agriculture & Farmers Welfare",
                state_applicability="All India",
                last_verified_date="September 2026",
                is_active=True
            )
        ]
        for s in schemes:
            db.add(s)

        # 2. Seed Mandis & Market Prices
        markets_data = [
            {"name": "Warangal APMC (Enumamula)", "state": "Telangana", "district": "Warangal", "lat": 17.9689, "lng": 79.5941},
            {"name": "Nizamabad Mandi", "state": "Telangana", "district": "Nizamabad", "lat": 18.6725, "lng": 78.0941},
            {"name": "Suryapet Market Yard", "state": "Telangana", "district": "Suryapet", "lat": 17.1439, "lng": 79.6239},
            {"name": "Khanna Grain Market", "state": "Punjab", "district": "Ludhiana", "lat": 30.7020, "lng": 76.2163},
            {"name": "Nashik APMC (Lasalgaon)", "state": "Maharashtra", "district": "Nashik", "lat": 20.0059, "lng": 74.2267},
            {"name": "Kolar Tomato APMC", "state": "Karnataka", "district": "Kolar", "lat": 13.1378, "lng": 78.1340},
            {"name": "Guntur Mirchi Yard", "state": "Andhra Pradesh", "district": "Guntur", "lat": 16.3067, "lng": 80.4365},
            {"name": "Rajkot Cotton Yard", "state": "Gujarat", "district": "Rajkot", "lat": 22.3039, "lng": 70.8022}
        ]

        created_markets = {}
        for m in markets_data:
            obj = models.Market(
                name=m["name"],
                state=m["state"],
                district=m["district"],
                latitude=m["lat"],
                longitude=m["lng"]
            )
            db.add(obj)
            db.flush()
            created_markets[m["name"]] = obj.id

        # Price items
        current_time = datetime.utcnow()
        prices = [
            # Warangal
            models.MarketPrice(
                market_id=created_markets["Warangal APMC (Enumamula)"],
                crop_name="Paddy (Dhan)",
                variety="Common (Grade A)",
                min_price=2200.0,
                max_price=2450.0,
                modal_price=2380.0,
                arrival_volume=240.5,
                price_change=45.0,
                price_trend="up",
                date=current_time
            ),
            models.MarketPrice(
                market_id=created_markets["Warangal APMC (Enumamula)"],
                crop_name="Cotton (Kapas)",
                variety="Medium Staple (Shankar-6)",
                min_price=7100.0,
                max_price=7650.0,
                modal_price=7480.0,
                arrival_volume=180.0,
                price_change=-60.0,
                price_trend="down",
                date=current_time
            ),
            models.MarketPrice(
                market_id=created_markets["Warangal APMC (Enumamula)"],
                crop_name="Red Chilli",
                variety="Teja Special",
                min_price=16500.0,
                max_price=19200.0,
                modal_price=18100.0,
                arrival_volume=85.0,
                price_change=250.0,
                price_trend="up",
                date=current_time
            ),
            # Nizamabad
            models.MarketPrice(
                market_id=created_markets["Nizamabad Mandi"],
                crop_name="Paddy (Dhan)",
                variety="BPT 5204 (Sona Masoori)",
                min_price=2250.0,
                max_price=2520.0,
                modal_price=2440.0,
                arrival_volume=310.0,
                price_change=30.0,
                price_trend="up",
                date=current_time
            ),
            models.MarketPrice(
                market_id=created_markets["Nizamabad Mandi"],
                crop_name="Soybean",
                variety="Yellow",
                min_price=4300.0,
                max_price=4750.0,
                modal_price=4620.0,
                arrival_volume=120.0,
                price_change=15.0,
                price_trend="stable",
                date=current_time
            ),
            # Kolar Tomato
            models.MarketPrice(
                market_id=created_markets["Kolar Tomato APMC"],
                crop_name="Tomato",
                variety="Hybrid Red",
                min_price=1200.0,
                max_price=1850.0,
                modal_price=1600.0,
                arrival_volume=450.0,
                price_change=120.0,
                price_trend="up",
                date=current_time
            ),
            # Nashik Onion
            models.MarketPrice(
                market_id=created_markets["Nashik APMC (Lasalgaon)"],
                crop_name="Onion",
                variety="Red Nashik",
                min_price=1400.0,
                max_price=1950.0,
                modal_price=1750.0,
                arrival_volume=520.0,
                price_change=-40.0,
                price_trend="down",
                date=current_time
            ),
            # Khanna Wheat
            models.MarketPrice(
                market_id=created_markets["Khanna Grain Market"],
                crop_name="Wheat",
                variety="Sharbati / Mill Quality",
                min_price=2400.0,
                max_price=2680.0,
                modal_price=2560.0,
                arrival_volume=600.0,
                price_change=20.0,
                price_trend="up",
                date=current_time
            ),
            # Guntur Chilli
            models.MarketPrice(
                market_id=created_markets["Guntur Mirchi Yard"],
                crop_name="Red Chilli",
                variety="Guntur Sannam (S4)",
                min_price=17000.0,
                max_price=20500.0,
                modal_price=19100.0,
                arrival_volume=390.0,
                price_change=300.0,
                price_trend="up",
                date=current_time
            )
        ]
        for p in prices:
            db.add(p)

        # 3. Weather & Farm Alerts
        w = models.WeatherData(
            location_name="Warangal",
            state="Telangana",
            temperature=31.5,
            temp_min=24.0,
            temp_max=34.0,
            humidity=72.0,
            wind_speed=14.0,
            rain_probability=35.0,
            condition="Partly Cloudy with Scattered Showers",
            condition_icon="cloud-sun-rain",
            advisory_summary="Favorable conditions for vegetative paddy stage. High humidity may induce fungal sporulation; inspect leaf margins. Spraying suitable before 11 AM.",
            recorded_at=current_time
        )
        db.add(w)

        # Alerts
        alerts = [
            models.Alert(
                alert_type="weather",
                severity="warning",
                title="Moderate Rain & Thundershowers Expected Tomorrow",
                message="Thunderstorms with gusty winds (30-40 km/h) forecasted for Warangal & Karimnagar districts. Suspend urea broadcasting and pesticide spraying for 24 hours.",
                location="Warangal, Telangana",
                crop="Paddy, Cotton",
                audio_text="Weather warning: Moderate rain and winds expected tomorrow. Please do not spray chemicals or spread fertilizers today.",
                created_at=current_time
            ),
            models.Alert(
                alert_type="mandi_spike",
                severity="info",
                title="Paddy Price Increased by ₹45/qtl at Warangal Mandi",
                message="Paddy Grade A modal price crossed ₹2,380/Quintal due to strong mill procurement orders.",
                location="Warangal APMC",
                crop="Paddy",
                audio_text="Market alert: Paddy prices rose by forty-five rupees per quintal at Warangal market yard today.",
                created_at=current_time
            ),
            models.Alert(
                alert_type="pest_outbreak",
                severity="critical",
                title="KVK Alert: Pink Bollworm Monitoring in Cotton Fields",
                message="High moth catches reported in adjoining mandals. Install pheromone traps and inspect 20 green bolls per acre for rosette signs.",
                location="Telangana & Northern Karnataka",
                crop="Cotton",
                audio_text="Pest alert: Pink bollworm detected in nearby fields. Check your cotton plants and install pheromone traps.",
                created_at=current_time
            )
        ]
        for a in alerts:
            db.add(a)

        # 4. Videos & Farming Tips
        videos = [
            models.AgriculturalVideo(
                title="How to Identify and Treat Rice Blast in 5 Steps",
                topic="Disease Management",
                crop="Paddy / Rice",
                duration="04:25",
                thumbnail_url="https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80",
                video_url="https://www.youtube.com/watch?v=demo1",
                expert_name="Dr. K. Ramana Rao",
                institution="PJTSAU Telangana Agricultural University",
                language="Hindi & Telugu"
            ),
            models.AgriculturalVideo(
                title="Pink Bollworm Pheromone Trap Installation Demonstration",
                topic="Pest Management",
                crop="Cotton",
                duration="06:10",
                thumbnail_url="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80",
                video_url="https://www.youtube.com/watch?v=demo2",
                expert_name="Dr. V. Blaise",
                institution="ICAR - Central Institute for Cotton Research",
                language="Hindi & English"
            ),
            models.AgriculturalVideo(
                title="Applying for 50% Subsidy on Farm Machinery via SMAM Portal",
                topic="Government Schemes",
                crop="General",
                duration="08:45",
                thumbnail_url="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80",
                video_url="https://www.youtube.com/watch?v=demo3",
                expert_name="Er. S. Patel",
                institution="Department of Agriculture Mechanization",
                language="Hindi"
            ),
            models.AgriculturalVideo(
                title="Drip Irrigation Maintenance: Acid Treatment for Dripper Clogging",
                topic="Water Management",
                crop="Tomato & Chilli",
                duration="05:30",
                thumbnail_url="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
                video_url="https://www.youtube.com/watch?v=demo4",
                expert_name="Er. M. Venkatesh",
                institution="PMKSY Micro-Irrigation Division",
                language="Telugu & Tamil"
            )
        ]
        for v in videos:
            db.add(v)

        # 5. Default Farmer Profile
        user = models.User(phone_number="9876543210", full_name="Ramesh Kumar")
        db.add(user)
        db.flush()

        profile = models.FarmerProfile(
            user_id=user.id,
            preferred_language="te-IN",
            state="Telangana",
            district="Warangal",
            sub_district="Hanamkonda",
            village="Rampur",
            farm_size_acres=4.5,
            crops_grown=["Paddy", "Cotton", "Chilli"],
            soil_type="Black Cotton Soil",
            irrigation_source="Borewell & Canal"
        )
        db.add(profile)

        # Commit all initial data
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()
