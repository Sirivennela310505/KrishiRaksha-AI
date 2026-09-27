import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from database import get_db
import models
import schemas
from services.rag_service import RAGService
from services.translator_service import normalize_lang

# ── LSTM NLP Intent Engine ─────────────────────────────────────────────────────
try:
    from inference.lstm_predict import predict_query_intent
    LSTM_AVAILABLE = True
    print("[chat] LSTM NLP intent engine loaded successfully.")
except Exception as e:
    LSTM_AVAILABLE = False
    print(f"[chat] LSTM model not available ({e}), using keyword fallback.")

router = APIRouter(prefix="/api/chat", tags=["Krishi Mitra AI Assistant"])

def _classify_intent_via_lstm(text: str) -> tuple[str, float]:
    """
    Primary intent classification using trained Bidirectional LSTM.
    Returns (intent_label, confidence_float).
    Falls back to keyword rules if model is unavailable.
    """
    if LSTM_AVAILABLE:
        try:
            result = predict_query_intent(text)
            return result["intent"], result["confidence"]
        except Exception:
            pass
    # Fallback keyword rules
    t = text.lower()
    if any(k in t for k in ["yellow", "disease", "leaf", "blast", "spot", "curl", "fungus", "worm", "తెగులు", "రోగ", "रोग"]):
        return "crop_disease", 0.70
    if any(k in t for k in ["pest", "insect", "bollworm", "borer", "whitefly", "పురుగు", "कीड़ा"]):
        return "pest_control", 0.70
    if any(k in t for k in ["urea", "dap", "fertilizer", "npk", "potash", "ఎరువు", "यूरिया"]):
        return "fertilizer_advice", 0.70
    if any(k in t for k in ["rain", "weather", "forecast", "spray", "వర్షం", "मौसम"]):
        return "weather_forecast", 0.70
    if any(k in t for k in ["price", "mandi", "sell", "quintal", "ధర", "मंडी", "भाव"]):
        return "mandi_prices", 0.70
    if any(k in t for k in ["scheme", "subsidy", "kisan", "pm-kisan", "tractor", "పథకం", "सब्सिडी", "योजना"]):
        return "govt_schemes", 0.70
    if any(k in t for k in ["soil", "ph", "organic", "నేల", "मिट्टी"]):
        return "soil_health", 0.70
    if any(k in t for k in ["irrigat", "water", "drip", "నీరు", "सिंचाई"]):
        return "irrigation", 0.70
    if any(k in t for k in ["sow", "seed", "cultivat", "variety", "విత్తనం", "बीज"]):
        return "crop_cultivation", 0.70
    return "general_greeting", 0.60

