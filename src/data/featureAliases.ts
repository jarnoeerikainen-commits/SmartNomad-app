// ═══════════════════════════════════════════════════════════════════════════
// Feature Aliases — multilingual & natural-language synonyms per feature ID
// ───────────────────────────────────────────────────────────────────────────
// The single source of truth that powers:
//   • Voice navigation (every feature is voice-callable in 13 languages)
//   • Concierge AI intent routing
//   • Support AI feature lookup
//
// To make a brand-new feature voice-callable in every language, add an entry
// here with the feature's `id` as the key. featureAutoSync.ts handles the rest.
// English aliases are derived automatically from the feature `label`, so this
// file should focus on translations and natural phrasings.
// ═══════════════════════════════════════════════════════════════════════════

export const FEATURE_ALIASES: Record<string, string[]> = {
  // ─── Tax & Compliance ─────────────────────────────────────────────
  expenses: [
    'expense', 'expenses', 'receipt', 'receipts', 'per diem', 'vat', 'reclaim',
    'spend tracker', 'business expense', 'gastos', 'dépenses', 'spese', 'ausgaben',
    '経費', '비용', 'расходы', 'مصاريف', 'खर्च', 'masraf', '费用', 'despesas',
  ],
  tax: ['tax dashboard', 'tax hub', 'taxes', 'impuestos', 'fiscalité', 'steuer', '税', '세금', 'налоги', 'ضرائب', 'कर', 'vergi'],
  'tax-residency': ['country tracker', 'days tracker', 'residency', 'rastreo país', 'suivi pays', '国別追跡', '국가 추적', 'отслеживание стран'],
  'gps-monitor': ['gps monitor', 'gps tracker', 'auto location tracking', 'gps day count'],
  visas: ['visa manager', 'visa tracker', 'my visas', 'vize', 'visto', 'виза', '비자', 'वीज़ा', 'تأشيرة'],
  'visa-immigration': ['immigration', 'vfs global', 'passport office', 'passeport', 'pasaporte', 'パスポート'],
  'visa-assistance': ['visa help', 'visa application', 'visa assistance'],
  etias: ['etias', 'eu authorization', 'european entry', 'schengen authorization'],
  ees: ['ees', 'entry exit system', 'border biometrics', 'schengen border'],
  'visa-matcher': ['nomad visa matcher', 'best nomad visa', 'digital nomad visa'],
  'vaccination-hub': ['vaccinations', 'vaccines', 'medicines', 'shots', 'jabs', 'yellow fever', 'who', 'vacuna', 'vaccin', 'impfung', 'ワクチン', '백신', 'вакцина'],
  vault: ['document vault', 'documents', 'passport storage', 'document safe', 'documentos', 'مستندات', '文書', '문서'],
  'gov-apps': ['government apps', 'official apps'],
  'tax-wealthy': ['wealth management', 'tax planning', 'wealth advice'],
  'tax-law-verifier': ['tax law', 'tax law verifier', 'verify tax law'],
  'document-auto-fill': ['auto fill', 'auto fill documents', 'form filler', 'document autofill'],

  // ─── Finance ──────────────────────────────────────────────────────
  'payment-options': ['payments', 'wallet', 'ai wallet', 'agentic commerce', 'x402', 'pago', 'paiement', '支払い', '결제', 'оплата', 'الدفع', 'भुगतान', 'ödeme'],
  'award-cards': ['loyalty', 'reward cards', 'frequent flyer', 'miles', 'points', 'tarjetas premio', '리워드', 'مكافآت'],
  'digital-banks': ['neobank', 'digital bank', 'online bank', 'fintech bank', 'revolut', 'wise'],
  'money-transfers': ['send money', 'wire transfer', 'remittance', 'transfer money', 'remesas'],
  'crypto-cash': ['crypto', 'bitcoin', 'btc', 'ethereum', 'eth', 'stablecoin', 'usdc', 'web3', 'blockchain'],
  'currency-converter': ['fx', 'forex', 'exchange rate', 'cambio', 'change', '為替', '환율', 'курс', 'سعر الصرف'],
  'emergency-cards': ['lost card', 'stolen card', 'block card', 'freeze card', 'card replacement'],

  // ─── Travel ───────────────────────────────────────────────────────
  'public-transport': ['metro', 'bus', 'train', 'subway', 'tram', 'transit', 'transporte público', 'métro', 'u-bahn', '地下鉄', '지하철', 'метро'],
  taxis: ['uber', 'bolt', 'grab', 'lyft', 'cab', 'taxi', 'rideshare', 'ride hailing', 'rideshare app'],
  'car-rent-lease': ['rent a car', 'car rental', 'hire car', 'lease car', 'alquiler coche', 'location voiture'],
  'air-charter': ['private jet', 'charter jet', 'jet charter', 'private flight', 'netjets', 'vistajet'],
  esim: ['esim', 'mobile data', 'data plan', 'roaming', 'airalo', 'holafly'],
  'vpn-email': ['vpn', 'secure email', 'protonmail', 'proton vpn', 'nordvpn', 'mullvad'],
  'travel-insurance': ['insurance', 'travel cover', 'medical coverage', 'safetywing', 'world nomads', 'genki'],
  roadside: ['roadside assistance', 'tow truck', 'breakdown'],
  'wifi-finder': ['wifi', 'wi-fi', 'hotspot', 'free wifi', 'internet'],
  'travel-inbox': ['travel inbox', 'flight emails', 'booking inbox', 'gmail import', 'outlook import'],
  'jet-lag': ['jet lag', 'jetlag', 'circadian', 'time zone recovery'],

  // ─── Local Living ─────────────────────────────────────────────────
  'global-city-services': ['city services', 'local city info', 'city guide'],
  'weather-service': ['weather', 'forecast', 'temperature', 'rain', 'clima', 'météo', 'wetter', '天気', '날씨', 'погода', 'طقس', 'मौसम', 'hava'],
  wellness: ['gym', 'yoga', 'spa', 'sauna', 'massage', 'fitness', 'wellbeing', 'meditation', 'pilates', 'crossfit'],
  'language-learning': ['language', 'learn language', 'language class', 'tutor', 'duolingo', 'italki'],
  'local-nomads': ['local nomads', 'nearby nomads', 'meet nomads'],
  'explore-local': ['events', 'activities', 'festivals', 'concerts', 'things to do', 'eventos', 'évènements', '이벤트', '活动'],
  'family-services': ['nanny', 'babysitter', 'childcare', 'school for kids', 'au pair', 'daycare'],
  'pet-services': ['pet', 'dog', 'cat', 'vet', 'veterinarian', 'pet sitter', 'pet relocation'],
  'moving-services': ['moving', 'relocation', 'movers', 'shipping', 'mudanza', 'déménagement', 'umzug'],
  'delivery-services': ['delivery', 'food delivery', 'package delivery', 'courier'],
  marketplace: ['buy sell', 'marketplace', 'classifieds', 'second hand', 'used goods', 'mercado'],
  'social-chat': ['social', 'vibe', 'social network', 'meet people', 'dating'],
  'nomad-chat': ['pulse', 'nomad community', 'community chat', 'nomad pulse'],
  news: ['news', 'headlines', 'noticias', 'nouvelles', 'nachrichten', 'ニュース', '뉴스', 'новости', 'أخبار'],
  'local-services': ['local services', 'service providers', 'handyman'],
  'local-news': ['local news', 'city news'],
  students: ['students', 'student services', 'study abroad', 'university'],
  'super-offers': ['offers', 'deals', 'discounts', 'promotions', 'super offers'],
  'my-travel-awards': ['my awards', 'achievements', 'travel awards'],

  // ─── Safety ───────────────────────────────────────────────────────
  threats: ['threats', 'safety alerts', 'danger', 'security alerts', 'travel warning', 'risk'],
  guardian: ['guardian', 'supernomad guardian', 'personal safety', 'black box', 'safety ai'],
  emergency: ['emergency', 'sos', 'help', '911', '112', 'urgencia', 'urgence', 'notfall', '緊急', '긴급', 'экстренно'],
  embassy: ['embassy', 'consulate', 'diplomatic', 'embajada', 'ambassade', 'botschaft', '大使館', '대사관', 'посольство', 'سفارة', 'दूतावास'],
  'sos-services': ['sos services', '24/7 sos', 'emergency response'],
  'private-protection': ['bodyguard', 'private security', 'close protection', 'personal security'],
  'cyber-helpline': ['cyber', 'hacked', 'phishing', 'scam', 'fraud', 'cyber security'],

  // ─── Premium / AI ─────────────────────────────────────────────────
  'ai-doctor': ['doctor', 'medical', 'health advisor', 'symptoms', 'sick', 'illness', 'médico', 'arzt', '医者', '의사', 'врач', 'طبيب'],
  'ai-lawyer': ['lawyer', 'legal advisor', 'attorney', 'legal advice', 'abogado', 'avocat', 'anwalt', '弁護士', '변호사', 'юрист', 'محامي', 'वकील'],
  'ai-planner': ['travel planner', 'trip planner', 'itinerary', 'plan trip', 'planner'],
  'tax-advisors': ['tax advisor', 'tax consultant', 'tax expert', 'tax help'],
  'medical-services': ['hospital', 'clinic', 'doctor near me', 'medical services'],
  'travel-lawyers': ['travel lawyer', 'legal services', 'travel legal'],
  'business-centers': ['coworking', 'business center', 'office', 'meeting room', 'wework', 'regus'],
  'remote-offices': ['remote office', 'remote work space', 'private office'],
  'airport-lounges': ['lounge', 'airport lounge', 'priority pass', 'vip lounge'],
  'private-clubs': ['private club', 'members club', 'elite club', 'soho house'],
  'location-tracking': ['location tracking', 'gps tracking', 'find me'],
  integrations: ['integrations', 'connected apps', 'connectors', 'third party'],
  'lifestyle-hub': ['lifestyle', 'spotify', 'oura', 'garmin', 'strava', 'whoop', 'fitness data'],
  'venture-invest': ['venture', 'investing', 'investments', 'real estate', 'startups'],
  'trust-pass': ['trust pass', 'verified credentials', 'walt id', 'verifiable credential'],
  'sovereign-access': ['sovereign access', 'permissions', 'data permissions', 'access control'],
};
