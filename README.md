# 🌱 Krishi Raksha AI (కృషి రక్షా AI / कृषि रक्षा एआई)
### Voice-First, Multilingual Digital Assistant for Farmers in India

**Krishi Raksha AI** is an AI-powered agricultural digital assistant engineered specifically for farmers across India who may not be comfortable with English, complex typing, or technical jargon. The platform is designed from the ground up to be **voice-first, visual, multilingual, mobile-friendly, and accessible**.

---

## 🌟 Key Features

### 1. 🌿 Crop Doctor (పంట డాక్టర్ / फसल डॉक्टर)
- **Camera & Photo Upload:** Farmers can snap a live photo of diseased leaves or fruits.
- **Voice Symptom Description:** Farmers speak what is happening in their native language (*"Leaves have brown spots and are drying up"*).
- **Modular Computer Vision Engine:** Classifies the crop, detects pathogens (fungal, bacterial, viral, pests, nutrient chlorosis), and generates an AI confidence score.
- **Structured Diagnosis Report:**
  - Crop detected & Condition identified
  - Confidence percentage
  - Visible symptoms & root causes
  - Step-by-step remedies (Organic bio-control & chemical management)
  - Farm hygiene precautions
  - When to seek expert help (KVK escalation triggers)
  - Non-guarantee AI safety disclaimer
- **Voice Readout:** "🔊 Listen" and "🔄 Listen Again" buttons speak the full diagnosis in natural dialect.
- **Preloaded 1-Click Samples:** Quick demo testing for Rice Blast, Tomato Early Blight, Cotton Pink Bollworm, Wheat Stripe Rust, and Chilli Leaf Curl.

### 2. 📈 Mandi / Market Prices (మార్కెట్ ధరలు / मंडी भाव)
- **Live Agmarknet Prices:** Daily modal, minimum, and maximum prices for major agricultural commodities (Paddy, Cotton, Tomato, Chilli, Wheat, Soybean, Onion).
- **Price Movement Badges:** Instant indicators for daily gains/losses (+₹45/qtl, -₹60/qtl).
- **7-Day Historical Trends:** Price trajectory charts with AI-generated trend explanations.
- **Nearby Market Comparisons:** Compare prices and travel distance across 3 nearby mandis.
- **Voice Search:** Farmers can ask *"What's today's price for paddy?"* or *"Show me tomato prices"*.
- **Crop Price Alerts:** Set target alert prices to receive audio and SMS notifications.

### 3. 🏛️ Government Schemes (ప్రభుత్వ పథకాలు / सरकारी योजनाएं)
- **Verified Official Schemes:** Central & State schemes including PM-KISAN (₹6,000 DBT), Sub-Mission on Agricultural Mechanization (SMAM - 40% to 50% machinery subsidy), PM Fasal Bima Yojana (PMFBY), PM-KUSUM (60% solar pump subsidy), PMKSY (55% drip irrigation subsidy), and Soil Health Cards.
- **Eligibility & Document Checklist:** Detailed criteria, required documents (Aadhaar, Land Passbook, Bank IFSC), and step-by-step application guidelines.
- **Direct Official Portals:** Verified links directly to official government portals (`pmkisan.gov.in`, `agrimachinery.nic.in`, `pmfby.gov.in`).
- **Voice Discovery:** Semantic voice search (*"Which scheme helps farmers buy equipment?"*).

### 4. 🌤️ Weather & Farm Alerts (వాతావరణం / मौसम)
- **Farmer-Friendly Dashboard:** Temperature, humidity, wind velocity, and precipitation probability.
- **7-Day Agricultural Forecast:** Day-by-day farm forecasts with specific field advisories.
- **Practical Field Guidelines:**
  - Morning spraying suitability windows (avoiding wind drift)
  - Heavy rain and waterlogging alerts
  - Fertilizer broadcasting advisories

### 5. 🤖 Krishi Mitra AI (కృషి మిత్ర / कृषि मित्र)
- **Conversational Assistant:** Combines text, voice, and image context.
- **Cross-Module Intelligence:** Answers crop disease questions, mandi rates, schemes, and weather in one unified conversation.
- **RAG Knowledge Retrieval:** Cites verified documents from ICAR (NRRI, CICR), State Agricultural Universities (PJTSAU, TNAU, PAU), and Government Ministries.
- **Natural Voice Synthesis:** Automatically speaks responses in the farmer's mother tongue.

### 6. 🌐 Multilingual Architecture (12 Indian Languages)
- Fully localized with no hard-coded strings:
  1. Telugu (తెలుగు - `te-IN`)
  2. Hindi (हिन्दी - `hi-IN`)
  3. Tamil (தமிழ் - `ta-IN`)
  4. Kannada (ಕನ್ನಡ - `kn-IN`)
  5. Malayalam (മലയാളം - `ml-IN`)
  6. Marathi (मराठी - `mr-IN`)
  7. Bengali (বাংলা - `bn-IN`)
  8. Gujarati (ગુજરાતી - `gu-IN`)
  9. Punjabi (ਪੰਜਾਬੀ - `pa-IN`)
  10. Odia (ଓଡ଼ିଆ - `or-IN`)
  11. Assamese (অসমীয়া - `as-IN`)
  12. English (`en-IN`)

### 7. 🛡️ Admin & Verification Console
- Real-time data freshness trackers for Agmarknet mandi feeds, IMD Agromet weather, and Government Scheme DB.
- Computer Vision model status (`KrishiVision-v2.4-Transformer`) with confidence thresholding (0.70).
- RAG Vector Index status with ICAR university bulletins.

---

## 🛠️ Architecture & Tech Stack

```
[ Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion ]
       │
       │ HTTP / REST APIs + Audio Streams
       ▼
[ Backend: Python FastAPI + Uvicorn + SQLAlchemy ]
       ├── /api/crop-doctor (Modular Computer Vision Service)
       ├── /api/market (Agmarknet Mandi & Historical Price Engine)
       ├── /api/schemes (Verified Central & State Schemes Engine)
       ├── /api/weather (IMD Agromet Weather Advisory Service)
       ├── /api/chat (Krishi Mitra RAG Conversational AI)
       ├── /api/voice (Speech-to-Text & Dialect Voice Synthesis)
       ├── /api/admin (Data Freshness & Model Versioning)
       └── Database: SQLite (PostgreSQL compatible schema)
```

---

## 🚀 Running the Application Locally

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
- API Root: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### 2. Start the Frontend (Next.js)
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 📱 Mobile-First Accessibility Highlights
- **Large Touch Targets:** Minimum 48px buttons with high-contrast colors and rounded pill shapes.
- **Voice Feedback States:** Informative step-by-step progress (*🎙️ Listening → 🧠 Understanding → 🔍 Analyzing Crop → 🔊 Preparing Answer*).
- **Zero Typing Mandate:** Any farmer can operate the full app solely via voice microphone and camera.