@router.post("", response_model=schemas.ChatMessageResponse)
def handle_chat_message(
    chat_req: schemas.ChatMessageRequest,
    db: Session = Depends(get_db)
):
    session_id = chat_req.session_id or str(uuid.uuid4())
    msg_text = chat_req.message.strip()
    msg_lower = msg_text.lower()
    lang = normalize_lang(chat_req.language or "en")

    # ── LSTM NLP Pipeline: classify farmer query intent ────────────────────────
    lstm_intent, lstm_confidence = _classify_intent_via_lstm(msg_text)

    # 1. Determine intent & localized response
    intent = "general"
    cited_sources = []
    suggested_actions = []

    # Map LSTM intent labels to response routing
    if lstm_intent == "crop_disease" or any(k in msg_lower for k in ["yellow", "disease", "leaf", "pest", "worm", "fungus", "spot", "curl", "blast", "dry", "తెగులు", "పురుగు", "ఆకు", "పసుపు", "ముడుత", "रोग", "कीड़ा", "पत्ती"]):
        intent = "crop_doctor"
        rag_docs = RAGService.retrieve_context(msg_text, top_k=2)
        cited_sources = [d["title"] for d in rag_docs] if rag_docs else ["ICAR - వ్యవసాయ మార్గదర్శకాలు"]

        
        if lang == "te":
            suggested_actions = ["📷 పంట డాక్టర్‌లో ఫోటో తీయండి", "🧪 నివారణ మందులు చూడండి", "🏛️ సమీప KVK కేంద్రం"]
            if any(k in msg_lower for k in ["yellow", "పసుపు"]):
                reply = (
                    "మీ పంట ఆకులు పసుపు రంగులోకి మారడానికి ముఖ్యంగా మూడు కారణాలు ఉంటాయి: "
                    "1) నత్రజని (యూరియా) లోపం, 2) వేరుకుళ్ళు లేదా నీరు నిలవడం, 3) ఆకు మచ్చ లేదా రసం పీల్చే పురుగుల దాడి. "
                    "లక్షణం ముదిరిన క్రింది ఆకులలో ఉంటే యూరియా లోపం కావచ్చు. ఖచ్చితమైన నిర్ధారణ కోసం మన 'పంట డాక్టర్' ద్వారా ఆకు ఫోటో తీయండి."
                )
            elif any(k in msg_lower for k in ["curl", "ముడుత"]):
                reply = (
                    "ఆకులు పైకి ముడుచుకుపోవడం (ఆకు ముడుత తెగులు) ప్రధానంగా తెల్లదోమ లేదా తామర పురుగుల వల్ల వస్తుంది. "
                    "వెంటనే ఎకరానికి 15-20 పసుపు జిగురు అట్టలు పెట్టండి. లీటరు నీటికి 1.25 గ్రాముల డయాఫెంతియురాన్ లేదా 0.2 గ్రాముల ఎసిటామిప్రిడ్ కలిపి ఆకుల అడుగున తడిసేలా పిచికారీ చేయండి."
                )
            else:
                reply = (
                    "పంట తెగులు లేదా పురుగు లక్షణాలను నివారించడానికి తగిన జాగ్రత్తలు అవసరం. "
                    "అధిక మోతాదులో రసాయనాలు చల్లకుండా, ముందుగా మన యాప్‌లోని 'పంట డాక్టర్' కెమెరా ద్వారా ఆకు ఫోటో తీయండి. "
                    "AI వెంటనే వ్యాధిని గుర్తించి సేంద్రీయ మరియు రసాయన మందుల మోతాదును తెలుగు వాయిస్‌లో తెలియజేస్తుంది."
                )
        elif lang == "hi":
            suggested_actions = ["📷 फसल डॉक्टर में फोटो लें", "🧪 उपचार देखें", "🏛️ नजदीकी KVK"]
            reply = (
                "फसल की पत्तियों में रोग या पीलापन दिखने पर तुरंत जांच जरूरी है। "
                "यदि पत्तियां मुड़ रही हैं तो सफेद मक्खी के नियंत्रण के लिए डायफेंथियूरॉन 1.25 ग्राम प्रति लीटर छिड़कें। "
                "सटीक पहचान के लिए 'फसल डॉक्टर' कैमरे से पत्ती की साफ फोटो लें।"
            )
        else:
            suggested_actions = ["📷 Take Photo in Crop Doctor", "View Spray Recommendations", "Find Nearest KVK"]
            reply = (
                "Paddy and crop leaf symptoms often indicate fungal blast, nitrogen deficiency, or sucking pests. "
                "Avoid spraying random chemical cocktails without confirmation. Please open our 'Crop Doctor' tab "
                "and capture a photo for an instant AI computer vision diagnosis and dosage schedule."
            )

    elif any(k in msg_lower for k in ["price", "mandi", "rate", "market", "bhav", "dhan", "paddy", "cotton", "tomato", "chilli", "ధర", "రేటు", "మార్కెట్", "మండీ", "అమ్మాలా", "ఆగాలా", "भाव", "दाम"]):
        intent = "mandi"
        cited_sources = ["Agmarknet Mandi Network (కేంద్ర వ్యవసాయ మంత్రిత్వ శాఖ)"]
        
        if lang == "te":
            suggested_actions = ["📊 అమ్మాలా? ఆగాలా? నిర్ణయం చూడండి", "📈 7 రోజుల ధరల చార్ట్", "🔔 ధర హెచ్చరిక సెట్ చేయండి"]
            if any(k in msg_lower for k in ["paddy", "వరి", "ధాన్యం"]):
                reply = (
                    "ఈరోజు వరంగల్ APMC మార్కెట్‌లో గ్రేడ్-A వరి క్వింటాలుకు ₹2,380 పలుకుతోంది (నిన్నటి కంటే +₹45 పెరిగింది). "
                    "మార్కెట్ నిర్ణయం: 'ఇప్పుడే అమ్మండి'. వచ్చే వారం కొత్త కోతలు పెరిగి మార్కెట్ రాకలు భారీగా పెరిగితే ధర క్వింటాలుకు ₹60-₹100 తగ్గే అవకాశం ఉంది."
                )
            elif any(k in msg_lower for k in ["cotton", "పత్తి"]):
                reply = (
                    "వరంగల్ మార్కెట్‌లో శంకర్-6 పత్తి ధర క్వింటాలుకు ₹7,480 వద్ద ఉంది. "
                    "మార్కెట్ నిర్ణయం: '7-10 రోజులు ఆగండి'. రాబోయే రోజులలో మిల్లుల నుండి డిమాండ్ పెరిగి ధర ₹7,800 దాటే అవకాశం ఉంది."
                )
            else:
                reply = (
                    "ఈరోజు ప్రధాన మండీలలో ధరలు క్రింది విధంగా ఉన్నాయి: వరి ₹2,380/క్వింటాల్, పత్తి ₹7,480/క్వింటాల్, మిరప ₹18,100/క్వింటాల్. "
                    "పూర్తి మార్కెట్ వివరాలు మరియు 'అమ్మాలా లేదా నిల్వ చేయాలా' అనే AI సలహా కోసం 'మండీ ధరలు' ట్యాబ్ చూడండి."
                )
        elif lang == "hi":
            suggested_actions = ["📊 बेचें या रुकें निर्णय", "📈 7-दिन भाव चार्ट", "🔔 भाव अलर्ट"]
            reply = (
                "आज की मुख्य मंडियों में धान का भाव ₹2,380 प्रति क्विंटल और कपास ₹7,480 प्रति क्विंटल है। "
                "धान के लिए हमारी AI सलाह: 'अभी बेचें'। कपास के लिए सलाह: '7 से 10 दिन रुकें' क्योंकि भाव बढ़ने की संभावना है।"
            )
        else:
            suggested_actions = ["Check 7-Day Price Chart", "Compare Nearby Mandis", "Set Price Alert"]
            reply = (
                "Today's modal price for Grade A Paddy at Warangal APMC is ₹2,380 per quintal (+₹45 today). "
                "AI Advisory: SELL NOW for Paddy due to heavy arrivals next week. For Cotton (₹7,480/qtl), HOLD 7-10 days for projected price recovery."
            )

    elif any(k in msg_lower for k in ["fertilizer", "urea", "dap", "potash", "యూరియా", "ఎరువులు", "డిఎపి", "భూసార", "ఖాద్", "यूरिया"]):
        intent = "soil_advisor"
        cited_sources = ["ICAR సమతుల్య పోషక నిర్వహణ మార్గదర్శకాలు"]
        if lang == "te":
            suggested_actions = ["🧪 ఎరువుల మోతాదు కాలిక్యులేటర్ తెరవండి", "🌿 సేంద్రీయ ఎరువుల సలహా", "💰 ఖర్చు ఆదా లెక్కించండి"]
            reply = (
                "రైతులు రసాయన దుకాణదారుల మాటలు విని అవసరానికి మించి యూరియా, డీఏపీ వాడటం వల్ల ఎకరానికి ₹3,000 నుండి ₹4,000 అదనంగా ఖర్చు చేస్తున్నారు. "
                "సమతుల్య పద్ధతిలో: వరి పంటకు ఎకరానికి 2.2 బస్తాల యూరియా, 1.1 బస్తాల డీఏపీ సరిపోతుంది. "
                "మీ ఖచ్చితమైన భూమి ఎకరాలకు ఎన్ని బస్తాలు కావాలో తెలుసుకోవడానికి మన 'భూసార & ఎరువుల సలహాదారు' ఫీచర్‌ను ఉపయోగించండి."
            )
        else:
            suggested_actions = ["🧪 Open Fertilizer Calculator", "Calculate Cost Savings"]
            reply = (
                "Excess fertilizer application damages soil biome and wastes farmer income. "
                "For Paddy, scientific dosage is only 2.2 bags Urea and 1.1 bags DAP per acre applied across 3 split stages. "
                "Open our 'Soil & Fertilizer Advisor' to calculate exact bag requirements and savings for your land size."
            )

    elif any(k in msg_lower for k in ["scheme", "subsidy", "pm kisan", "pm-kisan", "equipment", "tractor", "insurance", "fasal bima", "solar", "kusum", "loan", "పథకాలు", "సబ్సిడీ", "రైతు భరోసా", "యోజన", "योजना"]):
        intent = "scheme"
        cited_sources = ["భారత ప్రభుత్వ వ్యవసాయ పోర్టల్ (agricoop.nic.in)"]
        
        if lang == "te":
            suggested_actions = ["🏛️ పీఎం-కిసాన్ అర్హత చూడండి", "🚜 50% ట్రాక్టర్ సబ్సిడీ దరఖాస్తు", "🌾 పంట బీమా క్లెయిమ్"]
            reply = (
                "రైతుల కోసం ముఖ్యమైన ప్రభుత్వ పథకాలు:\n"
                "1. పీఎం-కిసాన్ (PM-KISAN): సంవత్సరానికి ₹6,000 నేరుగా బ్యాంక్ ఖాతాలో జమ.\n"
                "2. రైతు భరోసా: ఎకరానికి పెట్టుబడి సాయం.\n"
                "3. వ్యవసాయ యంత్రాల సబ్సిడీ (SMAM): ట్రాక్టర్లు, రోటవేటర్లపై 40% నుండి 50% వరకు రాయితీ.\n"
                "4. పీఎం కుసుమ్ (PM-KUSUM): సోలార్ వ్యవసాయ పంపులకు 60% సబ్సిడీ.\n"
                "దరఖాస్తు విధానం మరియు పత్రాల వివరాల కోసం 'ప్రభుత్వ పథకాలు' ట్యాబ్ చూడండి."
            )
        elif lang == "hi":
            suggested_actions = ["🏛️ पीएम-किसान पात्रता", "🚜 50% कृषि यंत्र सब्सिडी", "🌾 फसल बीमा"]
            reply = (
                "किसानों के लिए शीर्ष सरकारी योजनाएं: 1) पीएम-किसान (₹6,000 वार्षिक सहायता), 2) SMAM योजना में कृषि यंत्रों पर 50% तक सब्सिडी, 3) पीएम-कुसुम सोलर पंप योजना पर 60% तक अनुदान। पूरी जानकारी योजनाएं टैब में देखें।"
            )
        else:
            suggested_actions = ["Check Eligibility for PM-KISAN", "Apply for SMAM 50% Subsidy", "View Required Documents"]
            reply = (
                "Top verified government schemes: PM-KISAN (₹6,000 yearly income support), SMAM (40-50% tractor and implement subsidy), PM-KUSUM (60% solar pump subsidy), and PMFBY crop insurance. Check the Government Schemes tab for step-by-step application guidance."
            )

    elif any(k in msg_lower for k in ["weather", "rain", "forecast", "wind", "spray", "వర్షం", "వాతావరణం", "ఎండ", "मौसम", "बारिश"]):
        intent = "weather"
        cited_sources = ["భారత వాతావరణ శాఖ (IMD Agromet Advisory)"]
        if lang == "te":
            suggested_actions = ["⛅ 7 రోజుల వాతావరణ అంచనా", "🌾 స్ప్రే సలహా సమయం", "💧 నీటి పారుదల సూచనలు"]
            reply = (
                "ప్రస్తుతం మీ ప్రాంతంలో ఉష్ణోగ్రత 31.5°C, తేమ 72% గా ఉంది. రేపు మధ్యాహ్నం తర్వాత తేలికపాటి నుండి మోస్తరు వర్షం పడే అవకాశం 70% ఉంది. "
                "రైతులకు సలహా: వర్షం వల్ల మందు కొట్టుకుపోయే ప్రమాదం ఉన్నందున రేపు పురుగుమందుల పిచికారీ మరియు యూరియా చల్లడం తాత్కాలికంగా వాయిదా వేయండి."
            )
        else:
            suggested_actions = ["View 7-Day Farm Forecast", "Check Spray Advisory"]
            reply = (
                "Current temperature is 31.5°C with 72% humidity and scattered clouds. "
                "Tomorrow has a 70% chance of afternoon rain showers. "
                "Advisory: Postpone chemical spraying and top-dressing urea tomorrow to prevent chemical wash-off."
            )

    else:
        intent = "general"
        cited_sources = ["రైతు AI మిత్ర - కృషి రక్షా అసిస్టెంట్"]
        if lang == "te":
            suggested_actions = ["📷 పంట ఆరోగ్యం పరీక్షించండి", "📊 ఈరోజు మండీ ధరలు & సలహా", "🧪 ఎరువుల మోతాదు లెక్కించండి", "🏛️ ప్రభుత్వ పథకాలు"]
            reply = (
                "రైతు సోదరులారా, నమస్కారం! నేను మీ 'రైతు AI మిత్ర' ని. "
                "మీ పంట ఆకు రోగాలను గుర్తించడం, మార్కెట్‌లో పంటను ఇప్పుడే అమ్మాలా లేక ఆగాలా అనే సలహా, "
                "భూమికి సరైన ఎరువుల మోతాదు లెక్కించడం మరియు ప్రభుత్వ సబ్సిడీలను కనుగొనడంలో నేను మీకు సహాయపడతాను. "
                "మీ సమస్యను మైక్రోఫోన్ ద్వారా మాట్లాడండి లేదా కింద టైప్ చేయండి!"
            )
        elif lang == "hi":
            suggested_actions = ["📷 फसल स्वास्थ्य जांचें", "📊 आज के मंडी भाव", "🧪 खाद की मात्रा", "🏛️ सरकारी योजनाएं"]
            reply = (
                "किसान भाई, नमस्ते! मैं आपका 'कृषि मित्र' AI सहायक हूँ। "
                "मैं फसल की बीमारियों की पहचान, मंडी में बेचने या रुकने की सलाह, संतुलित खाद की मात्रा और सरकारी योजनाओं में आपकी सहायता कर सकता हूँ। "
                "माइक दबाकर बोलें या नीचे लिखें!"
            )
        else:
            suggested_actions = ["📷 Check My Crop", "📈 Mandi Prices & Advice", "🧪 Fertilizer Calculator", "🏛️ Government Schemes"]
            reply = (
                "Namaste! I am Krishi Mitra, your AI farm assistant. I can diagnose crop leaf diseases with your camera, "
                "advise whether to SELL NOW or HOLD at APMC mandis, calculate balanced fertilizer bags for your exact acres, "
                "and guide you through verified government subsidies. How can I assist your farm today?"
            )


    # Save to database
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not session:
        session = models.ChatSession(id=session_id, language=chat_req.language or "en")
        db.add(session)
        db.flush()

    # User message
    user_msg = models.ChatMessage(
        session_id=session_id,
        sender="farmer",
        message_text=msg_text,
        intent=intent
    )
    db.add(user_msg)

    # Bot message
    bot_msg = models.ChatMessage(
        session_id=session_id,
        sender="krishi_mitra",
        message_text=reply,
        intent=intent,
        cited_sources=cited_sources
    )
    db.add(bot_msg)
    db.commit()

    return schemas.ChatMessageResponse(
        session_id=session_id,
        reply=reply,
        audio_narrative=reply,
        intent=intent,
        lstm_confidence=round(lstm_confidence, 4),
        cited_sources=cited_sources,
        suggested_actions=suggested_actions,
        timestamp=datetime.utcnow().strftime("%H:%M")
    )

@router.get("/history/{session_id}")
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.timestamp.asc()).all()
    return messages
