"""
RAG (Retrieval Augmented Generation) Service for Krishi Raksha AI.
Cites ICAR, Agricultural Universities (PJTSAU, TNAU, PAU), and Govt Scheme documents.
"""

from typing import List, Dict, Any

AGRICULTURAL_KNOWLEDGE_BASE = [
    {
        "id": "kb_paddy_blast",
        "title": "ICAR-NRRI Advisory on Rice Blast Management",
        "agency": "ICAR - National Rice Research Institute (Cuttack)",
        "keywords": ["paddy", "rice", "blast", "fungicide", "nitrogen", "pyricularia"],
        "content": (
            "Rice blast caused by Magnaporthe oryzae (Pyricularia oryzae) manifests as diamond/spindle shaped lesions. "
            "Farmers are strongly advised not to apply excess urea during cloudy spells. "
            "Foliar spray with Tricyclazole 75% WP @ 0.6g/L or bio-agent Pseudomonas fluorescens 10g/L gives excellent prophylactic control."
        ),
        "source_url": "https://nrri.icar.gov.in"
    },
    {
        "id": "kb_cotton_pbw",
        "title": "ICAR-CICR Central Institute for Cotton Research IPM Protocol",
        "agency": "ICAR - Central Institute for Cotton Research (Nagpur)",
        "keywords": ["cotton", "pink bollworm", "pectinophora", "pheromone", "rosette"],
        "content": (
            "Pink bollworm larvae enter developing bolls within 24-48 hours of egg hatch. "
            "Farmers must install 5 pheromone traps per acre at 45 days after sowing. "
            "If catches exceed 8 moths/trap/night for 3 consecutive days, spray Profenofos 50% EC @ 2ml/L or Emamectin Benzoate 5% SG @ 0.5g/L."
        ),
        "source_url": "https://cicr.icar.gov.in"
    },
    {
        "id": "kb_pm_kisan",
        "title": "PM-KISAN Samman Nidhi Operational Guidelines",
        "agency": "Ministry of Agriculture & Farmers Welfare, GoI",
        "keywords": ["pm-kisan", "scheme", "6000", "installment", "aadhaar", "direct benefit transfer"],
        "content": (
            "Pradhan Mantri Kisan Samman Nidhi provides an income support of ₹6,000 per year in three equal installments "
            "of ₹2,000 directly into the bank accounts of land-holding farmer families. "
            "Aadhaar-seeded bank account and eKYC authentication are mandatory."
        ),
        "source_url": "https://pmkisan.gov.in"
    },
    {
        "id": "kb_pmfby",
        "title": "Pradhan Mantri Fasal Bima Yojana (Crop Insurance)",
        "agency": "Department of Agriculture and Cooperation, GoI",
        "keywords": ["pmfby", "crop insurance", "fasal bima", "hailstorm", "flood", "drought", "premium"],
        "content": (
            "PMFBY covers yield losses and localized calamities (hailstorm, landslide, inundation). "
            "Farmer premium is capped at only 2.0% for Kharif food/oilseed crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. "
            "Losses must be intimated within 72 hours via the Crop Insurance App or toll-free number 14447."
        ),
        "source_url": "https://pmfby.gov.in"
    },
    {
        "id": "kb_micro_irrigation",
        "title": "Pradhan Mantri Krishi Sinchayee Yojana (Per Drop More Crop)",
        "agency": "Department of Agriculture, Cooperation & Farmers Welfare",
        "keywords": ["drip", "sprinkler", "subsidy", "irrigation", "pmksy", "water"],
        "content": (
            "Under PMKSY - Per Drop More Crop, small and marginal farmers receive up to 55% subsidy on drip and sprinkler installation, "
            "and other farmers receive 45% central subsidy. Many state governments (e.g., Telangana, Andhra Pradesh, Maharashtra) provide additional top-ups."
        ),
        "source_url": "https://pmksy.gov.in"
    }
]

class RAGService:
    @staticmethod
    def retrieve_context(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        query_words = set(query.lower().split())
        scored = []
        for doc in AGRICULTURAL_KNOWLEDGE_BASE:
            score = 0
            for kw in doc["keywords"]:
                if kw in query.lower():
                    score += 3
            for word in query_words:
                if len(word) > 3 and word in doc["content"].lower():
                    score += 1
            if score > 0:
                scored.append((score, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [doc for _, doc in scored[:top_k]]
        if not results:
            results = [AGRICULTURAL_KNOWLEDGE_BASE[0]]
        return results
