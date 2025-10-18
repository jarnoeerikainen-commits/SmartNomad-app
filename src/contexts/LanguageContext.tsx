import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  languages: Language[];
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': 'Your Digital Assistant for Global Living',
    'header.profile': 'Profile',
    'header.profile_settings': 'Profile Settings',
    'header.app_settings': 'App Settings',
    'header.upgrade_plan': 'Upgrade Plan',
    'header.privacy_data': 'Privacy & Data',
    'header.sign_out': 'Sign Out',
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Travel Tracking',
    'nav.tax': 'Tax Residency',
    'nav.visas': 'Visa Manager',
    'nav.documents': 'Documents',
    'nav.health': 'Health & Vaccines',
    'nav.news': 'Travel News',
    'nav.alerts': 'Smart Alerts',
    'nav.services': 'Travel Services',
    'nav.settings': 'Settings',
    'nav.help': 'Help & Support',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Stay compliant worldwide',
    
    // Dashboard Stats
    'stats.countries_tracked': 'Countries Tracked',
    'stats.active_destinations': 'Active destinations',
    'stats.critical_alerts': 'Critical Alerts',
    'stats.require_attention': 'Require attention',
    
    // Quick Actions
    'quick.title': 'Quick Actions',
    'quick.add_country': 'Add Country',
    'quick.add_country_desc': 'Track a new destination',
    'quick.upload_documents': 'Upload Documents',
    'quick.upload_documents_desc': 'Add passport & visas',
    'quick.check_visas': 'Check Visas',
    'quick.check_visas_desc': 'View visa status',
    'quick.view_alerts': 'View Alerts',
    'quick.view_alerts_desc': 'Check notifications',
    'quick.ai_doctor': 'AI Travel Doctor',
    'quick.ai_doctor_desc': 'Health advice & vaccines',
    'quick.ai_lawyer': 'AI Travel Lawyer',
    'quick.ai_lawyer_desc': 'Legal guidance',
    'quick.ai_visa_helper': 'AI Visa Helper',
    'quick.ai_visa_helper_desc': 'Visa requirements',
    'quick.ai_restaurant': 'AI Restaurant Booking',
    'quick.ai_restaurant_desc': 'Find & book nearby',
    'quick.esim': 'eSIM Services',
    'quick.esim_desc': 'Stay connected worldwide',
    'quick.embassy': 'Embassy Directory',
    'quick.embassy_desc': 'Official contacts',
    
    // Embassy Directory
    'embassy.title': 'Embassy Directory',
    'embassy.description': 'Access official embassy websites and travel advisories from major countries',
    'embassy.visit_website': 'Visit Website',
    'embassy.travel_advice': 'Travel Advice',
    'embassy.register': 'Register Travel',
    'embassy.tip': 'Tip: Register your travel with your embassy for emergency assistance and safety updates',
    
    // AI Assistant
    'ai.title': 'AI Travel Assistant',
    'ai.typing': 'AI is typing...',
    
    // Document Tracker
    'doc.title': 'Document Tracker',
    'doc.passports': 'Passports',
    'doc.licenses': 'Licenses',
    
    // Expense Tracker
    'expense.title': 'Business Expense Tracker',
    
    // Smart Alerts
    'alerts.title': 'Smart Alerts & Notifications',
    'alerts.settings': 'Settings',
    
    // Passport Manager
    'passport.title': 'Passport Manager',
    
    // User Profile
    'profile.title': 'User Profile & Preferences',
    
    // Tax Residency
    'tax.title': 'Tax Residency & Compliance Center',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
  },
  es: {
    // Header
    'app.title': 'TravelTracker',
    'app.tagline': 'Tu compañero global de viajes',
    'header.profile': 'Perfil',
    'header.profile_settings': 'Configuración del perfil',
    'header.app_settings': 'Configuración de la aplicación',
    'header.upgrade_plan': 'Actualizar plan',
    'header.privacy_data': 'Privacidad y datos',
    'header.sign_out': 'Cerrar sesión',
    'nav.dashboard': 'Panel',
    'nav.tracking': 'Seguimiento de viajes',
    'nav.tax': 'Residencia fiscal',
    'nav.visas': 'Gestor de visas',
    'nav.documents': 'Documentos',
    'nav.health': 'Salud y vacunas',
    'nav.news': 'Noticias de viajes',
    'nav.alerts': 'Alertas inteligentes',
    'nav.services': 'Servicios de viaje',
    'nav.settings': 'Configuración',
    'nav.help': 'Ayuda y soporte',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Mantente conforme en todo el mundo',
    
    // Dashboard Stats
    'stats.countries_tracked': 'Países rastreados',
    'stats.active_destinations': 'Destinos activos',
    'stats.critical_alerts': 'Alertas críticas',
    'stats.require_attention': 'Requieren atención',
    
    // Quick Actions
    'quick.title': 'Acciones rápidas',
    'quick.add_country': 'Agregar País',
    'quick.add_country_desc': 'Rastrear nuevo destino',
    'quick.upload_documents': 'Subir Documentos',
    'quick.upload_documents_desc': 'Añadir pasaporte y visas',
    'quick.check_visas': 'Verificar Visas',
    'quick.check_visas_desc': 'Ver estado de visa',
    'quick.view_alerts': 'Ver Alertas',
    'quick.view_alerts_desc': 'Revisar notificaciones',
    'quick.ai_doctor': 'Doctor de Viaje IA',
    'quick.ai_doctor_desc': 'Consejos de salud y vacunas',
    'quick.ai_lawyer': 'Abogado de Viaje IA',
    'quick.ai_lawyer_desc': 'Orientación legal',
    'quick.ai_visa_helper': 'Asistente de Visa IA',
    'quick.ai_visa_helper_desc': 'Requisitos de visa',
    'quick.ai_restaurant': 'Reserva de Restaurante IA',
    'quick.ai_restaurant_desc': 'Buscar y reservar cerca',
    'quick.esim': 'Servicios eSIM',
    'quick.esim_desc': 'Conéctate en todo el mundo',
    'quick.embassy': 'Directorio de Embajadas',
    'quick.embassy_desc': 'Contactos oficiales',
    
    // Embassy Directory
    'embassy.title': 'Directorio de Embajadas',
    'embassy.description': 'Acceda a sitios web oficiales de embajadas y avisos de viaje de países principales',
    'embassy.visit_website': 'Visitar Sitio Web',
    'embassy.travel_advice': 'Consejos de Viaje',
    'embassy.register': 'Registrar Viaje',
    'embassy.tip': 'Consejo: Registre su viaje con su embajada para asistencia de emergencia y actualizaciones de seguridad',
    
    // AI Assistant
    'ai.title': 'Asistente de viaje IA',
    'ai.typing': 'IA está escribiendo...',
    
    // Document Tracker
    'doc.title': 'Rastreador de documentos',
    'doc.passports': 'Pasaportes',
    'doc.licenses': 'Licencias',
    
    // Expense Tracker
    'expense.title': 'Rastreador de gastos empresariales',
    
    // Smart Alerts
    'alerts.title': 'Alertas inteligentes y notificaciones',
    'alerts.settings': 'Configuración',
    
    // Passport Manager
    'passport.title': 'Gestor de pasaportes',
    
    // User Profile
    'profile.title': 'Perfil de usuario y preferencias',
    
    // Tax Residency
    'tax.title': 'Centro de residencia fiscal y cumplimiento',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
  },
  pt: {
    // Header
    'app.title': 'TravelTracker',
    'app.tagline': 'Seu companheiro global de viagens',
    'header.profile': 'Perfil',
    'header.profile_settings': 'Configurações do perfil',
    'header.app_settings': 'Configurações do aplicativo',
    'header.upgrade_plan': 'Atualizar plano',
    'header.privacy_data': 'Privacidade e dados',
    'header.sign_out': 'Sair',
    'nav.dashboard': 'Painel',
    'nav.tracking': 'Rastreamento de viagens',
    'nav.tax': 'Residência fiscal',
    'nav.visas': 'Gerenciador de vistos',
    'nav.documents': 'Documentos',
    'nav.health': 'Saúde e vacinas',
    'nav.news': 'Notícias de viagens',
    'nav.alerts': 'Alertas inteligentes',
    'nav.services': 'Serviços de viagem',
    'nav.settings': 'Configurações',
    'nav.help': 'Ajuda e suporte',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Mantenha-se conforme em todo o mundo',
    
    // Dashboard Stats
    'stats.countries_tracked': 'Países rastreados',
    'stats.active_destinations': 'Destinos ativos',
    'stats.critical_alerts': 'Alertas críticos',
    'stats.require_attention': 'Requerem atenção',
    
    // Quick Actions
    'quick.title': 'Ações rápidas',
    'quick.add_country': 'Adicionar País',
    'quick.add_country_desc': 'Rastrear novo destino',
    'quick.upload_documents': 'Enviar Documentos',
    'quick.upload_documents_desc': 'Adicionar passaporte e vistos',
    'quick.check_visas': 'Verificar Vistos',
    'quick.check_visas_desc': 'Ver status do visto',
    'quick.view_alerts': 'Ver Alertas',
    'quick.view_alerts_desc': 'Verificar notificações',
    'quick.ai_doctor': 'Médico de Viagem IA',
    'quick.ai_doctor_desc': 'Conselhos de saúde e vacinas',
    'quick.ai_lawyer': 'Advogado de Viagem IA',
    'quick.ai_lawyer_desc': 'Orientação jurídica',
    'quick.ai_visa_helper': 'Assistente de Visto IA',
    'quick.ai_visa_helper_desc': 'Requisitos de visto',
    'quick.ai_restaurant': 'Reserva de Restaurante IA',
    'quick.ai_restaurant_desc': 'Encontrar e reservar perto',
    'quick.esim': 'Serviços eSIM',
    'quick.esim_desc': 'Conecte-se em todo o mundo',
    'quick.embassy': 'Diretório de Embaixadas',
    'quick.embassy_desc': 'Contatos oficiais',
    
    // Embassy Directory
    'embassy.title': 'Diretório de Embaixadas',
    'embassy.description': 'Acesse sites oficiais de embaixadas e avisos de viagem de países principais',
    'embassy.visit_website': 'Visitar Site',
    'embassy.travel_advice': 'Conselhos de Viagem',
    'embassy.register': 'Registrar Viagem',
    'embassy.tip': 'Dica: Registre sua viagem com sua embaixada para assistência de emergência e atualizações de segurança',
    
    // AI Assistant
    'ai.title': 'Assistente de viagem IA',
    'ai.typing': 'IA está digitando...',
    
    // Document Tracker
    'doc.title': 'Rastreador de documentos',
    'doc.passports': 'Passaportes',
    'doc.licenses': 'Licenças',
    
    // Expense Tracker
    'expense.title': 'Rastreador de despesas empresariais',
    
    // Smart Alerts
    'alerts.title': 'Alertas inteligentes e notificações',
    'alerts.settings': 'Configurações',
    
    // Passport Manager
    'passport.title': 'Gerenciador de passaportes',
    
    // User Profile
    'profile.title': 'Perfil de usuário e preferências',
    
    // Tax Residency
    'tax.title': 'Centro de residência fiscal e conformidade',
    
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.close': 'Fechar',
  },
  hi: {
    // Header
    'app.title': 'TravelTracker',
    'app.tagline': 'आपका वैश्विक यात्रा साथी',
    'header.profile': 'प्रोफ़ाइल',
    'header.profile_settings': 'प्रोफ़ाइल सेटिंग्स',
    'header.app_settings': 'ऐप सेटिंग्स',
    'header.upgrade_plan': 'प्लान अपग्रेड करें',
    'header.privacy_data': 'गोपनीयता और डेटा',
    'header.sign_out': 'साइन आउट',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.tracking': 'यात्रा ट्रैकिंग',
    'nav.tax': 'कर निवास',
    'nav.visas': 'वीज़ा प्रबंधक',
    'nav.documents': 'दस्तावेज़',
    'nav.health': 'स्वास्थ्य और टीके',
    'nav.news': 'यात्रा समाचार',
    'nav.alerts': 'स्मार्ट अलर्ट',
    'nav.services': 'यात्रा सेवाएं',
    'nav.settings': 'सेटिंग्स',
    'nav.help': 'सहायता और समर्थन',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'दुनिया भर में अनुपालन बनाए रखें',
    
    // Dashboard Stats
    'stats.countries_tracked': 'ट्रैक किए गए देश',
    'stats.active_destinations': 'सक्रिय गंतव्य',
    'stats.critical_alerts': 'गंभीर अलर्ट',
    'stats.require_attention': 'ध्यान देने की आवश्यकता',
    
    // Quick Actions
    'quick.title': 'त्वरित क्रियाएं',
    'quick.add_country': 'देश जोड़ें',
    'quick.add_country_desc': 'नया गंतव्य ट्रैक करें',
    'quick.upload_documents': 'दस्तावेज़ अपलोड करें',
    'quick.upload_documents_desc': 'पासपोर्ट और वीज़ा जोड़ें',
    'quick.check_visas': 'वीज़ा जांचें',
    'quick.check_visas_desc': 'वीज़ा स्थिति देखें',
    'quick.view_alerts': 'अलर्ट देखें',
    'quick.view_alerts_desc': 'सूचनाएं जांचें',
    'quick.ai_doctor': 'एआई यात्रा डॉक्टर',
    'quick.ai_doctor_desc': 'स्वास्थ्य सलाह और टीके',
    'quick.ai_lawyer': 'एआई यात्रा वकील',
    'quick.ai_lawyer_desc': 'कानूनी मार्गदर्शन',
    'quick.ai_visa_helper': 'एआई वीज़ा सहायक',
    'quick.ai_visa_helper_desc': 'वीज़ा आवश्यकताएं',
    'quick.ai_restaurant': 'एआई रेस्तरां बुकिंग',
    'quick.ai_restaurant_desc': 'पास में खोजें और बुक करें',
    'quick.esim': 'eSIM सेवाएं',
    'quick.esim_desc': 'दुनिया भर में जुड़े रहें',
    'quick.embassy': 'दूतावास निर्देशिका',
    'quick.embassy_desc': 'आधिकारिक संपर्क',
    
    // Embassy Directory
    'embassy.title': 'दूतावास निर्देशिका',
    'embassy.description': 'प्रमुख देशों से आधिकारिक दूतावास वेबसाइट और यात्रा सलाह तक पहुंचें',
    'embassy.visit_website': 'वेबसाइट देखें',
    'embassy.travel_advice': 'यात्रा सलाह',
    'embassy.register': 'यात्रा पंजीकृत करें',
    'embassy.tip': 'सुझाव: आपातकालीन सहायता और सुरक्षा अपडेट के लिए अपनी यात्रा को अपने दूतावास के साथ पंजीकृत करें',
    
    // AI Assistant
    'ai.title': 'एआई यात्रा सहायक',
    'ai.typing': 'एआई टाइप कर रहा है...',
    
    // Document Tracker
    'doc.title': 'दस्तावेज़ ट्रैकर',
    'doc.passports': 'पासपोर्ट',
    'doc.licenses': 'लाइसेंस',
    
    // Expense Tracker
    'expense.title': 'व्यावसायिक व्यय ट्रैकर',
    
    // Smart Alerts
    'alerts.title': 'स्मार्ट अलर्ट और सूचनाएं',
    'alerts.settings': 'सेटिंग्स',
    
    // Passport Manager
    'passport.title': 'पासपोर्ट प्रबंधक',
    
    // User Profile
    'profile.title': 'उपयोगकर्ता प्रोफ़ाइल और प्राथमिकताएं',
    
    // Tax Residency
    'tax.title': 'कर निवास और अनुपालन केंद्र',
    
    // Common
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
  },
  sw: {
    // Header
    'app.title': 'TravelTracker',
    'app.tagline': 'Mwenzi wako wa kimataifa wa kusafiri',
    'header.profile': 'Wasifu',
    'header.profile_settings': 'Mipangilio ya Wasifu',
    'header.app_settings': 'Mipangilio ya Programu',
    'header.upgrade_plan': 'Boresha Mpango',
    'header.privacy_data': 'Faragha na Data',
    'header.sign_out': 'Toka',
    'nav.dashboard': 'Dashibodi',
    'nav.tracking': 'Ufuatiliaji wa Safari',
    'nav.tax': 'Makazi ya Kodi',
    'nav.visas': 'Meneja wa Visa',
    'nav.documents': 'Hati',
    'nav.health': 'Afya na Chanjo',
    'nav.news': 'Habari za Safari',
    'nav.alerts': 'Arifa za Akili',
    'nav.services': 'Huduma za Safari',
    'nav.settings': 'Mipangilio',
    'nav.help': 'Msaada na Usaidizi',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Endelea kuwa na ufuasi ulimwenguni',
    
    // Dashboard Stats
    'stats.countries_tracked': 'Nchi Zinazofuatiliwa',
    'stats.active_destinations': 'Maeneo yanayotumika',
    'stats.critical_alerts': 'Arifa Muhimu',
    'stats.require_attention': 'Inahitaji umakini',
    
    // Quick Actions
    'quick.title': 'Vitendo vya Haraka',
    'quick.add_country': 'Ongeza Nchi',
    'quick.add_country_desc': 'Fuatilia mahali mpya',
    'quick.upload_documents': 'Pakia Hati',
    'quick.upload_documents_desc': 'Ongeza pasipoti na viza',
    'quick.check_visas': 'Angalia Viza',
    'quick.check_visas_desc': 'Tazama hali ya viza',
    'quick.view_alerts': 'Tazama Arifa',
    'quick.view_alerts_desc': 'Angalia taarifa',
    'quick.ai_doctor': 'Daktari wa Usafiri wa AI',
    'quick.ai_doctor_desc': 'Ushauri wa afya na chanjo',
    'quick.ai_lawyer': 'Wakili wa Usafiri wa AI',
    'quick.ai_lawyer_desc': 'Mwongozo wa kisheria',
    'quick.ai_visa_helper': 'Msaidizi wa Viza wa AI',
    'quick.ai_visa_helper_desc': 'Mahitaji ya viza',
    'quick.ai_restaurant': 'Uhifadhi wa Mkahawa wa AI',
    'quick.ai_restaurant_desc': 'Tafuta na uhifadhi karibu',
    'quick.esim': 'Huduma za eSIM',
    'quick.esim_desc': 'Endelea kuunganishwa ulimwenguni',
    'quick.embassy': 'Saraka za Ubalozi',
    'quick.embassy_desc': 'Mawasiliano rasmi',
    
    // Embassy Directory
    'embassy.title': 'Saraka za Ubalozi',
    'embassy.description': 'Fikia tovuti rasmi za ubalozi na ushauri wa safari kutoka nchi kuu',
    'embassy.visit_website': 'Tembelea Tovuti',
    'embassy.travel_advice': 'Ushauri wa Safari',
    'embassy.register': 'Sajili Safari',
    'embassy.tip': 'Kidokezo: Sajili safari yako na ubalozi wako kwa msaada wa dharura na masasisho ya usalama',
    
    // AI Assistant
    'ai.title': 'Msaidizi wa Safari wa AI',
    'ai.typing': 'AI inaandika...',
    
    // Document Tracker
    'doc.title': 'Kifuatiliaji cha Hati',
    'doc.passports': 'Pasi',
    'doc.licenses': 'Leseni',
    
    // Expense Tracker
    'expense.title': 'Kifuatiliaji cha Gharama za Biashara',
    
    // Smart Alerts
    'alerts.title': 'Arifa za Akili na Taarifa',
    'alerts.settings': 'Mipangilio',
    
    // Passport Manager
    'passport.title': 'Meneja wa Pasi',
    
    // User Profile
    'profile.title': 'Wasifu wa Mtumiaji na Mapendeleo',
    
    // Tax Residency
    'tax.title': 'Kituo cha Makazi ya Kodi na Kufuata Sheria',
    
    // Common
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.close': 'Funga',
  },
  af: {
    // App Header & Navigation
    'app.title': 'TravelTracker',
    'app.tagline': 'Jou globale reisgenoot',
    'header.profile': 'Profiel',
    'header.profile_settings': 'Profiel Instellings',
    'header.app_settings': 'App Instellings',
    'header.upgrade_plan': 'Opgradeer Plan',
    'header.privacy_data': 'Privaatheid & Data',
    'header.sign_out': 'Teken Uit',
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Reis Opvolging',
    'nav.tax': 'Belasting Residensie',
    'nav.visas': 'Visum Bestuurder',
    'nav.documents': 'Dokumente',
    'nav.health': 'Gesondheid & Inentings',
    'nav.news': 'Reis Nuus',
    'nav.alerts': 'Slim Kennisgewings',
    'nav.services': 'Reis Dienste',
    'nav.settings': 'Instellings',
    'nav.help': 'Hulp & Ondersteuning',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Bly voldoende wêreldwyd',
    
    // Dashboard Stats
    'stats.countries_tracked': 'Lande Opgevolg',
    'stats.active_destinations': 'Aktiewe bestemmings',
    'stats.critical_alerts': 'Kritieke Kennisgewings',
    'stats.require_attention': 'Vereis aandag',
    
    // Quick Actions
    'quick.title': 'Vinnige Aksies',
    'quick.add_country': 'Voeg Land By',
    'quick.add_country_desc': 'Volg nuwe bestemming',
    'quick.upload_documents': 'Laai Dokumente Op',
    'quick.upload_documents_desc': 'Voeg paspoort en visums by',
    'quick.check_visas': 'Kontroleer Visums',
    'quick.check_visas_desc': 'Bekyk visum status',
    'quick.view_alerts': 'Bekyk Kennisgewings',
    'quick.view_alerts_desc': 'Kontroleer kennisgewings',
    'quick.ai_doctor': 'KI Reisdokter',
    'quick.ai_doctor_desc': 'Gesondheidsadvies en inentings',
    'quick.ai_lawyer': 'KI Reisadvokaat',
    'quick.ai_lawyer_desc': 'Wetlike leiding',
    'quick.ai_visa_helper': 'KI Visum Assistent',
    'quick.ai_visa_helper_desc': 'Visum vereistes',
    'quick.ai_restaurant': 'KI Restaurant Bespreking',
    'quick.ai_restaurant_desc': 'Vind en bespreek naby',
    'quick.esim': 'eSIM Dienste',
    'quick.esim_desc': 'Bly wêreldwyd verbind',
    'quick.embassy': 'Ambassade Gids',
    'quick.embassy_desc': 'Amptelike kontakte',
    
    // Embassy Directory
    'embassy.title': 'Ambassade Gids',
    'embassy.description': 'Toegang tot amptelike ambassade webwerwe en reisadvies van groot lande',
    'embassy.visit_website': 'Besoek Webwerf',
    'embassy.travel_advice': 'Reisadvies',
    'embassy.register': 'Registreer Reis',
    'embassy.tip': 'Wenk: Registreer u reis by u ambassade vir noodhulp en veiligheidsopdaterings',
    
    // AI Assistant
    'ai.title': 'KI Reis Assistent',
    'ai.typing': 'KI is besig om te tik...',
    
    // Document Tracker
    'doc.title': 'Dokument Volger',
    'doc.passports': 'Paspoort',
    'doc.licenses': 'Lisensies',
    
    // Expense Tracker
    'expense.title': 'Besigheid Uitgawe Volger',
    
    // Smart Alerts
    'alerts.title': 'Slim Kennisgewings & Kennisgewings',
    'alerts.settings': 'Instellings',
    
    // Passport Manager
    'passport.title': 'Paspoort Bestuurder',
    
    // User Profile
    'profile.title': 'Gebruiker Profiel & Voorkeure',
    
    // Tax Residency
    'tax.title': 'Belasting Residensie & Voldoenings Sentrum',
    
    // Common
    'common.save': 'Stoor',
    'common.cancel': 'Kanselleer',
    'common.close': 'Sluit',
  },
  zh: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': '您的全球生活数字助手',
    'header.profile': '个人资料',
    'header.profile_settings': '个人资料设置',
    'header.app_settings': '应用设置',
    'header.upgrade_plan': '升级计划',
    'header.privacy_data': '隐私和数据',
    'header.sign_out': '登出',
    'nav.dashboard': '仪表板',
    'nav.tracking': '旅行追踪',
    'nav.tax': '税务居住',
    'nav.visas': '签证管理',
    'nav.documents': '文件',
    'nav.health': '健康与疫苗',
    'nav.news': '旅行新闻',
    'nav.alerts': '智能提醒',
    'nav.services': '旅行服务',
    'nav.settings': '设置',
    'nav.help': '帮助与支持',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': '全球合规',
    'stats.countries_tracked': '追踪国家',
    'stats.active_destinations': '活跃目的地',
    'stats.critical_alerts': '重要提醒',
    'stats.require_attention': '需要注意',
    'quick.title': '快速操作',
    'quick.add_country': '添加国家',
    'quick.add_country_desc': '追踪新目的地',
    'quick.upload_documents': '上传文件',
    'quick.upload_documents_desc': '添加护照和签证',
    'quick.check_visas': '检查签证',
    'quick.check_visas_desc': '查看签证状态',
    'quick.view_alerts': '查看提醒',
    'quick.view_alerts_desc': '检查通知',
    'quick.ai_doctor': 'AI旅行医生',
    'quick.ai_doctor_desc': '健康建议和疫苗',
    'quick.ai_lawyer': 'AI旅行律师',
    'quick.ai_lawyer_desc': '法律指导',
    'quick.ai_visa_helper': 'AI签证助手',
    'quick.ai_visa_helper_desc': '签证要求',
    'quick.ai_restaurant': 'AI餐厅预订',
    'quick.ai_restaurant_desc': '查找和预订附近餐厅',
    'quick.esim': 'eSIM服务',
    'quick.esim_desc': '全球保持连接',
    'quick.embassy': '大使馆目录',
    'quick.embassy_desc': '官方联系方式',
    'embassy.title': '大使馆目录',
    'embassy.description': '访问主要国家的官方大使馆网站和旅行建议',
    'embassy.visit_website': '访问网站',
    'embassy.travel_advice': '旅行建议',
    'embassy.register': '登记旅行',
    'embassy.tip': '提示：在大使馆登记您的旅行以获得紧急援助和安全更新',
    'ai.title': 'AI旅行助手',
    'ai.typing': 'AI正在输入...',
    'doc.title': '文件追踪',
    'doc.passports': '护照',
    'doc.licenses': '驾照',
    'expense.title': '商务费用追踪',
    'alerts.title': '智能提醒和通知',
    'alerts.settings': '设置',
    'passport.title': '护照管理',
    'profile.title': '用户资料和偏好',
    'tax.title': '税务居住和合规中心',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.close': '关闭',
  },
  fr: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': 'Votre assistant numérique pour la vie mondiale',
    'header.profile': 'Profil',
    'header.profile_settings': 'Paramètres du profil',
    'header.app_settings': "Paramètres de l'application",
    'header.upgrade_plan': 'Mettre à niveau',
    'header.privacy_data': 'Confidentialité et données',
    'header.sign_out': 'Se déconnecter',
    'nav.dashboard': 'Tableau de bord',
    'nav.tracking': 'Suivi des voyages',
    'nav.tax': 'Résidence fiscale',
    'nav.visas': 'Gestionnaire de visas',
    'nav.documents': 'Documents',
    'nav.health': 'Santé et vaccins',
    'nav.news': 'Actualités voyage',
    'nav.alerts': 'Alertes intelligentes',
    'nav.services': 'Services de voyage',
    'nav.settings': 'Paramètres',
    'nav.help': 'Aide et support',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Restez conforme dans le monde entier',
    'stats.countries_tracked': 'Pays suivis',
    'stats.active_destinations': 'Destinations actives',
    'stats.critical_alerts': 'Alertes critiques',
    'stats.require_attention': 'Nécessitent une attention',
    'quick.title': 'Actions rapides',
    'quick.add_country': 'Ajouter un pays',
    'quick.add_country_desc': 'Suivre une nouvelle destination',
    'quick.upload_documents': 'Télécharger des documents',
    'quick.upload_documents_desc': 'Ajouter passeport et visas',
    'quick.check_visas': 'Vérifier les visas',
    'quick.check_visas_desc': 'Voir le statut des visas',
    'quick.view_alerts': 'Voir les alertes',
    'quick.view_alerts_desc': 'Vérifier les notifications',
    'quick.ai_doctor': 'Médecin de voyage IA',
    'quick.ai_doctor_desc': 'Conseils santé et vaccins',
    'quick.ai_lawyer': 'Avocat de voyage IA',
    'quick.ai_lawyer_desc': 'Conseils juridiques',
    'quick.ai_visa_helper': 'Assistant visa IA',
    'quick.ai_visa_helper_desc': 'Exigences de visa',
    'quick.ai_restaurant': 'Réservation restaurant IA',
    'quick.ai_restaurant_desc': 'Trouver et réserver à proximité',
    'quick.esim': 'Services eSIM',
    'quick.esim_desc': 'Restez connecté dans le monde entier',
    'quick.embassy': 'Annuaire des ambassades',
    'quick.embassy_desc': 'Contacts officiels',
    'embassy.title': 'Annuaire des ambassades',
    'embassy.description': 'Accédez aux sites Web officiels des ambassades et aux conseils aux voyageurs des principaux pays',
    'embassy.visit_website': 'Visiter le site',
    'embassy.travel_advice': 'Conseils de voyage',
    'embassy.register': 'Enregistrer le voyage',
    'embassy.tip': "Conseil : Enregistrez votre voyage auprès de votre ambassade pour une assistance d'urgence et des mises à jour de sécurité",
    'ai.title': 'Assistant de voyage IA',
    'ai.typing': "L'IA est en train d'écrire...",
    'doc.title': 'Suivi des documents',
    'doc.passports': 'Passeports',
    'doc.licenses': 'Permis',
    'expense.title': 'Suivi des dépenses professionnelles',
    'alerts.title': 'Alertes intelligentes et notifications',
    'alerts.settings': 'Paramètres',
    'passport.title': 'Gestionnaire de passeports',
    'profile.title': 'Profil utilisateur et préférences',
    'tax.title': 'Centre de résidence fiscale et de conformité',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
  },
  de: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': 'Ihr digitaler Assistent für das globale Leben',
    'header.profile': 'Profil',
    'header.profile_settings': 'Profileinstellungen',
    'header.app_settings': 'App-Einstellungen',
    'header.upgrade_plan': 'Plan upgraden',
    'header.privacy_data': 'Datenschutz und Daten',
    'header.sign_out': 'Abmelden',
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Reiseverfolgung',
    'nav.tax': 'Steuerlicher Wohnsitz',
    'nav.visas': 'Visa-Manager',
    'nav.documents': 'Dokumente',
    'nav.health': 'Gesundheit und Impfungen',
    'nav.news': 'Reisenachrichten',
    'nav.alerts': 'Intelligente Benachrichtigungen',
    'nav.services': 'Reisedienste',
    'nav.settings': 'Einstellungen',
    'nav.help': 'Hilfe und Support',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Weltweit konform bleiben',
    'stats.countries_tracked': 'Verfolgte Länder',
    'stats.active_destinations': 'Aktive Ziele',
    'stats.critical_alerts': 'Kritische Warnungen',
    'stats.require_attention': 'Erfordern Aufmerksamkeit',
    'quick.title': 'Schnellaktionen',
    'quick.add_country': 'Land hinzufügen',
    'quick.add_country_desc': 'Neues Ziel verfolgen',
    'quick.upload_documents': 'Dokumente hochladen',
    'quick.upload_documents_desc': 'Pass und Visa hinzufügen',
    'quick.check_visas': 'Visa überprüfen',
    'quick.check_visas_desc': 'Visumstatus anzeigen',
    'quick.view_alerts': 'Warnungen anzeigen',
    'quick.view_alerts_desc': 'Benachrichtigungen prüfen',
    'quick.ai_doctor': 'KI-Reisearzt',
    'quick.ai_doctor_desc': 'Gesundheitsberatung und Impfungen',
    'quick.ai_lawyer': 'KI-Reiseanwalt',
    'quick.ai_lawyer_desc': 'Rechtsberatung',
    'quick.ai_visa_helper': 'KI-Visum-Assistent',
    'quick.ai_visa_helper_desc': 'Visumanforderungen',
    'quick.ai_restaurant': 'KI-Restaurantbuchung',
    'quick.ai_restaurant_desc': 'In der Nähe finden und buchen',
    'quick.esim': 'eSIM-Dienste',
    'quick.esim_desc': 'Weltweit verbunden bleiben',
    'quick.embassy': 'Botschaftsverzeichnis',
    'quick.embassy_desc': 'Offizielle Kontakte',
    'embassy.title': 'Botschaftsverzeichnis',
    'embassy.description': 'Zugriff auf offizielle Botschaftswebsites und Reisehinweise wichtiger Länder',
    'embassy.visit_website': 'Website besuchen',
    'embassy.travel_advice': 'Reisehinweise',
    'embassy.register': 'Reise registrieren',
    'embassy.tip': 'Tipp: Registrieren Sie Ihre Reise bei Ihrer Botschaft für Notfallhilfe und Sicherheitsupdates',
    'ai.title': 'KI-Reiseassistent',
    'ai.typing': 'KI tippt...',
    'doc.title': 'Dokumentenverfolgung',
    'doc.passports': 'Reisepässe',
    'doc.licenses': 'Führerscheine',
    'expense.title': 'Geschäftsausgabenverfolgung',
    'alerts.title': 'Intelligente Benachrichtigungen',
    'alerts.settings': 'Einstellungen',
    'passport.title': 'Reisepass-Manager',
    'profile.title': 'Benutzerprofil und Einstellungen',
    'tax.title': 'Steuerlicher Wohnsitz und Compliance-Center',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
  },
  ar: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': 'مساعدك الرقمي للحياة العالمية',
    'header.profile': 'الملف الشخصي',
    'header.profile_settings': 'إعدادات الملف الشخصي',
    'header.app_settings': 'إعدادات التطبيق',
    'header.upgrade_plan': 'ترقية الخطة',
    'header.privacy_data': 'الخصوصية والبيانات',
    'header.sign_out': 'تسجيل الخروج',
    'nav.dashboard': 'لوحة التحكم',
    'nav.tracking': 'تتبع السفر',
    'nav.tax': 'الإقامة الضريبية',
    'nav.visas': 'مدير التأشيرات',
    'nav.documents': 'المستندات',
    'nav.health': 'الصحة واللقاحات',
    'nav.news': 'أخبار السفر',
    'nav.alerts': 'التنبيهات الذكية',
    'nav.services': 'خدمات السفر',
    'nav.settings': 'الإعدادات',
    'nav.help': 'المساعدة والدعم',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'ابقَ ملتزماً في جميع أنحاء العالم',
    'stats.countries_tracked': 'الدول المتتبعة',
    'stats.active_destinations': 'الوجهات النشطة',
    'stats.critical_alerts': 'التنبيهات الحرجة',
    'stats.require_attention': 'تتطلب الانتباه',
    'quick.title': 'إجراءات سريعة',
    'quick.add_country': 'إضافة دولة',
    'quick.add_country_desc': 'تتبع وجهة جديدة',
    'quick.upload_documents': 'تحميل المستندات',
    'quick.upload_documents_desc': 'إضافة جواز السفر والتأشيرات',
    'quick.check_visas': 'التحقق من التأشيرات',
    'quick.check_visas_desc': 'عرض حالة التأشيرة',
    'quick.view_alerts': 'عرض التنبيهات',
    'quick.view_alerts_desc': 'التحقق من الإشعارات',
    'quick.ai_doctor': 'طبيب السفر بالذكاء الاصطناعي',
    'quick.ai_doctor_desc': 'نصائح صحية ولقاحات',
    'quick.ai_lawyer': 'محامي السفر بالذكاء الاصطناعي',
    'quick.ai_lawyer_desc': 'إرشادات قانونية',
    'quick.ai_visa_helper': 'مساعد التأشيرة بالذكاء الاصطناعي',
    'quick.ai_visa_helper_desc': 'متطلبات التأشيرة',
    'quick.ai_restaurant': 'حجز المطاعم بالذكاء الاصطناعي',
    'quick.ai_restaurant_desc': 'البحث والحجز في مكان قريب',
    'quick.esim': 'خدمات eSIM',
    'quick.esim_desc': 'ابقَ متصلاً في جميع أنحاء العالم',
    'quick.embassy': 'دليل السفارات',
    'quick.embassy_desc': 'جهات الاتصال الرسمية',
    'embassy.title': 'دليل السفارات',
    'embassy.description': 'الوصول إلى المواقع الرسمية للسفارات ونصائح السفر من الدول الرئيسية',
    'embassy.visit_website': 'زيارة الموقع',
    'embassy.travel_advice': 'نصائح السفر',
    'embassy.register': 'تسجيل السفر',
    'embassy.tip': 'نصيحة: سجل رحلتك لدى سفارتك للحصول على المساعدة في حالات الطوارئ والتحديثات الأمنية',
    'ai.title': 'مساعد السفر بالذكاء الاصطناعي',
    'ai.typing': 'الذكاء الاصطناعي يكتب...',
    'doc.title': 'تتبع المستندات',
    'doc.passports': 'جوازات السفر',
    'doc.licenses': 'رخص القيادة',
    'expense.title': 'تتبع نفقات الأعمال',
    'alerts.title': 'التنبيهات الذكية والإشعارات',
    'alerts.settings': 'الإعدادات',
    'passport.title': 'مدير جوازات السفر',
    'profile.title': 'ملف المستخدم والتفضيلات',
    'tax.title': 'مركز الإقامة الضريبية والامتثال',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
  },
  ja: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': 'グローバルライフのためのデジタルアシスタント',
    'header.profile': 'プロフィール',
    'header.profile_settings': 'プロフィール設定',
    'header.app_settings': 'アプリ設定',
    'header.upgrade_plan': 'プランをアップグレード',
    'header.privacy_data': 'プライバシーとデータ',
    'header.sign_out': 'サインアウト',
    'nav.dashboard': 'ダッシュボード',
    'nav.tracking': '旅行追跡',
    'nav.tax': '税務居住',
    'nav.visas': 'ビザ管理',
    'nav.documents': '書類',
    'nav.health': '健康とワクチン',
    'nav.news': '旅行ニュース',
    'nav.alerts': 'スマート通知',
    'nav.services': '旅行サービス',
    'nav.settings': '設定',
    'nav.help': 'ヘルプとサポート',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': '世界中でコンプライアンスを維持',
    'stats.countries_tracked': '追跡中の国',
    'stats.active_destinations': 'アクティブな目的地',
    'stats.critical_alerts': '重要な通知',
    'stats.require_attention': '注意が必要',
    'quick.title': 'クイックアクション',
    'quick.add_country': '国を追加',
    'quick.add_country_desc': '新しい目的地を追跡',
    'quick.upload_documents': '書類をアップロード',
    'quick.upload_documents_desc': 'パスポートとビザを追加',
    'quick.check_visas': 'ビザを確認',
    'quick.check_visas_desc': 'ビザステータスを表示',
    'quick.view_alerts': '通知を表示',
    'quick.view_alerts_desc': '通知を確認',
    'quick.ai_doctor': 'AI旅行ドクター',
    'quick.ai_doctor_desc': '健康アドバイスとワクチン',
    'quick.ai_lawyer': 'AI旅行弁護士',
    'quick.ai_lawyer_desc': '法的ガイダンス',
    'quick.ai_visa_helper': 'AIビザヘルパー',
    'quick.ai_visa_helper_desc': 'ビザ要件',
    'quick.ai_restaurant': 'AIレストラン予約',
    'quick.ai_restaurant_desc': '近くを検索して予約',
    'quick.esim': 'eSIMサービス',
    'quick.esim_desc': '世界中で接続を維持',
    'quick.embassy': '大使館ディレクトリ',
    'quick.embassy_desc': '公式連絡先',
    'embassy.title': '大使館ディレクトリ',
    'embassy.description': '主要国の公式大使館ウェブサイトと旅行アドバイスにアクセス',
    'embassy.visit_website': 'ウェブサイトを訪問',
    'embassy.travel_advice': '旅行アドバイス',
    'embassy.register': '旅行を登録',
    'embassy.tip': 'ヒント：緊急支援とセキュリティ更新のために、大使館に旅行を登録してください',
    'ai.title': 'AI旅行アシスタント',
    'ai.typing': 'AIが入力中...',
    'doc.title': '書類追跡',
    'doc.passports': 'パスポート',
    'doc.licenses': '運転免許証',
    'expense.title': 'ビジネス経費追跡',
    'alerts.title': 'スマート通知とお知らせ',
    'alerts.settings': '設定',
    'passport.title': 'パスポートマネージャー',
    'profile.title': 'ユーザープロフィールと設定',
    'tax.title': '税務居住とコンプライアンスセンター',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.close': '閉じる',
  },
  it: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': 'Il tuo assistente digitale per la vita globale',
    'header.profile': 'Profilo',
    'header.profile_settings': 'Impostazioni profilo',
    'header.app_settings': "Impostazioni dell'app",
    'header.upgrade_plan': 'Aggiorna piano',
    'header.privacy_data': 'Privacy e dati',
    'header.sign_out': 'Esci',
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Tracciamento viaggi',
    'nav.tax': 'Residenza fiscale',
    'nav.visas': 'Gestore visti',
    'nav.documents': 'Documenti',
    'nav.health': 'Salute e vaccini',
    'nav.news': 'Notizie di viaggio',
    'nav.alerts': 'Avvisi intelligenti',
    'nav.services': 'Servizi di viaggio',
    'nav.settings': 'Impostazioni',
    'nav.help': 'Aiuto e supporto',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Rimani conforme in tutto il mondo',
    'stats.countries_tracked': 'Paesi tracciati',
    'stats.active_destinations': 'Destinazioni attive',
    'stats.critical_alerts': 'Avvisi critici',
    'stats.require_attention': 'Richiedono attenzione',
    'quick.title': 'Azioni rapide',
    'quick.add_country': 'Aggiungi paese',
    'quick.add_country_desc': 'Traccia nuova destinazione',
    'quick.upload_documents': 'Carica documenti',
    'quick.upload_documents_desc': 'Aggiungi passaporto e visti',
    'quick.check_visas': 'Controlla visti',
    'quick.check_visas_desc': 'Visualizza stato visto',
    'quick.view_alerts': 'Visualizza avvisi',
    'quick.view_alerts_desc': 'Controlla notifiche',
    'quick.ai_doctor': 'Medico di viaggio AI',
    'quick.ai_doctor_desc': 'Consigli sanitari e vaccini',
    'quick.ai_lawyer': 'Avvocato di viaggio AI',
    'quick.ai_lawyer_desc': 'Orientamento legale',
    'quick.ai_visa_helper': 'Assistente visti AI',
    'quick.ai_visa_helper_desc': 'Requisiti visto',
    'quick.ai_restaurant': 'Prenotazione ristoranti AI',
    'quick.ai_restaurant_desc': 'Trova e prenota nelle vicinanze',
    'quick.esim': 'Servizi eSIM',
    'quick.esim_desc': 'Rimani connesso in tutto il mondo',
    'quick.embassy': 'Elenco ambasciate',
    'quick.embassy_desc': 'Contatti ufficiali',
    'embassy.title': 'Elenco ambasciate',
    'embassy.description': 'Accedi ai siti web ufficiali delle ambasciate e ai consigli di viaggio dei principali paesi',
    'embassy.visit_website': 'Visita il sito',
    'embassy.travel_advice': 'Consigli di viaggio',
    'embassy.register': 'Registra viaggio',
    'embassy.tip': 'Suggerimento: Registra il tuo viaggio presso la tua ambasciata per assistenza di emergenza e aggiornamenti sulla sicurezza',
    'ai.title': 'Assistente di viaggio AI',
    'ai.typing': "L'AI sta scrivendo...",
    'doc.title': 'Tracciamento documenti',
    'doc.passports': 'Passaporti',
    'doc.licenses': 'Patenti',
    'expense.title': 'Tracciamento spese aziendali',
    'alerts.title': 'Avvisi intelligenti e notifiche',
    'alerts.settings': 'Impostazioni',
    'passport.title': 'Gestore passaporti',
    'profile.title': 'Profilo utente e preferenze',
    'tax.title': 'Centro di residenza fiscale e conformità',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.close': 'Chiudi',
  },
  ko: {
    // App Header & Navigation
    'app.title': 'SmartNomad',
    'app.tagline': '글로벌 생활을 위한 디지털 어시스턴트',
    'header.profile': '프로필',
    'header.profile_settings': '프로필 설정',
    'header.app_settings': '앱 설정',
    'header.upgrade_plan': '플랜 업그레이드',
    'header.privacy_data': '개인정보 및 데이터',
    'header.sign_out': '로그아웃',
    'nav.dashboard': '대시보드',
    'nav.tracking': '여행 추적',
    'nav.tax': '세금 거주지',
    'nav.visas': '비자 관리',
    'nav.documents': '문서',
    'nav.health': '건강 및 백신',
    'nav.news': '여행 뉴스',
    'nav.alerts': '스마트 알림',
    'nav.services': '여행 서비스',
    'nav.settings': '설정',
    'nav.help': '도움말 및 지원',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': '전 세계적으로 준수 유지',
    'stats.countries_tracked': '추적 중인 국가',
    'stats.active_destinations': '활성 목적지',
    'stats.critical_alerts': '중요 알림',
    'stats.require_attention': '주의 필요',
    'quick.title': '빠른 작업',
    'quick.add_country': '국가 추가',
    'quick.add_country_desc': '새 목적지 추적',
    'quick.upload_documents': '문서 업로드',
    'quick.upload_documents_desc': '여권 및 비자 추가',
    'quick.check_visas': '비자 확인',
    'quick.check_visas_desc': '비자 상태 보기',
    'quick.view_alerts': '알림 보기',
    'quick.view_alerts_desc': '알림 확인',
    'quick.ai_doctor': 'AI 여행 의사',
    'quick.ai_doctor_desc': '건강 조언 및 백신',
    'quick.ai_lawyer': 'AI 여행 변호사',
    'quick.ai_lawyer_desc': '법률 안내',
    'quick.ai_visa_helper': 'AI 비자 도우미',
    'quick.ai_visa_helper_desc': '비자 요구사항',
    'quick.ai_restaurant': 'AI 레스토랑 예약',
    'quick.ai_restaurant_desc': '근처 검색 및 예약',
    'quick.esim': 'eSIM 서비스',
    'quick.esim_desc': '전 세계적으로 연결 유지',
    'quick.embassy': '대사관 디렉토리',
    'quick.embassy_desc': '공식 연락처',
    'embassy.title': '대사관 디렉토리',
    'embassy.description': '주요 국가의 공식 대사관 웹사이트 및 여행 조언 액세스',
    'embassy.visit_website': '웹사이트 방문',
    'embassy.travel_advice': '여행 조언',
    'embassy.register': '여행 등록',
    'embassy.tip': '팁: 긴급 지원 및 보안 업데이트를 위해 대사관에 여행을 등록하세요',
    'ai.title': 'AI 여행 어시스턴트',
    'ai.typing': 'AI가 입력 중입니다...',
    'doc.title': '문서 추적',
    'doc.passports': '여권',
    'doc.licenses': '운전면허증',
    'expense.title': '비즈니스 비용 추적',
    'alerts.title': '스마트 알림 및 알림',
    'alerts.settings': '설정',
    'passport.title': '여권 관리자',
    'profile.title': '사용자 프로필 및 설정',
    'tax.title': '세금 거주지 및 준수 센터',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.close': '닫기',
  },
};

