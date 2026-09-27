export interface CropDiagnosis {
  scan_id: number;
  crop: string;
  crop_local?: string;
  condition: string;
  confidence: number;
  pathogen_type: string;
  symptoms: string[];
  causes: string[];
  organic_remedies: string[];
  chemical_remedies: string[];
  precautions: string[];
  expert_consultation_trigger: string;
  requires_expert_review: boolean;
  image_url: string;
  audio_narrative: string;
  language: string;
  disclaimer: string;
}

export interface CropSample {
  id: string;
  crop: string;
  condition: string;
  image_preview: string;
  sample_query: string;
}

export interface MandiPrice {
  id: number;
  crop_name: string;
  variety: string;
  market_name: string;
  state: string;
  district: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_unit: string;
  arrival_volume: number;
  price_change: number;
  price_trend: 'up' | 'down' | 'stable';
  date: string;
}

export interface MarketTrend {
  crop: string;
  market: string;
  current_modal_price: number;
  change_7d_percent: number;
  trend_direction: string;
  ai_summary: string;
  disclaimer: string;
  historical_data: {
    date: string;
    modal_price: number;
    min_price: number;
    max_price: number;
  }[];
  nearby_markets: {
    market: string;
    price: number;
    distance_km: string;
    trend: string;
  }[];
}

export interface GovernmentScheme {
  id: number;
  title: string;
  short_code: string;
  category: string;
  short_description: string;
  who_can_benefit: string;
  eligibility_criteria: string[];
  financial_benefits: string;
  required_documents: string[];
  application_steps: string[];
  official_portal_url: string;
  official_source: string;
  state_applicability: string;
  last_verified_date: string;
}

export interface WeatherData {
  location: string;
  state: string;
  temperature: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed_kmh: number;
  rain_probability: number;
  condition: string;
  condition_icon: string;
  advisory_summary: string;
  spray_conditions: string;
  irrigation_advice: string;
  field_work_feasible: boolean;
  forecast_7d: {
    day: string;
    date: string;
    temp_max: number;
    temp_min: number;
    rain_probability: number;
    condition: string;
    icon: string;
    field_advisory: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'krishi_mitra';
  text: string;
  timestamp: string;
  audioNarrative?: string;
  intent?: string;
  citedSources?: string[];
  suggestedActions?: string[];
}

export interface VideoTip {
  id: number;
  title: string;
  topic: string;
  crop?: string;
  duration: string;
  thumbnail_url: string;
  video_url: string;
  expert_name: string;
  institution: string;
  language: string;
}

export interface FarmAlert {
  id: number;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  location: string;
  crop?: string;
  audio_text?: string;
  created_at: string;
}

export interface FarmerProfileData {
  preferred_language: string;
  state: string;
  district: string;
  sub_district: string;
  village: string;
  farm_size_acres: number;
  crops_grown: string[];
  soil_type: string;
  irrigation_source: string;
  sms_alerts_enabled: boolean;
  voice_alerts_enabled: boolean;
}
