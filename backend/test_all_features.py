import sys
import os
import io
import json

# Force UTF-8 output on Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from fastapi.testclient import TestClient

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def run_tests():
    results = []
    
    def test_case(name, func):
        try:
            status, msg = func()
            results.append({"name": name, "status": "PASS" if status else "FAIL", "message": msg})
            print(f"[{'PASS' if status else 'FAIL'}] {name}: {msg}")
        except Exception as e:
            results.append({"name": name, "status": "ERROR", "message": str(e)})
            print(f"[ERROR] {name}: {str(e)}")

    print("=== Testing Krishi Raksha Backend Features ===")

    # 1. Root / Health check
    def t_root():
        r = client.get("/")
        data = r.json()
        return r.status_code == 200 and data.get("status") == "online", f"Status {r.status_code}, app: {data.get('app')}"
    test_case("1. API Gateway / Root", t_root)

    # 2. Crop Doctor - Samples
    def t_samples():
        r = client.get("/api/crop-doctor/samples")
        data = r.json()
        return r.status_code == 200 and len(data) > 0, f"Status {r.status_code}, count: {len(data)}"
    test_case("2. Crop Doctor - Sample List", t_samples)

    # 3. Crop Doctor - Analyze Sample
    def t_analyze():
        r = client.post("/api/crop-doctor/analyze", data={"sample_id": "rice_blast", "language": "te-IN"})
        data = r.json()
        return r.status_code == 200 and len(data.get("condition", "")) > 0, f"Status {r.status_code}, diagnosed: {data.get('condition')}"
    test_case("3. Crop Doctor - AI Diagnostic Scan", t_analyze)

    # 4. Mandi - Prices
    def t_prices():
        r = client.get("/api/market/prices")
        data = r.json()
        count = len(data.get("data", []))
        return r.status_code == 200 and count > 0, f"Status {r.status_code}, prices count: {count}"
    test_case("4. Mandi - Live Prices", t_prices)

    # 5. Mandi - Trends
    def t_trends():
        r = client.get("/api/market/trends?crop=Paddy")
        data = r.json()
        return r.status_code == 200 and "crop" in data, f"Status {r.status_code}, crop: {data.get('crop')}, 7d trajectory available"
    test_case("5. Mandi - 7-Day Trend Analysis", t_trends)

    # 6. Mandi - AI Decision Engine (Sell vs Hold)
    def t_decision():
        r = client.get("/api/market/decision?crop=Paddy&language=te-IN")
        data = r.json()
        return r.status_code == 200 and "decision" in data, f"Status {r.status_code}, decision: {data.get('decision')}"
    test_case("6. Mandi - Sell vs Hold AI Advisor", t_decision)

    # 7. Schemes - List & Detail
    def t_schemes():
        r = client.get("/api/schemes")
        data = r.json()
        count = len(data)
        r_detail = client.get(f"/api/schemes/{data[0]['id']}")
        return r.status_code == 200 and count > 0 and r_detail.status_code == 200, f"Status {r.status_code}, total schemes: {count}, sample: {data[0]['title'][:30]}..."
    test_case("7. Government Schemes - Database & Details", t_schemes)

    # 8. Schemes - Voice Search
    def t_schemes_voice():
        r = client.get("/api/schemes/search/voice?query=tractor equipment subsidy")
        data = r.json()
        return r.status_code == 200 and data.get("results_count", 0) > 0, f"Status {r.status_code}, matched: {data.get('results_count')}"
    test_case("8. Schemes - Voice NLP Search", t_schemes_voice)

    # 9. Weather - Forecast & Agroadvisory
    def t_weather():
        r = client.get("/api/weather/forecast?location=Warangal&state=Telangana")
        data = r.json()
        return r.status_code == 200 and "forecast_7d" in data, f"Status {r.status_code}, location: {data.get('location')}, temp: {data.get('temperature')}°C, spray: {data.get('spray_conditions')[:30]}..."
    test_case("9. Weather - Forecast & Agroadvisory", t_weather)

    # 10. Chat / Krishi Mitra - Conversational RAG
    def t_chat():
        payload = {"message": "Why should I use Kisan AI over Google?", "language": "te"}
        r = client.post("/api/chat", json=payload)
        data = r.json()
        return r.status_code == 200 and len(data.get("reply", "")) > 0, f"Status {r.status_code}, intent: {data.get('intent')}, reply length: {len(data.get('reply', ''))}"
    test_case("10. Krishi Mitra - Multilingual Chatbot", t_chat)

    # 11. Voice Module - Audio Synthesis & Streaming
    def t_voice():
        r_audio = client.get("/api/voice/audio?text=నమస్కారం&lang=te")
        r_synth = client.post("/api/voice/synthesize", json={"text": "నమస్కారం", "language": "te-IN"})
        return r_audio.status_code == 200 and r_synth.status_code == 200, f"Audio streaming: {r_audio.status_code}, Synthesize: {r_synth.status_code}"
    test_case("11. Voice Module - gTTS & Audio Stream", t_voice)

    # 12. Smart Soil & Fertilizer Advisor
    def t_soil():
        r = client.get("/api/soil-advisor/calculate?crop=Paddy&acres=3.5&soil_type=Black Cotton&language=te-IN")
        data = r.json()
        return r.status_code == 200 and data.get("total_money_saved", 0) > 0, f"Status {r.status_code}, saved: ₹{data.get('total_money_saved')}, urea bags: {data.get('total_urea_bags')}"
    test_case("12. Smart Soil & Fertilizer Calculator", t_soil)

    # 13. Expert Video Tutorials
    def t_videos():
        r = client.get("/api/videos")
        data = r.json()
        return r.status_code == 200 and len(data) > 0, f"Status {r.status_code}, video count: {len(data)}"
    test_case("13. Video Tutorials Database", t_videos)

    # 14. Farm Notifications & Alerts
    def t_notifications():
        r = client.get("/api/notifications")
        data = r.json()
        return r.status_code == 200 and len(data) > 0, f"Status {r.status_code}, alert count: {len(data)}"
    test_case("14. Emergency Weather & Pest Alerts", t_notifications)

    # 15. Farmer Profile Service
    def t_profile():
        r_get = client.get("/api/profile")
        p = r_get.json()
        r_put = client.put("/api/profile", json=p)
        return r_get.status_code == 200 and r_put.status_code == 200, f"GET: {r_get.status_code}, PUT: {r_put.status_code}, state: {p.get('state')}"
    test_case("15. Farmer Profile Personalization", t_profile)

    # 16. Admin Analytics
    def t_admin():
        r = client.get("/api/admin/overview")
        data = r.json()
        return r.status_code == 200 and "stats" in data, f"Status {r.status_code}, total scans: {data.get('stats', {}).get('total_crop_scans_processed')}, registered farmers: {data.get('stats', {}).get('registered_farmers')}"
    test_case("16. Admin Dashboard & Telemetry", t_admin)

    print("\n=== Summary ===")
    passed = sum(1 for r in results if r["status"] == "PASS")
    total = len(results)
    print(f"Passed: {passed}/{total}")

if __name__ == "__main__":
    run_tests()