// Add comprehensive translation keys for all languages
const getTranslation = (key: string, translations: Record<string, string>): string => {
  return translations[key] || key;
};

const commonTranslations = {
  'common.free': {
    en: 'Free', es: 'Gratis', pt: 'Grátis', zh: '免费', fr: 'Gratuit', de: 'Kostenlos', 
    ar: 'مجاني', ja: '無料', it: 'Gratis', ko: '무료', hi: 'मुफ़्त', sw: 'Bure', af: 'Gratis'
  },
  'doc.track_description': {
    en: 'Track your passports and driving licenses with expiry monitoring',
    es: 'Rastree sus pasaportes y licencias de conducir con monitoreo de vencimiento',
    pt: 'Rastreie seus passaportes e carteiras de motorista com monitoramento de validade',
    zh: '跟踪您的护照和驾照并监控到期时间',
    fr: 'Suivez vos passeports et permis de conduire avec surveillance des expirations',
    de: 'Verfolgen Sie Ihre Reisepässe und Führerscheine mit Ablaufüberwachung',
    ar: 'تتبع جوازات السفر ورخص القيادة الخاصة بك مع مراقبة انتهاء الصلاحية',
    ja: 'パスポートと運転免許証を有効期限監視で追跡',
    it: 'Traccia i tuoi passaporti e patenti con monitoraggio della scadenza',
    ko: '여권 및 운전면허증을 만료 모니터링으로 추적',
    hi: 'समाप्ति निगरानी के साथ अपने पासपोर्ट और ड्राइविंग लाइसेंस ट्रैक करें',
    sw: 'Fuatilia pasi na leseni zako za kuendesha na ufuatiliaji wa kumalizika',
    af: 'Volg u paspoort en rybewys met vervaldatum monitering'
  },
  'doc.no_passports': {
    en: 'No passports tracked yet', es: 'Aún no se rastrean pasaportes', pt: 'Nenhum passaporte rastreado ainda',
    zh: '尚未追踪任何护照', fr: 'Aucun passeport suivi pour le moment', de: 'Noch keine Reisepässe verfolgt',
    ar: 'لم يتم تتبع جوازات سفر بعد', ja: 'まだパスポートを追跡していません', it: 'Nessun passaporto tracciato ancora',
    ko: '아직 추적된 여권이 없습니다', hi: 'अभी तक कोई पासपोर्ट ट्रैक नहीं किया गया',
    sw: 'Hakuna pasi zilizofuatiliwa bado', af: 'Nog geen paspoort opgevolg nie'
  },
  'doc.no_licenses': {
    en: 'No licenses tracked yet', es: 'Aún no se rastrean licencias', pt: 'Nenhuma licença rastreada ainda',
    zh: '尚未追踪任何驾照', fr: 'Aucun permis suivi pour le moment', de: 'Noch keine Führerscheine verfolgt',
    ar: 'لم يتم تتبع رخص بعد', ja: 'まだ免許証を追跡していません', it: 'Nessuna patente tracciata ancora',
    ko: '아직 추적된 면허증이 없습니다', hi: 'अभी तक कोई लाइसेंस ट्रैक नहीं किया गया',
    sw: 'Hakuna leseni zilizofuatiliwa bado', af: 'Nog geen lisensies opgevolg nie'
  },
  'doc.add_passport': {
    en: 'Add Passport', es: 'Agregar pasaporte', pt: 'Adicionar passaporte', zh: '添加护照',
    fr: 'Ajouter un passeport', de: 'Reisepass hinzufügen', ar: 'إضافة جواز سفر',
    ja: 'パスポートを追加', it: 'Aggiungi passaporto', ko: '여권 추가', hi: 'पासपोर्ट जोड़ें',
    sw: 'Ongeza Pasi', af: 'Voeg Paspoort By'
  },
  'doc.add_license': {
    en: 'Add License', es: 'Agregar licencia', pt: 'Adicionar licença', zh: '添加驾照',
    fr: 'Ajouter un permis', de: 'Führerschein hinzufügen', ar: 'إضافة رخصة',
    ja: '免許証を追加', it: 'Aggiungi patente', ko: '면허증 추가', hi: 'लाइसेंस जोड़ें',
    sw: 'Ongeza Leseni', af: 'Voeg Lisensie By'
  },
  'doc.expired': {
    en: 'Expired', es: 'Vencido', pt: 'Expirado', zh: '已过期', fr: 'Expiré', de: 'Abgelaufen',
    ar: 'منتهي الصلاحية', ja: '期限切れ', it: 'Scaduto', ko: '만료됨', hi: 'समाप्त', sw: 'Imeisha', af: 'Verstreke'
  },
  'doc.expiring_soon': {
    en: 'Expiring Soon', es: 'Vence pronto', pt: 'Expirando em breve', zh: '即将过期',
    fr: 'Expire bientôt', de: 'Läuft bald ab', ar: 'تنتهي قريباً', ja: 'まもなく期限切れ',
    it: 'In scadenza', ko: '곧 만료', hi: 'जल्द समाप्त हो रहा है', sw: 'Inaisha Hivi Karibuni', af: 'Verval Binnekort'
  },
  'doc.valid': {
    en: 'Valid', es: 'Válido', pt: 'Válido', zh: '有效', fr: 'Valide', de: 'Gültig',
    ar: 'صالح', ja: '有効', it: 'Valido', ko: '유효함', hi: 'वैध', sw: 'Halali', af: 'Geldig'
  },
  'doc.expires': {
    en: 'Expires', es: 'Vence', pt: 'Expira', zh: '到期', fr: 'Expire', de: 'Läuft ab',
    ar: 'تنتهي', ja: '期限', it: 'Scade', ko: '만료', hi: 'समाप्त होता है', sw: 'Inaisha', af: 'Verval'
  },
  'doc.country_state': {
    en: 'Country/State', es: 'País/Estado', pt: 'País/Estado', zh: '国家/州',
    fr: 'Pays/État', de: 'Land/Bundesland', ar: 'البلد/الولاية', ja: '国/州',
    it: 'Paese/Stato', ko: '국가/주', hi: 'देश/राज्य', sw: 'Nchi/Jimbo', af: 'Land/Staat'
  },
  'doc.license_class': {
    en: 'License Class', es: 'Clase de licencia', pt: 'Classe de licença', zh: '驾照类型',
    fr: 'Classe de permis', de: 'Führerscheinklasse', ar: 'فئة الرخصة', ja: '免許クラス',
    it: 'Classe patente', ko: '면허 등급', hi: 'लाइसेंस वर्ग', sw: 'Darasa la Leseni', af: 'Lisensie Klas'
  },
  'doc.issue_date': {
    en: 'Issue Date', es: 'Fecha de emisión', pt: 'Data de emissão', zh: '签发日期',
    fr: "Date d'émission", de: 'Ausstellungsdatum', ar: 'تاريخ الإصدار', ja: '発行日',
    it: 'Data di emissione', ko: '발급일', hi: 'जारी करने की तिथि', sw: 'Tarehe ya Kutolewa', af: 'Uitgiftedatum'
  },
  'doc.expiry_date': {
    en: 'Expiry Date', es: 'Fecha de vencimiento', pt: 'Data de validade', zh: '到期日期',
    fr: "Date d'expiration", de: 'Ablaufdatum', ar: 'تاريخ انتهاء الصلاحية', ja: '有効期限',
    it: 'Data di scadenza', ko: '만료일', hi: 'समाप्ति तिथि', sw: 'Tarehe ya Kumalizika', af: 'Vervaldatum'
  },
  'doc.issuing_authority': {
    en: 'Issuing Authority', es: 'Autoridad emisora', pt: 'Autoridade emissora', zh: '签发机构',
    fr: "Autorité émettrice", de: 'Ausstellende Behörde', ar: 'جهة الإصدار', ja: '発行機関',
    it: 'Autorità emittente', ko: '발급 기관', hi: 'जारी करने वाला प्राधिकरण', sw: 'Mamlaka ya Kutoa', af: 'Uitreik Owerheid'
  },
  'doc.notes': {
    en: 'Notes', es: 'Notas', pt: 'Notas', zh: '备注', fr: 'Notes', de: 'Notizen',
    ar: 'ملاحظات', ja: 'メモ', it: 'Note', ko: '메모', hi: 'नोट्स', sw: 'Maelezo', af: 'Nota'
  },
  'doc.missing_info': {
    en: 'Missing information', es: 'Falta información', pt: 'Informação ausente', zh: '信息缺失',
    fr: 'Information manquante', de: 'Fehlende Informationen', ar: 'معلومات مفقودة', ja: '情報が不足しています',
    it: 'Informazioni mancanti', ko: '정보 누락', hi: 'जानकारी गायब है', sw: 'Habari inayokosekana', af: 'Ontbrekende inligting'
  },
  'doc.fill_required': {
    en: 'Please fill in all required fields', es: 'Por favor complete todos los campos requeridos',
    pt: 'Por favor, preencha todos os campos obrigatórios', zh: '请填写所有必填字段',
    fr: 'Veuillez remplir tous les champs requis', de: 'Bitte füllen Sie alle erforderlichen Felder aus',
    ar: 'يرجى ملء جميع الحقول المطلوبة', ja: 'すべての必須フィールドに入力してください',
    it: 'Si prega di compilare tutti i campi obbligatori', ko: '모든 필수 필드를 입력하세요',
    hi: 'कृपया सभी आवश्यक फ़ील्ड भरें', sw: 'Tafadhali jaza sehemu zote zinazohitajika', af: 'Vul asseblief alle vereiste velde in'
  },
};

