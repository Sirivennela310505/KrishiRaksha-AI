'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LanguageOption {
  code: string;       // e.g. 'te-IN'
  short: string;      // e.g. 'te'
  name: string;       // e.g. 'Telugu'
  native: string;     // e.g. 'తెలుగు'
  region: string;     // e.g. 'Telangana & AP'
  flagIcon: string;   // visual icon
  greeting: string;   // Native audio greeting preview
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'te-IN', short: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Telangana & Andhra Pradesh', flagIcon: '🌾', greeting: 'నమస్కారం! కృషి రక్షా AI కి స్వాగతం.' },
  { code: 'hi-IN', short: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'Uttar Pradesh, MP, Bihar, Rajasthan', flagIcon: '🌱', greeting: 'नमस्ते! कृषि रक्षा AI में आपका स्वागत है।' },
  { code: 'ta-IN', short: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu', flagIcon: '🌿', greeting: 'வணக்கம்! கிருஷி ரக்ஷா AI-க்கு நல்வரவு.' },
  { code: 'kn-IN', short: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka', flagIcon: '🌾', greeting: 'ನಮಸ್ಕಾರ! ಕೃಷಿ ರಕ್ಷಾ AI ಗೆ ಸುಸ್ವಾಗತ.' },
  { code: 'ml-IN', short: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala', flagIcon: '🌴', greeting: 'നമസ്കാരം! കൃഷി രക്ഷ AI-ലേക്ക് സ്വാഗതം.' },
  { code: 'mr-IN', short: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra', flagIcon: '🌻', greeting: 'नमस्कार! कृषी रक्षा AI मध्ये आपले स्वागत आहे.' },
  { code: 'bn-IN', short: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal', flagIcon: '🌾', greeting: 'নমস্কার! কৃষি রক্ষা এআই-তে আপনাকে স্বাগতম।' },
  { code: 'gu-IN', short: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat', flagIcon: '🌿', greeting: 'નમસ્તે! કૃષિ રક્ષા AI માં તમારું સ્વાગત છે.' },
  { code: 'pa-IN', short: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab & Haryana', flagIcon: '🌾', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਕ੍ਰਿਸ਼ੀ ਰਕਸ਼ਾ AI ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।' },
  { code: 'or-IN', short: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha', flagIcon: '🌱', greeting: 'ନମସ୍କାର! କୃଷି ରକ୍ଷା AI କୁ ସ୍ୱାଗତ।' },
  { code: 'as-IN', short: 'as', name: 'Assamese', native: 'অসমীয়া', region: 'Assam & North East', flagIcon: '🍃', greeting: 'নমস্কাৰ! কৃষি ৰক্ষা AI লৈ স্বাগতম।' },
  { code: 'en-IN', short: 'en', name: 'English', native: 'English', region: 'All India', flagIcon: '🇮🇳', greeting: 'Welcome to Krishi Raksha AI agricultural assistant.' },
];

export const CROP_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Paddy': {
    en: 'Paddy / Rice',
    hi: 'धान (चावल)',
    te: 'వరి ధాన్యం',
    ta: 'நெல் (அரிசி)',
    kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',
    ml: 'നെല്ല് (അരി)',
    mr: 'भात / धान',
    bn: 'ধান (চাল)',
    gu: 'ડાંગર (ચોખા)',
    pa: 'ਝੋਨਾ (ਚੌਲ)',
    or: 'ଧାନ',
    as: 'ধান'
  },
  'Cotton': {
    en: 'Cotton',
    hi: 'कपास (रूई)',
    te: 'ప్రత్తి',
    ta: 'பருத்தி',
    kn: 'ಹತ್ತಿ',
    ml: 'പരുത്തി',
    mr: 'कापूस',
    bn: 'তুলা',
    gu: 'કપાસ',
    pa: 'ਕਪਾਹ',
    or: 'କପା',
    as: 'কপাহ'
  },
  'Red Chilli': {
    en: 'Red Chilli',
    hi: 'लाल मिर्च',
    te: 'ఎర్ర మిరప',
    ta: 'சிகப்பு மிளகாய்',
    kn: 'ಕೆಂಪು ಮೆಣಸಿನಕಾಯಿ',
    ml: 'വറ്റൽ മുളക്',
    mr: 'लाल मिरची',
    bn: 'লাল লঙ্কা',
    gu: 'લાલ મરચું',
    pa: 'ਲਾਲ ਮਿਰਚ',
    or: 'ନାଲି ଲଙ୍କା',
    as: 'ৰঙা জলকীয়া'
  },
  'Chilli': {
    en: 'Chilli',
    hi: 'मिर्च',
    te: 'మిరపకాయ',
    ta: 'மிளகாய்',
    kn: 'ಮೆಣಸಿನಕಾಯಿ',
    ml: 'മുളക്',
    mr: 'मिरची',
    bn: 'লঙ্কা',
    gu: 'મરચું',
    pa: 'ਮਿਰਚ',
    or: 'ଲଙ୍କା',
    as: 'জলকীয়া'
  },
  'Tomato': {
    en: 'Tomato',
    hi: 'टमाटर',
    te: 'టమోటా',
    ta: 'தக்காளி',
    kn: 'ಟೊಮೆಟೊ',
    ml: 'തക്കാളി',
    mr: 'टोमॅटो',
    bn: 'টমেটো',
    gu: 'ટામેટાં',
    pa: 'ਟਮਾਟਰ',
    or: 'ବିଲାତି ବାଇଗଣ (ଟମାଟୋ)',
    as: 'টমেটো'
  },
  'Wheat': {
    en: 'Wheat',
    hi: 'गेहूं',
    te: 'గోధుమలు',
    ta: 'கோதுமை',
    kn: 'ಗೋಧಿ',
    ml: 'ഗോതമ്പ്',
    mr: 'गहू',
    bn: 'গম',
    gu: 'ઘઉં',
    pa: 'ਕਣਕ',
    or: 'ଗହମ',
    as: 'ঘেঁহু'
  },
  'Soybean': {
    en: 'Soybean',
    hi: 'सोयाबीन',
    te: 'సోయాబీన్',
    ta: 'சோயாபீன்',
    kn: 'ಸೋಯಾಬೀನ್',
    ml: 'സോയാബീൻ',
    mr: 'सोयाबीन',
    bn: 'সয়াবিন',
    gu: 'સોયાબીન',
    pa: 'ਸੋਇਆਬੀਨ',
    or: 'ସୋୟାବିନ୍',
    as: 'ছয়াবিন'
  },
  'Onion': {
    en: 'Onion',
    hi: 'प्याज',
    te: 'ఉల్లిపాయ',
    ta: 'வெங்காயம்',
    kn: 'ಈರುಳ್ಳಿ',
    ml: 'സവാള / ഉള്ളി',
    mr: 'कांदा',
    bn: 'পেঁয়াজ',
    gu: 'ડુંગળી',
    pa: 'ਪਿਆਜ਼',
    or: 'ପିଆଜ',
    as: 'পিয়াঁজ'
  },
  'Maize': {
    en: 'Maize (Corn)',
    hi: 'मक्का (भुट्टा)',
    te: 'మొక్కజొన్న',
    ta: 'மக்காச்சோளம்',
    kn: 'ಮೆಕ್ಕೆಜೋಳ',
    ml: 'മക്കച്ചോളം',
    mr: 'मका',
    bn: 'ভুট্টা',
    gu: 'મકાઈ',
    pa: 'ਮੱਕੀ',
    or: 'ମକା',
    as: 'মাকৈ'
  },
  'Turmeric': {
    en: 'Turmeric',
    hi: 'हल्दी',
    te: 'పసుపు',
    ta: 'மஞ்சள்',
    kn: 'ಅರಿಶಿನ',
    ml: 'മഞ്ഞൾ',
    mr: 'हळद',
    bn: 'হলুদ',
    gu: 'હળદર',
    pa: 'ਹਲਦੀ',
    or: 'ହଳଦୀ',
    as: 'হালধি'
  },
  'Potato': {
    en: 'Potato',
    hi: 'आलू',
    te: 'బంగాళాదుంప (ఆలూ)',
    ta: 'உருளைக்கிழங்கு',
    kn: 'ಆಲೂಗಡ್ಡೆ',
    ml: 'ഉരുളക്കിഴങ്ങ്',
    mr: 'बटाटा',
    bn: 'আলু',
    gu: 'બટાકા',
    pa: 'ਆਲੂ',
    or: 'ଆଳୁ',
    as: 'আলু'
  },
  'Garlic': {
    en: 'Garlic',
    hi: 'लहसुन',
    te: 'వెల్లుల్లి',
    ta: 'பூண்டு',
    kn: 'ಬೆಳ್ಳುಳ್ಳಿ',
    ml: 'വെളുത്തുള്ളി',
    mr: 'लसूण',
    bn: 'রসুন',
    gu: 'લસણ',
    pa: 'ਲਸਣ',
    or: 'ରସୁଣ',
    as: 'নহৰু'
  },
  'Groundnut': {
    en: 'Groundnut (Peanut)',
    hi: 'मूंगफली',
    te: 'వేరుశనగ (పల్లీ)',
    ta: 'வேர்க்கடலை',
    kn: 'ಕಡಲೆಕಾಯಿ',
    ml: 'നിലക്കടല',
    mr: 'भुईमूग',
    bn: 'চীনাবাদাম',
    gu: 'મગફળી',
    pa: 'ਮੂੰਗਫਲੀ',
    or: 'ଚିନାବାଦାମ',
    as: 'বাদাম'
  }
};

export const UI_STRINGS: Record<string, Record<string, string>> = {
  app_name: {
    en: 'Krishi Raksha AI',
    hi: 'कृषि रक्षा एआई',
    te: 'కృషి రక్షా AI',
    ta: 'கிருஷி ரக்ஷா AI',
    kn: 'ಕೃಷಿ ರಕ್ಷಾ AI',
    ml: 'കൃഷി രക്ഷാ AI',
    mr: 'कृषी रक्षा AI',
    bn: 'কৃষি রক্ষা এআই',
    gu: 'કૃષિ રક્ષા AI',
    pa: 'ਕ੍ਰਿਸ਼ੀ ਰਕਸ਼ਾ AI',
    or: 'କୃଷି ରକ୍ଷା AI',
    as: 'কৃষি ৰক্ষা AI'
  },
  select_lang_title: {
    en: 'Select Your Language',
    hi: 'अपनी भाषा चुनें',
    te: 'మీ భాషను ఎంచుకోండి',
    ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    kn: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കൂ',
    mr: 'आपली भाषा निवडा',
    bn: 'আপনার ভাষা নির্বাচন করুন',
    gu: 'તમારી ભાષા પસંદ કરો',
    pa: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    or: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
    as: 'আপোনাৰ ভাষা বাছক'
  },
  select_lang_subtitle: {
    en: 'Choose your native dialect. All voice readouts, prices, and disease reports will be in this language.',
    hi: 'अपनी मातृभाषा चुनें। सभी आवाज, मंडी भाव, और फसल डॉक्टर रिपोर्ट इसी भाषा में होंगे।',
    te: 'మీ మాతృభాషను ఎంచుకోండి. అన్ని వాయిస్ సూచనలు, ధరలు, పంట నివేదికలు ఈ భాషలోనే ఉంటాయి.',
    ta: 'உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும். அனைத்து குரல் வழிமுறைகளும் இந்த மொழியிலேயே இருக்கும்.',
    kn: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಎಲ್ಲಾ ಧ್ವನಿ ವಿವರಣೆಗಳು, ಬೆಲೆಗಳು ಈ ಭಾಷೆಯಲ್ಲೇ ಬರುತ್ತವೆ.',
    ml: 'സ്വന്തം ഭാഷ തിരഞ്ഞെടുക്കൂ. ശബ്ദ സന്ദേശങ്ങളും നിരക്കുകളും ഈ ഭാഷയിൽ ലഭ്യമാകും.',
    mr: 'आपली मातृभाषा निवडा. सर्व व्हॉईस मार्गदर्शन आणि बाजारभाव याच भाषेत उपलब्ध होतील.',
    bn: 'নিজের ভাষা বেছে নিন। সমস্ত ভয়েস রিডআউট এবং বাজার দর এই ভাষাতেই শুনবেন।',
    gu: 'તમારી માતૃભાષા પસંદ કરો. તમામ અવાજ અને બજાર ભાવો આ ભાષામાં ઉપલબ્ધ રહેશે.',
    pa: 'ਆਪਣੀ ਮਾਂ ਬੋਲੀ ਚੁਣੋ। ਸਾਰੇ ਵੌਇਸ ਮੈਸੇਜ ਅਤੇ ਮੰਡੀ ਰੇਟ ਇਸੇ ਬੋਲੀ ਵਿੱਚ ਮਿਲਣਗੇ।',
    or: 'ନିଜ ଭାଷା ବାଛନ୍ତୁ। ସମସ୍ତ ଭଏସ୍ ନିର୍ଦ୍ଦେଶ ଏବଂ ମଣ୍ଡି ଦର ଏହି ଭାଷାରେ ମିଳିବ।',
    as: 'আপোনাৰ ভাষা বাছক। সকলো কণ্ঠ বাৰ্তা আৰু বজাৰ দৰ এই ভাষাতেই পাব।'
  },
  change_lang_btn: {
    en: 'Change Language',
    hi: 'भाषा बदलें',
    te: 'భాష మార్చండి',
    ta: 'மொழியை மாற்றவும்',
    kn: 'ಭಾಷೆ ಬದಲಿಸಿ',
    ml: 'ഭാഷ മാറ്റുക',
    mr: 'भाषा बदला',
    bn: 'ভাষা পরিবর্তন',
    gu: 'ભાષા બદલો',
    pa: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    or: 'ଭାଷା ବଦଳାନ୍ତୁ',
    as: 'ভাষা সলনি কৰক'
  },
  continue_btn: {
    en: 'Continue to Dashboard →',
    hi: 'डैशबोर्ड पर आगे बढ़ें →',
    te: 'డాష్‌బోర్డ్‌కు వెళ్ళండి →',
    ta: 'டாஷ்போர்டுக்கு தொடரவும் →',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ →',
    ml: 'ഡാഷ്‌ബോർഡിലേക്ക് പോകൂ →',
    mr: 'डॅशबोर्डवर जा →',
    bn: 'ড্যাশবোর্ডে প্রবেশ করুন →',
    gu: 'ડેશબોર્ડ પર આગળ વધો →',
    pa: 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਜਾਓ →',
    or: 'ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ →',
    as: 'ডেশ্ববৰ্ডলৈ আগবাঢ়ক →'
  },
  hero_title: {
    en: 'Your Farm. Your Language. Your AI Assistant.',
    hi: 'आपका खेत। आपकी भाषा। आपका एआई सहायक।',
    te: 'మీ పొలం. మీ భాష. మీ AI సహాయకుడు.',
    ta: 'உங்கள் பண்ணை. உங்கள் மொழி. உங்கள் AI உதவியாளர்.',
    kn: 'ನಿಮ್ಮ ಜಮೀನು. ನಿಮ್ಮ ಭಾಷೆ. ನಿಮ್ಮ AI ಸಹಾಯಕ.',
    ml: 'നിങ്ങളുടെ കൃഷി. നിങ്ങളുടെ ഭാഷ. നിങ്ങളുടെ AI സഹായി.',
    mr: 'तुमचे शेत. तुमची भाषा. तुमचा AI सहाय्यक.',
    bn: 'আপনার খামার। আপনার ভাষা। আপনার এআই সহকারী।',
    gu: 'તમારું ખેતર. તમારી ભાષા. તમારો AI મદદગાર.',
    pa: 'ਤੁਹਾਡਾ ਖੇਤ। ਤੁਹਾਡੀ ਬੋਲੀ। ਤੁਹਾਡਾ AI ਸਹਾਇਕ।',
    or: 'ଆପଣଙ୍କ ଜମି। ଆପଣଙ୍କ ଭାଷା। ଆପଣଙ୍କ AI ସାଥୀ।',
    as: 'আপোনাৰ খেতি। আপোনাৰ ভাষা। আপোনাৰ AI সহায়ক।'
  },
  hero_subtitle: {
    en: 'Understand your crops, markets, weather and government schemes—all through your own language.',
    hi: 'अपनी फसलों, मंडियों, मौसम और सरकारी योजनाओं को अपनी भाषा में समझें।',
    te: 'మీ పంటలు, మార్కెట్ ధరలు, వాతావరణం మరియు ప్రభుత్వ పథకాలను మీ మాతృభాషలోనే తెలుసుకోండి.',
    ta: 'உங்கள் பயிர்கள், சந்தை விலைகள், வானிலை மற்றும் அரசு திட்டங்களை உங்கள் சொந்த மொழியிலேயே அறிந்து கொள்ளுங்கள்.',
    kn: 'ನಿಮ್ಮ ಬೆಳೆಗಳು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ, ಹವಾಮಾನ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲೇ ತಿಳಿಯಿರಿ.',
    ml: 'വിളകൾ, വിപണി വിലകൾ, കാലാവസ്ഥ, സർക്കാർ പദ്ധതികൾ എന്നിവയെല്ലാം നിങ്ങളുടെ സ്വന്തം ഭാഷയിൽ മനസ്സിലാക്കൂ.',
    mr: 'तुमची पिके, बाजारभाव, हवामान आणि सरकारी योजना आपल्या स्वतःच्या भाषेत समजून घ्या.',
    bn: 'আপনার ফসল, বাজার দর, আবহাওয়া এবং সরকারি প্রকল্পগুলো নিজের ভাষায় সহজে বুঝুন।',
    gu: 'તમારા પાક, બજાર ભાવો, હવામાન અને સરકારી યોજનાઓને તમારી પોતાની ભાષામાં સમજો.',
    pa: 'ਆਪਣੀਆਂ ਫ਼ਸਲਾਂ, ਮੰਡੀ ਭਾਅ, ਮੌਸਮ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਨੂੰ ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਸਮਝੋ।',
    or: 'ନିଜ ଭାଷାରେ ନିଜ ଫସଲ, ମଣ୍ଡି ଦର, ପାଣିପାଗ ଏବଂ ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣନ୍ତୁ।',
    as: 'আপোনাৰ শস্য, বজাৰ দৰ, বতৰ আৰু চৰকাৰী আঁচনিসমূহ নিজৰ ভাষাত বুজি লওক।'
  },
  cta_ask_ai: {
    en: '🎙️ Ask Krishi Mitra',
    hi: '🎙️ कृषि मित्र से पूछें',
    te: '🎙️ కృషి మిత్రను అడగండి',
    ta: '🎙️ கிருஷி மித்ராவிடம் கேளுங்கள்',
    kn: '🎙️ ಕೃಷಿ ಮಿತ್ರನನ್ನು ಕೇಳಿ',
    ml: '🎙️ കൃഷി മിത്രയോട് ചോദിക്കൂ',
    mr: '🎙️ कृषी मित्राला विचारा',
    bn: '🎙️ কৃষি মিত্রকে জিজ্ঞাসা করুন',
    gu: '🎙️ કૃષિ મિત્રને પૂછો',
    pa: '🎙️ ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਨੂੰ ਪੁੱਛੋ',
    or: '🎙️ କୃଷି ମିତ୍ରଙ୍କୁ ପଚାରନ୍ତୁ',
    as: '🎙️ কৃষি মিত্ৰক সোধক'
  },
  cta_check_crop: {
    en: '📷 Check My Crop',
    hi: '📷 मेरी फसल की जाँच करें',
    te: '📷 నా పంటను పరీక్షించండి',
    ta: '📷 என் பயிரைச் சோதிக்கவும்',
    kn: '📷 ನನ್ನ ಬೆಳೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ',
    ml: '📷 എന്റെ വിള പരിശോധിക്കൂ',
    mr: '📷 माझे पीक तपासा',
    bn: '📷 আমার ফসল পরীক্ষা করুন',
    gu: '📷 મારો પાક તપાસો',
    pa: '📷 ਮੇਰੀ ਫ਼ਸਲ ਦੀ ਜਾਂਚ ਕਰੋ',
    or: '📷 ମୋ ଫସଲ ଯାଞ୍ଚ କରନ୍ତୁ',
    as: '📷 মোৰ শস্য পৰীক্ষা কৰক'
  },
  nav_home: {
    en: 'Home',
    hi: 'होम',
    te: 'హోమ్',
    ta: 'முகப்பு',
    kn: 'ಮುಖಪುಟ',
    ml: 'ഹോം',
    mr: 'मुख्य',
    bn: 'হোম',
    gu: 'હોમ',
    pa: 'ਹੋਮ',
    or: 'ମୁଖ୍ୟ',
    as: 'ঘৰ'
  },
  nav_crop: {
    en: 'Crop Doctor',
    hi: 'फसल डॉक्टर',
    te: 'పంట డాక్టర్',
    ta: 'பயிர் மருத்துவர்',
    kn: 'ಬೆಳೆ ವೈದ್ಯ',
    ml: 'വിള ഡോക്ടർ',
    mr: 'पीक डॉक्टर',
    bn: 'ফসল ডাক্তার',
    gu: 'પાક ડૉક્ટર',
    pa: 'ਫ਼ਸਲ ਡਾਕਟਰ',
    or: 'ଫସଲ ଡାକ୍ତର',
    as: 'শস্য চিকিৎসক'
  },
  nav_mandi: {
    en: 'Mandi Prices',
    hi: 'मंडी भाव',
    te: 'మార్కెట్ ధరలు',
    ta: 'மண்டி விலைகள்',
    kn: 'ಮಂಡಿ ಬೆಲೆಗಳು',
    ml: 'വിപണി വിലകൾ',
    mr: 'बाजार भाव',
    bn: 'মান্ডি দর',
    gu: 'મંડી ભાવો',
    pa: 'ਮੰਡੀ ਭਾਅ',
    or: 'ମଣ୍ଡି ଦର',
    as: 'বজাৰ দৰ'
  },
  nav_schemes: {
    en: 'Govt Schemes',
    hi: 'सरकारी योजनाएं',
    te: 'ప్రభుత్వ పథకాలు',
    ta: 'அரசு திட்டங்கள்',
    kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    ml: 'സർക്കാർ പദ്ധതികൾ',
    mr: 'सरकारी योजना',
    bn: 'সরকারি প্রকল্প',
    gu: 'સરકારી યોજનાઓ',
    pa: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    or: 'ସରକାରୀ ଯୋଜନା',
    as: 'চৰকাৰী আঁচনি'
  },
  nav_weather: {
    en: 'Weather',
    hi: 'मौसम',
    te: 'వాతావరణం',
    ta: 'வானிலை',
    kn: 'ಹವಾಮಾನ',
    ml: 'കാലാവസ്ഥ',
    mr: 'हवामान',
    bn: 'আবহাওয়া',
    gu: 'હવામાન',
    pa: 'ਮੌਸਮ',
    or: 'ପାଣିପାଗ',
    as: 'বতৰ'
  },
  nav_videos: {
    en: 'Farming Videos',
    hi: 'खेती वीडियो',
    te: 'వ్యవసాయ వీడియోలు',
    ta: 'விவசாய வீடியோக்கள்',
    kn: 'ಕೃಷಿ ವೀಡಿಯೊಗಳು',
    ml: 'കൃഷി വീഡിയോകൾ',
    mr: 'शेती व्हिडिओ',
    bn: 'কৃষি ভিডিও',
    gu: 'ખેતી વિડિયો',
    pa: 'ਖੇਤੀਬਾੜੀ ਵੀਡੀਓ',
    or: 'କୃଷି ଭିଡିଓ',
    as: 'কৃষি ভিডিঅ’'
  },
  nav_soil_advisor: {
    en: 'Soil & Fertilizer Advisor',
    hi: 'संतुलित खाद कैलकुलेटर',
    te: 'ఎరువుల మోతాదు సలహాదారు',
    ta: 'உர அளவு ஆலோசகர்',
    kn: 'ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ ಸಲಹೆಗಾರ',
    ml: 'വളം അളവ് ഉപദേശകൻ',
    mr: 'खत मात्रा सल्लागार',
    bn: 'সার পরিমাপ উপদেষ্টা',
    gu: 'ખાતર માત્રા સલાહકાર',
    pa: 'ਖਾਦ ਮਾਤਰਾ ਸਲਾਹਕਾਰ',
    or: 'ଖତ ମାତ୍ରା ପରାମର୍ଶଦାତା',
    as: 'সাৰ পৰিমাণ উপদেষ্টা'
  },
  nav_why_kisan_ai: {
    en: 'Why KisanAI vs Google',
    hi: 'गूगल बनाम किसान AI',
    te: 'గూగుల్ వర్సెస్ మన యాప్',
    ta: 'கூகிள் vs கிசான் AI',
    kn: 'ಗೂಗಲ್ vs ಕಿಸಾನ್ AI',
    ml: 'ഗൂഗിൾ vs കിസാൻ AI',
    mr: 'गुगल विरुद्ध किसान AI',
    bn: 'গুগল বনাম কিষাণ এআই',
    gu: 'ગુગલ વિરુદ્ધ કિસાન AI',
    pa: 'ਗੂਗਲ ਬਨਾਮ ਕਿਸਾਨ AI',
    or: 'ଗୁଗଲ ବନାମ କିଷାନ AI',
    as: 'গুগল বনাম কিষাণ AI'
  },
  nav_chat: {
    en: 'Krishi Mitra AI',
    hi: 'कृषि मित्र एआई',
    te: 'రైతు AI మిత్ర చాట్',
    ta: 'கிருஷி மித்ரா AI',
    kn: 'ಕೃಷಿ ಮಿತ್ರ AI',
    ml: 'കൃഷി മിത്ര AI',
    mr: 'कृषी मित्र AI',
    bn: 'কৃষি মিত্র এআই',
    gu: 'કૃષિ મિત્ર AI',
    pa: 'ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ AI',
    or: 'କୃଷି ମିତ୍ର AI',
    as: 'কৃষি মিত্ৰ AI'
  },
  tell_price_btn: {
    en: '🔊 Tell Price',
    hi: '🔊 भाव सुनें',
    te: '🔊 ధర చెప్పండి',
    ta: '🔊 விலை கேட்க',
    kn: '🔊 ಬೆಲೆ ಆಲಿಸಿ',
    ml: '🔊 വില കേൾക്കൂ',
    mr: '🔊 भाव ऐका',
    bn: '🔊 দাম শুনুন',
    gu: '🔊 ભાવ સાંભળો',
    pa: '🔊 ਭਾਅ ਸੁਣੋ',
    or: '🔊 ଦର ଶୁଣନ୍ତୁ',
    as: '🔊 দৰ শুনক'
  },
  ask_any_crop: {
    en: '🎙️ Ask Any Crop Price',
    hi: '🎙️ किसी भी फसल का भाव पूछें',
    te: '🎙️ ఏ పంట ధర అయినా అడగండి',
    ta: '🎙️ எந்த பயிர் விலையையும் கேளுங்கள்',
    kn: '🎙️ ಯಾವುದೇ ಬೆಳೆ ಬೆಲೆ ಕೇಳಿ',
    ml: '🎙️ ഏത് വിളയുടെയും വില ചോദിക്കൂ',
    mr: '🎙️ कोणत्याही पिकाचा भाव विचारा',
    bn: '🎙️ যেকোনো ফসলের দাম জানুন',
    gu: '🎙️ કોઈપણ પાકનો ભાવ પૂછો',
    pa: '🎙️ ਕਿਸੇ ਵੀ ਫ਼ਸਲ ਦਾ ਭਾਅ ਪੁੱਛੋ',
    or: '🎙️ ଯେକୌଣସି ଫସଲର ଦର ପଚାରନ୍ତୁ',
    as: '🎙️ যিকোনো শস্যৰ দৰ সোধক'
  },
  tell_any_crop_subtitle: {
    en: 'Tap a crop below or speak to instantly hear today\'s market rates in your language.',
    hi: 'नीचे किसी फसल पर टैप करें या बोलकर तुरंत अपनी भाषा में आज का मंडी भाव सुनें।',
    te: 'క్రింద ఉన్న పంటను తాకండి లేదా మాట్లాడి మీ భాషలో నేటి మార్కెట్ ధరను వినండి.',
    ta: 'கீழே உள்ள பயிரைத் தட்டவும் அல்லது பேசி இன்றைய சந்தை விலையைக் கேட்கவும்.',
    kn: 'ಕೆಳಗಿನ ಬೆಳೆಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯನ್ನು ಆಲಿಸಿ.',
    ml: 'താഴെയുള്ള വിളയിൽ തൊടുകയോ സംസാരിക്കുകയോ ചെയ്ത് ഇന്നത്തെ വില കേൾക്കൂ.',
    mr: 'खालील पिकावर टॅप करा किंवा बोलून आजचा बाजारभाव ऐका.',
    bn: 'নিচের যেকোনো ফসলে ট্যাপ করুন বা কথা বলে আজকের দর শুনুন।',
    gu: 'નીચેના પાક પર ટેપ કરો અથવા બોલીને આજનો ભાવ સાંભળો.',
    pa: 'ਹੇਠਾਂ ਫ਼ਸਲ ਚੁਣੋ ਜਾਂ ਬੋਲ ਕੇ ਅੱਜ ਦਾ ਮੰਡੀ ਭਾਅ ਸੁਣੋ।',
    or: 'ତଳେ ଥିବା ଫସଲ ଛୁଅନ୍ତୁ କିମ୍ବା କହି ଆଜିର ମଣ୍ଡି ଦର ଶୁଣନ୍ତୁ।',
    as: 'তলৰ শস্য নিৰ্বাচন কৰক বা কথা কৈ আজিৰ বজাৰ দৰ শুনক।'
  },
  live_mandi_badge: {
    en: 'Live Agmarknet Feeds',
    hi: 'लाइव एगमार्कनेट भाव',
    te: 'లైవ్ మార్కెట్ ధరలు',
    ta: 'நேரலை அக்மார்க்நெட் விலைகள்',
    kn: 'ನೇರ ಎಗ್ಮಾರ್ಕ್‌ನೆಟ್ ಬೆಲೆಗಳು',
    ml: 'തത്സമയ വിപണി നിരക്കുകൾ',
    mr: 'थेट अ‍ॅगमार्कनेट भाव',
    bn: 'লাইভ এগমার্কনেট দর',
    gu: 'લાઈવ એગમાર્કનેટ ભાવો',
    pa: 'ਲਾਈਵ ਐਗਮਾਰਕਨੈੱਟ ਭਾਅ',
    or: 'ପ୍ରତ୍ୟକ୍ଷ ଏଗମାର୍କନେଟ୍ ଦର',
    as: 'লাইভ এগমাৰ্কনেট দৰ'
  },
  price_per_qtl: {
    en: '₹ / Quintal',
    hi: '₹ / क्विंटल',
    te: '₹ / క్వింటాలుకు',
    ta: '₹ / குவிண்டால்',
    kn: '₹ / ಕ್ವಿಂಟಲ್',
    ml: '₹ / ക്വിന്റൽ',
    mr: '₹ / क्विंटल',
    bn: '₹ / কুইন্টাল',
    gu: '₹ / ક્વિન્ટલ',
    pa: '₹ / ਕੁਇੰਟਲ',
    or: '₹ / କ୍ୱିଣ୍ଟାଲ',
    as: '₹ / কুইন্টল'
  },
  modal_price: {
    en: 'Modal Price',
    hi: 'मॉडल भाव',
    te: 'సగటు ధర',
    ta: 'மாதிரி விலை',
    kn: 'ಮಾದರಿ ಬೆಲೆ',
    ml: 'ശരാശരി വില',
    mr: 'सरासरी भाव',
    bn: 'গড় দর',
    gu: 'સરેરાશ ભાવ',
    pa: 'ਔਸਤ ਭਾਅ',
    or: 'ମଧ୍ୟମ ଦର',
    as: 'গড় দৰ'
  },
  min_max_price: {
    en: 'Min - Max',
    hi: 'न्यूनतम - अधिकतम',
    te: 'కనిష్ట - గరిష్ట',
    ta: 'குறைந்த - அதிகபட்ச',
    kn: 'ಕನಿಷ್ಠ - ಗರಿಷ್ಠ',
    ml: 'കുറഞ്ഞ - കൂടിയ',
    mr: 'किमान - कमाल',
    bn: 'সর্বনিম্ন - সর্বোচ্চ',
    gu: 'લઘુત્તમ - મહત્તમ',
    pa: 'ਘੱਟੋ-ਘੱਟ - ਵੱਧ ਤੋਂ ਵੱਧ',
    or: 'ସର୍ବନିମ୍ନ - ସର୍ବାଧିକ',
    as: 'সৰ্বনিম্ন - সৰ্বোচ্চ'
  },
  listen_btn: {
    en: '🔊 Listen',
    hi: '🔊 सुनें',
    te: '🔊 వినండి',
    ta: '🔊 கேட்கவும்',
    kn: '🔊 ಆಲಿಸಿ',
    ml: '🔊 കേൾക്കൂ',
    mr: '🔊 ऐका',
    bn: '🔊 শুনুন',
    gu: '🔊 સાંભળો',
    pa: '🔊 ਸੁਣੋ',
    or: '🔊 ଶୁଣନ୍ତୁ',
    as: '🔊 শুনক'
  },
  listen_again_btn: {
    en: '🔄 Listen Again',
    hi: '🔄 फिर से सुनें',
    te: '🔄 మళ్ళీ వినండి',
    ta: '🔄 மீண்டும் கேட்கவும்',
    kn: '🔄 ಮತ್ತೊಮ್ಮೆ ಆಲಿಸಿ',
    ml: '🔄 വീണ്ടും കേൾക്കൂ',
    mr: '🔄 पुन्हा ऐका',
    bn: '🔄 আবার শুনুন',
    gu: '🔄 ફરી સાંભળો',
    pa: '🔄 ਦੁਬਾਰਾ ਸੁਣੋ',
    or: '🔄 ପୁଣି ଶୁଣନ୍ତୁ',
    as: '🔄 পুনৰ শুনক'
  },
  speaking_now: {
    en: 'Speaking now…',
    hi: 'बोल रहे हैं…',
    te: 'మాట్లాడుతున్నాము…',
    ta: 'பேசுகிறது…',
    kn: 'ಮಾತನಾಡುತ್ತಿದೆ…',
    ml: 'സംസാരിക്കുന്നു…',
    mr: 'बोलत आहे…',
    bn: 'বলছি…',
    gu: 'બોલી રહ્યા છીએ…',
    pa: 'ਬੋਲ ਰਹੇ ਹਾਂ…',
    or: 'କୁହୁଛୁ…',
    as: 'কৈ আছোঁ…'
  },
  watch_video_btn: {
    en: '▶ Watch Tutorial',
    hi: '▶ वीडियो देखें',
    te: '▶ వీడియో చూడండి',
    ta: '▶ வீடியோவைப் பார்க்கவும்',
    kn: '▶ ವೀಡಿಯೊ ನೋಡಿ',
    ml: '▶ വീഡിയോ കാണൂ',
    mr: '▶ व्हिडिओ पहा',
    bn: '▶ ভিডিও দেখুন',
    gu: '▶ વિડિયો જુઓ',
    pa: '▶ ਵੀਡੀਓ ਦੇਖੋ',
    or: '▶ ଭିଡିଓ ଦେଖନ୍ତୁ',
    as: '▶ ভিডিঅ’ চাওক'
  },
  listen_audio_tip: {
    en: '🔊 Listen Audio Tip',
    hi: '🔊 कृषि सलाह सुनें',
    te: '🔊 వ్యవసాయ సలహా వినండి',
    ta: '🔊 ஆடியோ குறிப்பு கேட்க',
    kn: '🔊 ಕೃಷಿ ಸಲಹೆ ಆಲಿಸಿ',
    ml: '🔊 കൃഷി ടിപ്പ് കേൾക്കൂ',
    mr: '🔊 ऑडिओ सल्ला ऐका',
    bn: '🔊 পরামর্শ শুনুন',
    gu: '🔊 સલાહ સાંભળો',
    pa: '🔊 ਖੇਤੀ ਸਲਾਹ ਸੁਣੋ',
    or: '🔊 କୃଷି ପରାମର୍ଶ ଶୁଣନ୍ତୁ',
    as: '🔊 পৰামৰ্শ শুনক'
  }
};

interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  selectLanguage: (codeOrShort: string) => void;
  t: (key: string) => string;
  tCrop: (crop: string) => string;
  allLanguages: LanguageOption[];
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  openLanguageModal: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: LANGUAGES[0],
  setLanguage: () => {},
  selectLanguage: () => {},
  t: (key: string) => key,
  tCrop: (crop: string) => crop,
  allLanguages: LANGUAGES,
  isLanguageModalOpen: false,
  setIsLanguageModalOpen: () => {},
  openLanguageModal: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('krishi_raksha_lang');
    if (saved) {
      const found = LANGUAGES.find((l) => l.code === saved || l.short === saved);
      if (found) {
        setCurrentLanguage(found);
      }
    } else {
      // First visit: automatically open the animated language selection modal!
      setIsLanguageModalOpen(true);
    }
  }, []);

  const handleSetLanguage = (lang: LanguageOption) => {
    setCurrentLanguage(lang);
    localStorage.setItem('krishi_raksha_lang', lang.code);
  };

  const handleSelectLanguage = (codeOrShort: string) => {
    const target = LANGUAGES.find(
      (l) => l.code === codeOrShort || l.short === codeOrShort || l.name.toLowerCase() === codeOrShort.toLowerCase()
    );
    if (target) {
      handleSetLanguage(target);
    }
  };

  const t = (key: string): string => {
    const phrase = UI_STRINGS[key];
    if (!phrase) return key;
    return phrase[currentLanguage.short] || phrase['en'] || key;
  };

  const tCrop = (cropName: string): string => {
    // Check direct match
    if (CROP_TRANSLATIONS[cropName]) {
      return CROP_TRANSLATIONS[cropName][currentLanguage.short] || CROP_TRANSLATIONS[cropName]['en'] || cropName;
    }
    // Partial search (e.g. "Paddy / Rice")
    for (const [key, map] of Object.entries(CROP_TRANSLATIONS)) {
      if (cropName.toLowerCase().includes(key.toLowerCase())) {
        return map[currentLanguage.short] || map['en'] || cropName;
      }
    }
    return cropName;
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        selectLanguage: handleSelectLanguage,
        t,
        tCrop,
        allLanguages: LANGUAGES,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        openLanguageModal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