Object.keys(translations).forEach(lang => {
  Object.keys(commonTranslations).forEach(key => {
    if (!translations[lang][key]) {
      translations[lang][key] = commonTranslations[key][lang] || commonTranslations[key]['en'];
    }
  });
});
    
    // Tax Residency
    'tax.description': lang === 'en' ? 'Monitor your tax residency status across multiple jurisdictions' : lang === 'es' ? 'Supervise su estado de residencia fiscal en múltiples jurisdicciones' : lang === 'pt' ? 'Monitore seu status de residência fiscal em várias jurisdições' : lang === 'hi' ? 'कई क्षेत्राधिकारों में अपनी कर निवास स्थिति की निगरानी करें' : lang === 'sw' ? 'Fuatilia hali yako ya makazi ya kodi katika mamlaka kadhaa' : 'Monitor u belasting inwoner status oor verskeie jurisdiksies',
    'tax.select_jurisdiction': lang === 'en' ? 'Select jurisdiction' : lang === 'es' ? 'Seleccionar jurisdicción' : lang === 'pt' ? 'Selecionar jurisdição' : lang === 'hi' ? 'क्षेत्राधिकार चुनें' : lang === 'sw' ? 'Chagua mamlaka' : 'Kies jurisdiksie',
    'tax.global_overview': lang === 'en' ? 'Global Overview' : lang === 'es' ? 'Visión global' : lang === 'pt' ? 'Visão geral' : lang === 'hi' ? 'वैश्विक अवलोकन' : lang === 'sw' ? 'Muhtasari wa Kimataifa' : 'Wêreldwye Oorsig',
    'tax.united_states': lang === 'en' ? 'United States' : lang === 'es' ? 'Estados Unidos' : lang === 'pt' ? 'Estados Unidos' : lang === 'hi' ? 'संयुक्त राज्य' : lang === 'sw' ? 'Marekani' : 'Verenigde State',
    'tax.canada': lang === 'en' ? 'Canada' : lang === 'es' ? 'Canadá' : lang === 'pt' ? 'Canadá' : lang === 'hi' ? 'कनाडा' : lang === 'sw' ? 'Kanada' : 'Kanada',
    'tax.days_spent': lang === 'en' ? 'Days Spent' : lang === 'es' ? 'Días pasados' : lang === 'pt' ? 'Dias gastos' : lang === 'hi' ? 'बिताए दिन' : lang === 'sw' ? 'Siku Zilizotumika' : 'Dae Spandeer',
    'tax.days_remaining': lang === 'en' ? 'days remaining' : lang === 'es' ? 'días restantes' : lang === 'pt' ? 'dias restantes' : lang === 'hi' ? 'शेष दिन' : lang === 'sw' ? 'siku zilizobaki' : 'dae oor',
    'tax.tax_resident': lang === 'en' ? 'Tax Resident' : lang === 'es' ? 'Residente fiscal' : lang === 'pt' ? 'Residente fiscal' : lang === 'hi' ? 'कर निवासी' : lang === 'sw' ? 'Mkazi wa Kodi' : 'Belasting Inwoner',
    'tax.no_countries': lang === 'en' ? 'No countries tracked for tax residency yet' : lang === 'es' ? 'Aún no se rastrean países para residencia fiscal' : lang === 'pt' ? 'Nenhum país rastreado para residência fiscal ainda' : lang === 'hi' ? 'कर निवास के लिए अभी तक कोई देश ट्रैक नहीं किया गया' : lang === 'sw' ? 'Hakuna nchi zilizofuatiliwa kwa makazi ya kodi bado' : 'Nog geen lande opgevolg vir belasting inwoner nie',
    
    // Travel Services
    'services.title': lang === 'en' ? 'Travel Services' : lang === 'es' ? 'Servicios de viaje' : lang === 'pt' ? 'Serviços de viagem' : lang === 'hi' ? 'यात्रा सेवाएं' : lang === 'sw' ? 'Huduma za Safari' : 'Reisdienste',
    'services.description': lang === 'en' ? 'Find the best deals and services for your travels' : lang === 'es' ? 'Encuentre las mejores ofertas y servicios para sus viajes' : lang === 'pt' ? 'Encontre as melhores ofertas e serviços para suas viagens' : lang === 'hi' ? 'अपनी यात्रा के लिए सर्वोत्तम सौदे और सेवाएं खोजें' : lang === 'sw' ? 'Pata ofa na huduma bora kwa safari zako' : 'Vind die beste aanbiedinge en dienste vir u reise',
    'services.find_offers': lang === 'en' ? 'Find Offers' : lang === 'es' ? 'Encontrar ofertas' : lang === 'pt' ? 'Encontrar ofertas' : lang === 'hi' ? 'ऑफ़र खोजें' : lang === 'sw' ? 'Pata Ofa' : 'Vind Aanbiedinge',
    'services.get_deals': lang === 'en' ? 'Get Offers & Deals' : lang === 'es' ? 'Obtenga ofertas y ofertas' : lang === 'pt' ? 'Obter ofertas e negócios' : lang === 'hi' ? 'ऑफ़र और सौदे प्राप्त करें' : lang === 'sw' ? 'Pata Ofa na Mikataba' : 'Kry Aanbiedinge en Transaksies',
    'services.insurance': lang === 'en' ? 'Travel Insurance' : lang === 'es' ? 'Seguro de viaje' : lang === 'pt' ? 'Seguro viagem' : lang === 'hi' ? 'यात्रा बीमा' : lang === 'sw' ? 'Bima ya Safari' : 'Reis Versekering',
    'services.hotels': lang === 'en' ? 'Hotel Booking' : lang === 'es' ? 'Reserva de hotel' : lang === 'pt' ? 'Reserva de hotel' : lang === 'hi' ? 'होटल बुकिंग' : lang === 'sw' ? 'Kuhifadhi Hoteli' : 'Hotel Bespreking',
    'services.restaurants': lang === 'en' ? 'Local Restaurants' : lang === 'es' ? 'Restaurantes locales' : lang === 'pt' ? 'Restaurantes locais' : lang === 'hi' ? 'स्थानीय रेस्तरां' : lang === 'sw' ? 'Mikahawa ya Karibu' : 'Plaaslike Restaurante',
    'services.vip': lang === 'en' ? 'Luxury VIP Services' : lang === 'es' ? 'Servicios VIP de lujo' : lang === 'pt' ? 'Serviços VIP de luxo' : lang === 'hi' ? 'लक्ज़री VIP सेवाएं' : lang === 'sw' ? 'Huduma za Kifahari za VIP' : 'Luukse VIP Dienste',
    'services.legal': lang === 'en' ? 'Legal Services' : lang === 'es' ? 'Servicios legales' : lang === 'pt' ? 'Serviços jurídicos' : lang === 'hi' ? 'कानूनी सेवाएं' : lang === 'sw' ? 'Huduma za Kisheria' : 'Regsdienste',
    'services.visa': lang === 'en' ? 'Visa & Documentation' : lang === 'es' ? 'Visa y documentación' : lang === 'pt' ? 'Visto e documentação' : lang === 'hi' ? 'वीज़ा और दस्तावेज़ीकरण' : lang === 'sw' ? 'Visa na Hati' : 'Visum en Dokumentasie',
    'services.premium_directory': lang === 'en' ? 'Premium Luxury Services Directory' : lang === 'es' ? 'Directorio de servicios de lujo premium' : lang === 'pt' ? 'Diretório de serviços de luxo premium' : lang === 'hi' ? 'प्रीमियम लक्ज़री सेवाओं की निर्देशिका' : lang === 'sw' ? 'Saraka ya Huduma za Kifahari za Juu' : 'Premium Luukse Dienste Gids',
    'services.why_premium': lang === 'en' ? 'Why Choose Premium Services?' : lang === 'es' ? '¿Por qué elegir servicios premium?' : lang === 'pt' ? 'Por que escolher serviços premium?' : lang === 'hi' ? 'प्रीमियम सेवाओं को क्यों चुनें?' : lang === 'sw' ? 'Kwa Nini Chagua Huduma za Juu?' : 'Hoekom Kies Premium Dienste?',
    
    // Add Country Modal
    'addCountry.title': lang === 'en' ? 'Add Country to Track' : lang === 'es' ? 'Agregar país para rastrear' : lang === 'pt' ? 'Adicionar país para rastrear' : lang === 'hi' ? 'ट्रैक करने के लिए देश जोड़ें' : lang === 'sw' ? 'Ongeza Nchi kufuatilia' : 'Voeg Land by om op te volg',
    'addCountry.selectCountry': lang === 'en' ? 'Select Country' : lang === 'es' ? 'Seleccionar país' : lang === 'pt' ? 'Selecionar país' : lang === 'hi' ? 'देश चुनें' : lang === 'sw' ? 'Chagua Nchi' : 'Kies Land',
    'addCountry.chooseCountry': lang === 'en' ? 'Choose a country...' : lang === 'es' ? 'Elige un país...' : lang === 'pt' ? 'Escolha um país...' : lang === 'hi' ? 'एक देश चुनें...' : lang === 'sw' ? 'Chagua nchi...' : 'Kies \'n land...',
    'addCountry.or': lang === 'en' ? 'or' : lang === 'es' ? 'o' : lang === 'pt' ? 'ou' : lang === 'hi' ? 'या' : lang === 'sw' ? 'au' : 'of',
    'addCountry.customCountry': lang === 'en' ? 'Custom Country' : lang === 'es' ? 'País personalizado' : lang === 'pt' ? 'País personalizado' : lang === 'hi' ? 'कस्टम देश' : lang === 'sw' ? 'Nchi Maalum' : 'Aangepaste Land',
    'addCountry.flag': lang === 'en' ? 'Flag' : lang === 'es' ? 'Bandera' : lang === 'pt' ? 'Bandeira' : lang === 'hi' ? 'झंडा' : lang === 'sw' ? 'Bendera' : 'Vlag',
    'addCountry.visaType': lang === 'en' ? 'Visa/Tracking Type' : lang === 'es' ? 'Tipo de visa/seguimiento' : lang === 'pt' ? 'Tipo de visto/rastreamento' : lang === 'hi' ? 'वीज़ा/ट्रैकिंग प्रकार' : lang === 'sw' ? 'Aina ya Visa/Ufuatiliaji' : 'Visum/Opvolgings Tipe',
    'addCountry.chooseVisaType': lang === 'en' ? 'Choose visa or tracking type...' : lang === 'es' ? 'Elige el tipo de visa o seguimiento...' : lang === 'pt' ? 'Escolha o tipo de visto ou rastreamento...' : lang === 'hi' ? 'वीज़ा या ट्रैकिंग प्रकार चुनें...' : lang === 'sw' ? 'Chagua aina ya visa au ufuatiliaji...' : 'Kies visum of opvolgings tipe...',
    'addCountry.customReason': lang === 'en' ? 'Custom Reason' : lang === 'es' ? 'Razón personalizada' : lang === 'pt' ? 'Motivo personalizado' : lang === 'hi' ? 'कस्टम कारण' : lang === 'sw' ? 'Sababu Maalum' : 'Aangepaste Rede',
    'addCountry.customReasonPlaceholder': lang === 'en' ? 'Enter your custom tracking reason...' : lang === 'es' ? 'Ingrese su razón de seguimiento personalizada...' : lang === 'pt' ? 'Digite seu motivo de rastreamento personalizado...' : lang === 'hi' ? 'अपना कस्टम ट्रैकिंग कारण दर्ज करें...' : lang === 'sw' ? 'Ingiza sababu yako maalum ya kufuatilia...' : 'Voer u aangepaste opvolgings rede in...',
    'addCountry.dayLimitOptions': lang === 'en' ? 'Day Limit Options' : lang === 'es' ? 'Opciones de límite de días' : lang === 'pt' ? 'Opções de limite de dias' : lang === 'hi' ? 'दिन सीमा विकल्प' : lang === 'sw' ? 'Chaguo za Kikomo cha Siku' : 'Dag Limiet Opsies',
    'addCountry.commonLimits': lang === 'en' ? 'Choose from common visa limits:' : lang === 'es' ? 'Elija entre los límites de visa comunes:' : lang === 'pt' ? 'Escolha entre os limites de visto comuns:' : lang === 'hi' ? 'सामान्य वीज़ा सीमाओं में से चुनें:' : lang === 'sw' ? 'Chagua kutoka mipaka ya kawaida ya visa:' : 'Kies uit algemene visum limiete:',
    'addCountry.customDays': lang === 'en' ? 'Or enter custom days:' : lang === 'es' ? 'O ingrese días personalizados:' : lang === 'pt' ? 'Ou digite dias personalizados:' : lang === 'hi' ? 'या कस्टम दिन दर्ज करें:' : lang === 'sw' ? 'Au ingiza siku maalum:' : 'Of voer aangepaste dae in:',
    'addCountry.customDaysPlaceholder': lang === 'en' ? 'Enter custom day limit' : lang === 'es' ? 'Ingrese límite de días personalizado' : lang === 'pt' ? 'Digite o limite de dias personalizado' : lang === 'hi' ? 'कस्टम दिन सीमा दर्ज करें' : lang === 'sw' ? 'Ingiza kikomo cha siku maalum' : 'Voer aangepaste dag limiet in',
    'addCountry.maxDaysNote': lang === 'en' ? 'Maximum days allowed in this country for your selected visa/tracking type' : lang === 'es' ? 'Días máximos permitidos en este país para su tipo de visa/seguimiento seleccionado' : lang === 'pt' ? 'Dias máximos permitidos neste país para o seu tipo de visto/rastreamento selecionado' : lang === 'hi' ? 'आपके चयनित वीज़ा/ट्रैकिंग प्रकार के लिए इस देश में अधिकतम दिनों की अनुमति' : lang === 'sw' ? 'Siku za juu zinazoruhusiwa katika nchi hii kwa aina yako iliyochaguliwa ya visa/ufuatiliaji' : 'Maksimum dae toegelaat in hierdie land vir u gekose visum/opvolgings tipe',
    'addCountry.cancel': lang === 'en' ? 'Cancel' : lang === 'es' ? 'Cancelar' : lang === 'pt' ? 'Cancelar' : lang === 'hi' ? 'रद्द करें' : lang === 'sw' ? 'Ghairi' : 'Kanselleer',
    'addCountry.addCountry': lang === 'en' ? 'Add Country' : lang === 'es' ? 'Agregar país' : lang === 'pt' ? 'Adicionar país' : lang === 'hi' ? 'देश जोड़ें' : lang === 'sw' ? 'Ongeza Nchi' : 'Voeg Land By',
    'addCountry.taxRule': lang === 'en' ? 'Tax Residence Rule' : lang === 'es' ? 'Regla de residencia fiscal' : lang === 'pt' ? 'Regra de residência fiscal' : lang === 'hi' ? 'कर निवास नियम' : lang === 'sw' ? 'Kanuni ya Makazi ya Kodi' : 'Belasting Inwoner Reël',
    
    // Visa Types
    'visaType.schengen': lang === 'en' ? 'Schengen Area' : lang === 'es' ? 'Área Schengen' : lang === 'pt' ? 'Área Schengen' : lang === 'hi' ? 'शेंगेन क्षेत्र' : lang === 'sw' ? 'Eneo la Schengen' : 'Schengen Area',
    'visaType.schengenDesc': lang === 'en' ? 'EU Schengen zone (90 days per 180-day period)' : lang === 'es' ? 'Zona Schengen de la UE (90 días por período de 180 días)' : lang === 'pt' ? 'Zona Schengen da UE (90 dias por período de 180 dias)' : lang === 'hi' ? 'ईयू शेंगेन क्षेत्र (180 दिन की अवधि में 90 दिन)' : lang === 'sw' ? 'Eneo la Schengen la EU (siku 90 kwa kipindi cha siku 180)' : 'EU Schengen sone (90 dae per 180-dag periode)',
    'visaType.tourist': lang === 'en' ? 'Tourist Visa' : lang === 'es' ? 'Visa de turista' : lang === 'pt' ? 'Visto de turista' : lang === 'hi' ? 'पर्यटक वीज़ा' : lang === 'sw' ? 'Visa ya Utalii' : 'Toeris Visum',
    'visaType.touristDesc': lang === 'en' ? 'Tourist/visitor visa limits' : lang === 'es' ? 'Límites de visa de turista/visitante' : lang === 'pt' ? 'Limites de visto de turista/visitante' : lang === 'hi' ? 'पर्यटक/आगंतुक वीज़ा सीमाएं' : lang === 'sw' ? 'Mipaka ya visa ya utalii/wageni' : 'Toeris/besoeker visum limiete',
    'visaType.student': lang === 'en' ? 'Student Visa' : lang === 'es' ? 'Visa de estudiante' : lang === 'pt' ? 'Visto de estudante' : lang === 'hi' ? 'छात्र वीज़ा' : lang === 'sw' ? 'Visa ya Mwanafunzi' : 'Student Visum',
    'visaType.studentDesc': lang === 'en' ? 'Academic study periods' : lang === 'es' ? 'Períodos de estudio académico' : lang === 'pt' ? 'Períodos de estudo acadêmico' : lang === 'hi' ? 'अकादमिक अध्ययन अवधि' : lang === 'sw' ? 'Vipindi vya masomo ya kitaaluma' : 'Akademiese studieperiodes',
    'visaType.business': lang === 'en' ? 'Business Visa' : lang === 'es' ? 'Visa de negocios' : lang === 'pt' ? 'Visto de negócios' : lang === 'hi' ? 'व्यावसायिक वीज़ा' : lang === 'sw' ? 'Visa ya Biashara' : 'Besigheids Visum',
    'visaType.businessDesc': lang === 'en' ? 'Business travel and meetings' : lang === 'es' ? 'Viajes de negocios y reuniones' : lang === 'pt' ? 'Viagens de negócios e reuniões' : lang === 'hi' ? 'व्यावसायिक यात्रा और बैठकें' : lang === 'sw' ? 'Safari za biashara na mikutano' : 'Besigheidsreise en vergaderings',
    'visaType.work': lang === 'en' ? 'Work Permit' : lang === 'es' ? 'Permiso de trabajo' : lang === 'pt' ? 'Autorização de trabalho' : lang === 'hi' ? 'कार्य परमिट' : lang === 'sw' ? 'Kibali cha Kazi' : 'Werkpermit',
    'visaType.workDesc': lang === 'en' ? 'Employment authorization' : lang === 'es' ? 'Autorización de empleo' : lang === 'pt' ? 'Autorização de emprego' : lang === 'hi' ? 'रोजगार प्राधिकरण' : lang === 'sw' ? 'Idhini ya ajira' : 'Werk magtiging',
    'visaType.taxResidence': lang === 'en' ? 'Tax Residence' : lang === 'es' ? 'Residencia fiscal' : lang === 'pt' ? 'Residência fiscal' : lang === 'hi' ? 'कर निवास' : lang === 'sw' ? 'Makazi ya Kodi' : 'Belasting Inwoner',
    'visaType.taxResidenceDesc': lang === 'en' ? 'Tax residency thresholds' : lang === 'es' ? 'Umbrales de residencia fiscal' : lang === 'pt' ? 'Limites de residência fiscal' : lang === 'hi' ? 'कर निवास सीमाएं' : lang === 'sw' ? 'Kizingiti cha makazi ya kodi' : 'Belasting inwoner drempels',
    'visaType.digitalNomad': lang === 'en' ? 'Digital Nomad' : lang === 'es' ? 'Nómada digital' : lang === 'pt' ? 'Nômade digital' : lang === 'hi' ? 'डिजिटल नोमैड' : lang === 'sw' ? 'Msafiri wa Dijiti' : 'Digitale Nomade',
    'visaType.digitalNomadDesc': lang === 'en' ? 'Remote work visa' : lang === 'es' ? 'Visa de trabajo remoto' : lang === 'pt' ? 'Visto de trabalho remoto' : lang === 'hi' ? 'रिमोट कार्य वीज़ा' : lang === 'sw' ? 'Visa ya kazi ya mbali' : 'Afgeleë werk visum',
    'visaType.transit': lang === 'en' ? 'Transit Visa' : lang === 'es' ? 'Visa de tránsito' : lang === 'pt' ? 'Visto de trânsito' : lang === 'hi' ? 'ट्रांजिट वीज़ा' : lang === 'sw' ? 'Visa ya Kusafiri' : 'Transit Visum',
    'visaType.transitDesc': lang === 'en' ? 'Airport/country transit' : lang === 'es' ? 'Tránsito por aeropuerto/país' : lang === 'pt' ? 'Trânsito por aeroporto/país' : lang === 'hi' ? 'हवाई अड्डा/देश पारगमन' : lang === 'sw' ? 'Usafiri wa uwanja wa ndege/nchi' : 'Lughawe/land deurgang',
    'visaType.custom': lang === 'en' ? 'Custom Tracking' : lang === 'es' ? 'Seguimiento personalizado' : lang === 'pt' ? 'Rastreamento personalizado' : lang === 'hi' ? 'कस्टम ट्रैकिंग' : lang === 'sw' ? 'Ufuatiliaji Maalum' : 'Aangepaste Opvolging',
    'visaType.customDesc': lang === 'en' ? 'Your own tracking reason' : lang === 'es' ? 'Su propia razón de seguimiento' : lang === 'pt' ? 'Seu próprio motivo de rastreamento' : lang === 'hi' ? 'आपका अपना ट्रैकिंग कारण' : lang === 'sw' ? 'Sababu yako mwenyewe ya kufuatilia' : 'U eie opvolgings rede',
    
    // Day Limits
    'dayLimit.transit': lang === 'en' ? 'Transit visa' : lang === 'es' ? 'Visa de tránsito' : lang === 'pt' ? 'Visto de trânsito' : lang === 'hi' ? 'ट्रांजिट वीज़ा' : lang === 'sw' ? 'Visa ya usafiri' : 'Transit visum',
    'dayLimit.shortBusiness': lang === 'en' ? 'Short business/tourist' : lang === 'es' ? 'Negocios/turista corto' : lang === 'pt' ? 'Negócios/turista curto' : lang === 'hi' ? 'लघु व्यापार/पर्यटक' : lang === 'sw' ? 'Biashara/utalii mfupi' : 'Kort besigheid/toeris',
    'dayLimit.extendedTourist': lang === 'en' ? 'Extended tourist' : lang === 'es' ? 'Turista extendido' : lang === 'pt' ? 'Turista estendido' : lang === 'hi' ? 'विस्तारित पर्यटक' : lang === 'sw' ? 'Utalii ulioongezwa' : 'Uitgebreide toeris',
    'dayLimit.standardTourist': lang === 'en' ? 'Standard tourist/Schengen' : lang === 'es' ? 'Turista estándar/Schengen' : lang === 'pt' ? 'Turista padrão/Schengen' : lang === 'hi' ? 'मानक पर्यटक/शेंगेन' : lang === 'sw' ? 'Utalii wa kawaida/Schengen' : 'Standaard toeris/Schengen',
    'dayLimit.longStay': lang === 'en' ? 'Long tourist stay' : lang === 'es' ? 'Estancia turística larga' : lang === 'pt' ? 'Longa estadia turística' : lang === 'hi' ? 'लंबी पर्यटक प्रवास' : lang === 'sw' ? 'Kukaa kwa utalii kwa muda mrefu' : 'Lang toeris verblyf',
    'dayLimit.digitalNomad': lang === 'en' ? 'Digital nomad/extended' : lang === 'es' ? 'Nómada digital/extendido' : lang === 'pt' ? 'Nômade digital/estendido' : lang === 'hi' ? 'डिजिटल नोमैड/विस्तारित' : lang === 'sw' ? 'Msafiri wa dijiti/ulioongezwa' : 'Digitale nomade/uitgebrei',
    'dayLimit.taxThreshold': lang === 'en' ? 'Tax residence threshold' : lang === 'es' ? 'Umbral de residencia fiscal' : lang === 'pt' ? 'Limite de residência fiscal' : lang === 'hi' ? 'कर निवास सीमा' : lang === 'sw' ? 'Kizingiti cha makazi ya kodi' : 'Belasting inwoner drempel',
    'dayLimit.fullYear': lang === 'en' ? 'Full year (study/work)' : lang === 'es' ? 'Año completo (estudio/trabajo)' : lang === 'pt' ? 'Ano completo (estudo/trabalho)' : lang === 'hi' ? 'पूरा वर्ष (अध्ययन/कार्य)' : lang === 'sw' ? 'Mwaka mzima (masomo/kazi)' : 'Volle jaar (studie/werk)',
    
    // Circular Dashboard
    'circularDashboard.title': lang === 'en' ? 'Countries at a Glance' : lang === 'es' ? 'Países de un vistazo' : lang === 'pt' ? 'Países em resumo' : lang === 'hi' ? 'एक नज़र में देश' : lang === 'sw' ? 'Nchi kwa Haraka' : 'Lande op \'n Oogopslag',
    'circularDashboard.noCountries': lang === 'en' ? 'No countries tracked yet' : lang === 'es' ? 'Aún no se rastrean países' : lang === 'pt' ? 'Nenhum país rastreado ainda' : lang === 'hi' ? 'अभी तक कोई देश ट्रैक नहीं किया गया' : lang === 'sw' ? 'Hakuna nchi zilizofuatiliwa bado' : 'Nog geen lande opgevolg nie',
    'circularDashboard.daysLeft': lang === 'en' ? 'days left' : lang === 'es' ? 'días restantes' : lang === 'pt' ? 'dias restantes' : lang === 'hi' ? 'शेष दिन' : lang === 'sw' ? 'siku zilizobaki' : 'dae oor',
    'circularDashboard.limitExceeded': lang === 'en' ? 'Limit exceeded' : lang === 'es' ? 'Límite excedido' : lang === 'pt' ? 'Limite excedido' : lang === 'hi' ? 'सीमा पार हो गई' : lang === 'sw' ? 'Kikomo kimezidiwa' : 'Limiet oorskry',
    'circularDashboard.current': lang === 'en' ? 'Current' : lang === 'es' ? 'Actual' : lang === 'pt' ? 'Atual' : lang === 'hi' ? 'वर्तमान' : lang === 'sw' ? 'Ya Sasa' : 'Huidige',
    'circularDashboard.notCounting': lang === 'en' ? 'Not Counting' : lang === 'es' ? 'No contando' : lang === 'pt' ? 'Não contando' : lang === 'hi' ? 'गिनती नहीं' : lang === 'sw' ? 'Haihesabiwi' : 'Nie Tel nie',
    
    // VPN Detection Modal
    'vpnModal.title': lang === 'en' ? 'VPN Detected' : lang === 'es' ? 'VPN detectado' : lang === 'pt' ? 'VPN detectada' : lang === 'hi' ? 'VPN का पता चला' : lang === 'sw' ? 'VPN Imegunduliwa' : 'VPN Bespeur',
    'vpnModal.activityDetected': lang === 'en' ? 'VPN Activity Detected' : lang === 'es' ? 'Actividad de VPN detectada' : lang === 'pt' ? 'Atividade de VPN detectada' : lang === 'hi' ? 'VPN गतिविधि का पता चला' : lang === 'sw' ? 'Shughuli za VPN Zimegunduliwa' : 'VPN Aktiwiteit Bespeur',
    'vpnModal.durationMessage': lang === 'en' ? 'Your VPN has been active for {duration}. This may affect location accuracy for travel day tracking.' : lang === 'es' ? 'Su VPN ha estado activo durante {duration}. Esto puede afectar la precisión de la ubicación para el seguimiento de días de viaje.' : lang === 'pt' ? 'Sua VPN está ativa há {duration}. Isso pode afetar a precisão da localização para o rastreamento de dias de viagem.' : lang === 'hi' ? 'आपका VPN {duration} के लिए सक्रिय रहा है। यह यात्रा दिन ट्रैकिंग के लिए स्थान सटीकता को प्रभावित कर सकता है।' : lang === 'sw' ? 'VPN yako imekuwa hai kwa {duration}. Hii inaweza kuathiri usahihi wa mahali kwa ufuatiliaji wa siku za safari.' : 'U VPN is aktief vir {duration}. Dit kan liggings akkuraatheid vir reis dag opvolging beïnvloed.',
    'vpnModal.detectedLocation': lang === 'en' ? 'Detected Location' : lang === 'es' ? 'Ubicación detectada' : lang === 'pt' ? 'Localização detectada' : lang === 'hi' ? 'पता लगाया गया स्थान' : lang === 'sw' ? 'Mahali Palilogunduliwa' : 'Bespeurde Ligging',
    'vpnModal.question': lang === 'en' ? 'Is this your correct location for travel day tracking?' : lang === 'es' ? '¿Es esta su ubicación correcta para el seguimiento de días de viaje?' : lang === 'pt' ? 'Esta é a sua localização correta para o rastreamento de dias de viagem?' : lang === 'hi' ? 'क्या यह यात्रा दिन ट्रैकिंग के लिए आपका सही स्थान है?' : lang === 'sw' ? 'Je, hii ni mahali pako sahihi kwa ufuatiliaji wa siku za safari?' : 'Is dit u korrekte ligging vir reis dag opvolging?',
    'vpnModal.yesCorrect': lang === 'en' ? 'Yes, Correct' : lang === 'es' ? 'Sí, correcto' : lang === 'pt' ? 'Sim, correto' : lang === 'hi' ? 'हां, सही' : lang === 'sw' ? 'Ndio, Sahihi' : 'Ja, Korrek',
    'vpnModal.noWrong': lang === 'en' ? 'No, Wrong' : lang === 'es' ? 'No, incorrecto' : lang === 'pt' ? 'Não, errado' : lang === 'hi' ? 'नहीं, गलत' : lang === 'sw' ? 'Hapana, Sio Sahihi' : 'Nee, Verkeerd',
    'vpnModal.disableVPN': lang === 'en' ? 'Disable VPN Temporarily' : lang === 'es' ? 'Deshabilitar VPN temporalmente' : lang === 'pt' ? 'Desativar VPN temporariamente' : lang === 'hi' ? 'VPN को अस्थायी रूप से अक्षम करें' : lang === 'sw' ? 'Zima VPN Kwa Muda' : 'Deaktiveer VPN Tydelik',
    
    // Emergency Contacts (comprehensive)
    'emergencyContacts.title': lang === 'en' ? 'Emergency Contacts' : lang === 'es' ? 'Contactos de emergencia' : lang === 'pt' ? 'Contatos de emergência' : lang === 'hi' ? 'आपातकालीन संपर्क' : lang === 'sw' ? 'Mawasiliano ya Dharura' : 'Nood Kontakte',
    'emergencyContacts.description': lang === 'en' ? 'Quick access to important contacts while traveling' : lang === 'es' ? 'Acceso rápido a contactos importantes mientras viaja' : lang === 'pt' ? 'Acesso rápido a contatos importantes enquanto viaja' : lang === 'hi' ? 'यात्रा के दौरान महत्वपूर्ण संपर्कों तक त्वरित पहुंच' : lang === 'sw' ? 'Ufikiaji wa haraka wa mawasiliano muhimu wakati wa kusafiri' : 'Vinnige toegang tot belangrike kontakte terwyl u reis',
    'emergencyContacts.noContacts': lang === 'en' ? 'No emergency contacts added yet' : lang === 'es' ? 'Aún no se han agregado contactos de emergencia' : lang === 'pt' ? 'Nenhum contato de emergência adicionado ainda' : lang === 'hi' ? 'अभी तक कोई आपातकालीन संपर्क नहीं जोड़े गए' : lang === 'sw' ? 'Hakuna mawasiliano ya dharura yaliyoongezwa bado' : 'Nog geen nood kontakte bygevoeg nie',
    'emergencyContacts.addContact': lang === 'en' ? 'Add Emergency Contact' : lang === 'es' ? 'Agregar contacto de emergencia' : lang === 'pt' ? 'Adicionar contato de emergência' : lang === 'hi' ? 'आपातकालीन संपर्क जोड़ें' : lang === 'sw' ? 'Ongeza Mawasiliano ya Dharura' : 'Voeg Nood Kontak By',
    'emergencyContacts.primary': lang === 'en' ? 'Primary' : lang === 'es' ? 'Principal' : lang === 'pt' ? 'Principal' : lang === 'hi' ? 'प्राथमिक' : lang === 'sw' ? 'Msingi' : 'Primêr',
    'emergencyContacts.edit': lang === 'en' ? 'Edit' : lang === 'es' ? 'Editar' : lang === 'pt' ? 'Editar' : lang === 'hi' ? 'संपादित करें' : lang === 'sw' ? 'Hariri' : 'Wysig',
    'emergencyContacts.delete': lang === 'en' ? 'Delete' : lang === 'es' ? 'Eliminar' : lang === 'pt' ? 'Excluir' : lang === 'hi' ? 'हटाएं' : lang === 'sw' ? 'Futa' : 'Verwyder',
    'emergencyContacts.modalTitleAdd': lang === 'en' ? 'Add Emergency Contact' : lang === 'es' ? 'Agregar contacto de emergencia' : lang === 'pt' ? 'Adicionar contato de emergência' : lang === 'hi' ? 'आपातकालीन संपर्क जोड़ें' : lang === 'sw' ? 'Ongeza Mawasiliano ya Dharura' : 'Voeg Nood Kontak By',
    'emergencyContacts.modalTitleEdit': lang === 'en' ? 'Edit Emergency Contact' : lang === 'es' ? 'Editar contacto de emergencia' : lang === 'pt' ? 'Editar contato de emergência' : lang === 'hi' ? 'आपातकालीन संपर्क संपादित करें' : lang === 'sw' ? 'Hariri Mawasiliano ya Dharura' : 'Wysig Nood Kontak',
    'emergencyContacts.modalDescription': lang === 'en' ? 'Add important contacts for emergency situations' : lang === 'es' ? 'Agregue contactos importantes para situaciones de emergencia' : lang === 'pt' ? 'Adicione contatos importantes para situações de emergência' : lang === 'hi' ? 'आपातकालीन स्थितियों के लिए महत्वपूर्ण संपर्क जोड़ें' : lang === 'sw' ? 'Ongeza mawasiliano muhimu kwa hali za dharura' : 'Voeg belangrike kontakte by vir noodsituasies',
    'emergencyContacts.contactType': lang === 'en' ? 'Contact Type' : lang === 'es' ? 'Tipo de contacto' : lang === 'pt' ? 'Tipo de contato' : lang === 'hi' ? 'संपर्क प्रकार' : lang === 'sw' ? 'Aina ya Mawasiliano' : 'Kontak Tipe',
    'emergencyContacts.name': lang === 'en' ? 'Name *' : lang === 'es' ? 'Nombre *' : lang === 'pt' ? 'Nome *' : lang === 'hi' ? 'नाम *' : lang === 'sw' ? 'Jina *' : 'Naam *',
    'emergencyContacts.namePlaceholder': lang === 'en' ? 'Contact name' : lang === 'es' ? 'Nombre del contacto' : lang === 'pt' ? 'Nome do contato' : lang === 'hi' ? 'संपर्क नाम' : lang === 'sw' ? 'Jina la mawasiliano' : 'Kontak naam',
    'emergencyContacts.relationship': lang === 'en' ? 'Relationship/Role' : lang === 'es' ? 'Relación/Rol' : lang === 'pt' ? 'Relacionamento/Função' : lang === 'hi' ? 'संबंध/भूमिका' : lang === 'sw' ? 'Uhusiano/Jukumu' : 'Verhouding/Rol',
    'emergencyContacts.relationshipPlaceholder': lang === 'en' ? 'e.g., Family member, Embassy staff' : lang === 'es' ? 'p. ej., Miembro de la familia, Personal de la embajada' : lang === 'pt' ? 'ex., Membro da família, Funcionário da embaixada' : lang === 'hi' ? 'उदा., परिवार का सदस्य, दूतावास कर्मचारी' : lang === 'sw' ? 'k.m., Mwanafamilia, Wafanyakazi wa ubalozi' : 'bv., Familielid, Ambassade personeel',
    'emergencyContacts.phone': lang === 'en' ? 'Phone Number *' : lang === 'es' ? 'Número de teléfono *' : lang === 'pt' ? 'Número de telefone *' : lang === 'hi' ? 'फ़ोन नंबर *' : lang === 'sw' ? 'Nambari ya Simu *' : 'Telefoonnommer *',
    'emergencyContacts.phonePlaceholder': lang === 'en' ? '+1 234 567 8900' : lang === 'es' ? '+1 234 567 8900' : lang === 'pt' ? '+1 234 567 8900' : lang === 'hi' ? '+1 234 567 8900' : lang === 'sw' ? '+1 234 567 8900' : '+1 234 567 8900',
    'emergencyContacts.email': lang === 'en' ? 'Email' : lang === 'es' ? 'Correo electrónico' : lang === 'pt' ? 'E-mail' : lang === 'hi' ? 'ईमेल' : lang === 'sw' ? 'Barua pepe' : 'E-pos',
    'emergencyContacts.emailPlaceholder': lang === 'en' ? 'contact@example.com' : lang === 'es' ? 'contacto@ejemplo.com' : lang === 'pt' ? 'contato@exemplo.com' : lang === 'hi' ? 'संपर्क@उदाहरण.com' : lang === 'sw' ? 'mawasiliano@mfano.com' : 'kontak@voorbeeld.com',
    'emergencyContacts.country': lang === 'en' ? 'Country' : lang === 'es' ? 'País' : lang === 'pt' ? 'País' : lang === 'hi' ? 'देश' : lang === 'sw' ? 'Nchi' : 'Land',
    'emergencyContacts.countryPlaceholder': lang === 'en' ? 'Country or region' : lang === 'es' ? 'País o región' : lang === 'pt' ? 'País ou região' : lang === 'hi' ? 'देश या क्षेत्र' : lang === 'sw' ? 'Nchi au mkoa' : 'Land of streek',
    'emergencyContacts.updateContact': lang === 'en' ? 'Update Contact' : lang === 'es' ? 'Actualizar contacto' : lang === 'pt' ? 'Atualizar contato' : lang === 'hi' ? 'संपर्क अपडेट करें' : lang === 'sw' ? 'Sasisha Mawasiliano' : 'Opdateer Kontak',
    'emergencyContacts.cancel': lang === 'en' ? 'Cancel' : lang === 'es' ? 'Cancelar' : lang === 'pt' ? 'Cancelar' : lang === 'hi' ? 'रद्द करें' : lang === 'sw' ? 'Ghairi' : 'Kanselleer',
    
    // Contact Types
    'contactType.personal': lang === 'en' ? 'Personal Contact' : lang === 'es' ? 'Contacto personal' : lang === 'pt' ? 'Contato pessoal' : lang === 'hi' ? 'व्यक्तिगत संपर्क' : lang === 'sw' ? 'Mawasiliano Binafsi' : 'Persoonlike Kontak',
    'contactType.embassy': lang === 'en' ? 'Embassy/Consulate' : lang === 'es' ? 'Embajada/Consulado' : lang === 'pt' ? 'Embaixada/Consulado' : lang === 'hi' ? 'दूतावास/वाणिज्य दूतावास' : lang === 'sw' ? 'Ubalozi/Ubalozi' : 'Ambassade/Konsulaat',
    'contactType.medical': lang === 'en' ? 'Medical Emergency' : lang === 'es' ? 'Emergencia médica' : lang === 'pt' ? 'Emergência médica' : lang === 'hi' ? 'चिकित्सा आपातकाल' : lang === 'sw' ? 'Dharura ya Matibabu' : 'Mediese Noodgeval',
    'contactType.legal': lang === 'en' ? 'Legal Assistance' : lang === 'es' ? 'Asistencia legal' : lang === 'pt' ? 'Assistência jurídica' : lang === 'hi' ? 'कानूनी सहायता' : lang === 'sw' ? 'Msaada wa Kisheria' : 'Regshulp',
    
    // Weather
    'weather.title': lang === 'en' ? 'Weather Forecast' : lang === 'es' ? 'Pronóstico del tiempo' : lang === 'pt' ? 'Previsão do tempo' : lang === 'hi' ? 'मौसम का पूर्वानुमान' : lang === 'sw' ? 'Utabiri wa Hali ya Hewa' : 'Weer Voorspelling',
    'weather.description': lang === 'en' ? 'Current weather and forecast for your destination' : lang === 'es' ? 'Clima actual y pronóstico para su destino' : lang === 'pt' ? 'Clima atual e previsão para o seu destino' : lang === 'hi' ? 'आपके गंतव्य के लिए वर्तमान मौसम और पूर्वानुमान' : lang === 'sw' ? 'Hali ya hewa ya sasa na utabiri kwa marudio yako' : 'Huidige weer en voorspelling vir u bestemming',
    'weather.searchLocation': lang === 'en' ? 'Search Location' : lang === 'es' ? 'Buscar ubicación' : lang === 'pt' ? 'Pesquisar localização' : lang === 'hi' ? 'स्थान खोजें' : lang === 'sw' ? 'Tafuta Mahali' : 'Soek Ligging',
    'weather.searchPlaceholder': lang === 'en' ? 'Enter city name...' : lang === 'es' ? 'Ingrese el nombre de la ciudad...' : lang === 'pt' ? 'Digite o nome da cidade...' : lang === 'hi' ? 'शहर का नाम दर्ज करें...' : lang === 'sw' ? 'Ingiza jina la mji...' : 'Voer stadnaam in...',
    'weather.searchButton': lang === 'en' ? 'Search' : lang === 'es' ? 'Buscar' : lang === 'pt' ? 'Pesquisar' : lang === 'hi' ? 'खोजें' : lang === 'sw' ? 'Tafuta' : 'Soek',
    'weather.currentLocation': lang === 'en' ? 'Current Location' : lang === 'es' ? 'Ubicación actual' : lang === 'pt' ? 'Localização atual' : lang === 'hi' ? 'वर्तमान स्थान' : lang === 'sw' ? 'Mahali pa Sasa' : 'Huidige Ligging',
    'weather.forecastTitle': lang === 'en' ? '5-Day Forecast' : lang === 'es' ? 'Pronóstico de 5 días' : lang === 'pt' ? 'Previsão de 5 dias' : lang === 'hi' ? '5-दिन का पूर्वानुमान' : lang === 'sw' ? 'Utabiri wa Siku 5' : '5-Dag Voorspelling',
    'weather.humidity': lang === 'en' ? 'Humidity' : lang === 'es' ? 'Humedad' : lang === 'pt' ? 'Umidade' : lang === 'hi' ? 'आर्द्रता' : lang === 'sw' ? 'Unyevunyevu' : 'Humiditeit',
    'weather.wind': lang === 'en' ? 'Wind' : lang === 'es' ? 'Viento' : lang === 'pt' ? 'Vento' : lang === 'hi' ? 'हवा' : lang === 'sw' ? 'Upepo' : 'Wind',
    'weather.visibility': lang === 'en' ? 'Visibility' : lang === 'es' ? 'Visibilidad' : lang === 'pt' ? 'Visibilidade' : lang === 'hi' ? 'दृश्यता' : lang === 'sw' ? 'Uonekano' : 'Sigbaarheid',
    'weather.uvLow': lang === 'en' ? 'Low' : lang === 'es' ? 'Bajo' : lang === 'pt' ? 'Baixo' : lang === 'hi' ? 'कम' : lang === 'sw' ? 'Chini' : 'Laag',
    'weather.uvModerate': lang === 'en' ? 'Moderate' : lang === 'es' ? 'Moderado' : lang === 'pt' ? 'Moderado' : lang === 'hi' ? 'मध्यम' : lang === 'sw' ? 'Wastani' : 'Matig',
    'weather.uvHigh': lang === 'en' ? 'High' : lang === 'es' ? 'Alto' : lang === 'pt' ? 'Alto' : lang === 'hi' ? 'उच्च' : lang === 'sw' ? 'Juu' : 'Hoog',
    'weather.uvVeryHigh': lang === 'en' ? 'Very High' : lang === 'es' ? 'Muy alto' : lang === 'pt' ? 'Muito alto' : lang === 'hi' ? 'बहुत उच्च' : lang === 'sw' ? 'Juu Sana' : 'Baie Hoog',
    'weather.uvExtreme': lang === 'en' ? 'Extreme' : lang === 'es' ? 'Extremo' : lang === 'pt' ? 'Extremo' : lang === 'hi' ? 'चरम' : lang === 'sw' ? 'Kupindukia' : 'Uiters',
    'weather.lastUpdated': lang === 'en' ? 'Last updated:' : lang === 'es' ? 'Última actualización:' : lang === 'pt' ? 'Última atualização:' : lang === 'hi' ? 'अंतिम अपडेट:' : lang === 'sw' ? 'Imesasishwa:' : 'Laaste opdatering:',
    'weather.today': lang === 'en' ? 'Today' : lang === 'es' ? 'Hoy' : lang === 'pt' ? 'Hoje' : lang === 'hi' ? 'आज' : lang === 'sw' ? 'Leo' : 'Vandag',
    'weather.tomorrow': lang === 'en' ? 'Tomorrow' : lang === 'es' ? 'Mañana' : lang === 'pt' ? 'Amanhã' : lang === 'hi' ? 'कल' : lang === 'sw' ? 'Kesho' : 'Môre',
    
    // Currency Tracker
    'currency.title': lang === 'en' ? 'Currency Tracker' : lang === 'es' ? 'Rastreador de monedas' : lang === 'pt' ? 'Rastreador de moedas' : lang === 'hi' ? 'मुद्रा ट्रैकर' : lang === 'sw' ? 'Kifuatiliaji cha Sarafu' : 'Geldeenheid Opvolger',
    'currency.description': lang === 'en' ? 'Real-time exchange rates for your travels' : lang === 'es' ? 'Tipos de cambio en tiempo real para sus viajes' : lang === 'pt' ? 'Taxas de câmbio em tempo real para suas viagens' : lang === 'hi' ? 'आपकी यात्राओं के लिए वास्तविक समय विनिमय दरें' : lang === 'sw' ? 'Viwango vya ubadilishanaji wa wakati halisi kwa safari zako' : 'Intydse wisselkoerse vir u reise',
    'currency.amount': lang === 'en' ? 'Amount' : lang === 'es' ? 'Cantidad' : lang === 'pt' ? 'Quantia' : lang === 'hi' ? 'राशि' : lang === 'sw' ? 'Kiasi' : 'Bedrag',
    'currency.baseCurrency': lang === 'en' ? 'Base Currency' : lang === 'es' ? 'Moneda base' : lang === 'pt' ? 'Moeda base' : lang === 'hi' ? 'आधार मुद्रा' : lang === 'sw' ? 'Sarafu ya Msingi' : 'Basis Geldeenheid',
    'currency.lastUpdated': lang === 'en' ? 'Last updated:' : lang === 'es' ? 'Última actualización:' : lang === 'pt' ? 'Última atualização:' : lang === 'hi' ? 'अंतिम अपडेट:' : lang === 'sw' ? 'Imesasishwa:' : 'Laaste opdatering:',
    'currency.never': lang === 'en' ? 'Never' : lang === 'es' ? 'Nunca' : lang === 'pt' ? 'Nunca' : lang === 'hi' ? 'कभी नहीं' : lang === 'sw' ? 'Kamwe' : 'Nooit',
    'currency.refresh': lang === 'en' ? 'Refresh' : lang === 'es' ? 'Actualizar' : lang === 'pt' ? 'Atualizar' : lang === 'hi' ? 'रीफ्रेश करें' : lang === 'sw' ? 'Sasisha' : 'Verfris',
    'currency.addCurrency': lang === 'en' ? 'Add Currency' : lang === 'es' ? 'Agregar moneda' : lang === 'pt' ? 'Adicionar moeda' : lang === 'hi' ? 'मुद्रा जोड़ें' : lang === 'sw' ? 'Ongeza Sarafu' : 'Voeg Geldeenheid By',
    
    // Toast Messages
    'toast.countryAdded': lang === 'en' ? 'Country Added' : lang === 'es' ? 'País agregado' : lang === 'pt' ? 'País adicionado' : lang === 'hi' ? 'देश जोड़ा गया' : lang === 'sw' ? 'Nchi Imeongezwa' : 'Land Bygevoeg',
    'toast.countryAddedDesc': lang === 'en' ? 'Now tracking {country}' : lang === 'es' ? 'Ahora rastreando {country}' : lang === 'pt' ? 'Agora rastreando {country}' : lang === 'hi' ? 'अब {country} ट्रैक कर रहे हैं' : lang === 'sw' ? 'Sasa inafuatilia {country}' : 'Volg nou {country} op',
    'toast.countryRemoved': lang === 'en' ? 'Country Removed' : lang === 'es' ? 'País eliminado' : lang === 'pt' ? 'País removido' : lang === 'hi' ? 'देश हटाया गया' : lang === 'sw' ? 'Nchi Imeondolewa' : 'Land Verwyder',
    'toast.countryRemovedDesc': lang === 'en' ? 'Country removed from tracking' : lang === 'es' ? 'País eliminado del seguimiento' : lang === 'pt' ? 'País removido do rastreamento' : lang === 'hi' ? 'देश ट्रैकिंग से हटाया गया' : lang === 'sw' ? 'Nchi imeondolewa kutoka kufuatiliwa' : 'Land verwyder van opvolging',
    'toast.locationConfirmed': lang === 'en' ? 'Location Confirmed' : lang === 'es' ? 'Ubicación confirmada' : lang === 'pt' ? 'Localização confirmada' : lang === 'hi' ? 'स्थान की पुष्टि की गई' : lang === 'sw' ? 'Mahali Pamethibitishwa' : 'Ligging Bevestig',
    'toast.locationConfirmedDesc': lang === 'en' ? 'Using detected location for travel tracking' : lang === 'es' ? 'Usando la ubicación detectada para el seguimiento de viajes' : lang === 'pt' ? 'Usando a localização detectada para rastreamento de viagens' : lang === 'hi' ? 'यात्रा ट्रैकिंग के लिए पता लगाए गए स्थान का उपयोग करना' : lang === 'sw' ? 'Kutumia mahali palilogunduliwa kwa ufuatiliaji wa safari' : 'Gebruik bespeurde ligging vir reis opvolging',
    'toast.locationCorrection': lang === 'en' ? 'Location Correction Needed' : lang === 'es' ? 'Corrección de ubicación necesaria' : lang === 'pt' ? 'Correção de localização necessária' : lang === 'hi' ? 'स्थान सुधार की आवश्यकता है' : lang === 'sw' ? 'Marekebisho ya Mahali Yanahitajika' : 'Ligging Regstelling Nodig',
    'toast.locationCorrectionDesc': lang === 'en' ? 'Please manually update your location' : lang === 'es' ? 'Por favor actualice manualmente su ubicación' : lang === 'pt' ? 'Por favor, atualize manualmente sua localização' : lang === 'hi' ? 'कृपया अपना स्थान मैन्युअल रूप से अपडेट करें' : lang === 'sw' ? 'Tafadhali sasisha mahali pako kwa mikono' : 'Dateer asseblief u ligging handmatig op',
    'toast.vpnInstructions': lang === 'en' ? 'VPN Instructions' : lang === 'es' ? 'Instrucciones de VPN' : lang === 'pt' ? 'Instruções de VPN' : lang === 'hi' ? 'VPN निर्देश' : lang === 'sw' ? 'Maelekezo ya VPN' : 'VPN Instruksies',
    'toast.vpnInstructionsDesc': lang === 'en' ? 'Please disable your VPN temporarily for accurate location tracking' : lang === 'es' ? 'Por favor desactive su VPN temporalmente para un seguimiento de ubicación preciso' : lang === 'pt' ? 'Por favor, desative sua VPN temporariamente para rastreamento de localização preciso' : lang === 'hi' ? 'सटीक स्थान ट्रैकिंग के लिए कृपया अपना VPN अस्थायी रूप से अक्षम करें' : lang === 'sw' ? 'Tafadhali zima VPN yako kwa muda kwa ufuatiliaji sahihi wa mahali' : 'Deaktiveer asseblief u VPN tydelik vir akkurate ligging opvolging',
    'toast.planUpgraded': lang === 'en' ? 'Plan Upgraded Successfully!' : lang === 'es' ? '¡Plan actualizado con éxito!' : lang === 'pt' ? 'Plano atualizado com sucesso!' : lang === 'hi' ? 'योजना सफलतापूर्वक अपग्रेड की गई!' : lang === 'sw' ? 'Mpango Umeboreshwa Kwa Mafanikio!' : 'Plan Suksesvol Opgegradeer!',
    'toast.planUpgradedDesc': lang === 'en' ? 'Welcome to {tier} plan! All features are now active.' : lang === 'es' ? '¡Bienvenido al plan {tier}! Todas las funciones ahora están activas.' : lang === 'pt' ? 'Bem-vindo ao plano {tier}! Todos os recursos agora estão ativos.' : lang === 'hi' ? '{tier} योजना में आपका स्वागत है! सभी सुविधाएं अब सक्रिय हैं।' : lang === 'sw' ? 'Karibu kwenye mpango {tier}! Vipengele vyote sasa ni hai.' : 'Welkom by die {tier} plan! Alle funksies is nou aktief.',
  };
});

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('app_language');
    return saved && ['en', 'es', 'pt', 'zh', 'fr', 'de', 'ar', 'ja', 'it', 'ko', 'hi', 'sw', 'af'].includes(saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', currentLanguage);
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
  };

  const setLanguage = (code: string) => {
    if (['en', 'es', 'pt', 'hi', 'sw', 'af'].includes(code)) {
      setCurrentLanguage(code);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
