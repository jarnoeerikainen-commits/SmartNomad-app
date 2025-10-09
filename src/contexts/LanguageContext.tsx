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
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    // App Header & Navigation
    'app.title': 'TravelTracker',
    'app.tagline': 'Your global travel companion',
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
};

// Add comprehensive translation keys for all languages
Object.keys(translations).forEach(lang => {
  translations[lang] = {
    ...translations[lang],
    // Common
    'common.free': lang === 'en' ? 'Free' : lang === 'es' ? 'Gratis' : lang === 'pt' ? 'Grátis' : lang === 'hi' ? 'मुफ़्त' : lang === 'sw' ? 'Bure' : 'Gratis',
    
    // Document Tracker
    'doc.track_description': lang === 'en' ? 'Track your passports and driving licenses with expiry monitoring' : lang === 'es' ? 'Rastree sus pasaportes y licencias de conducir con monitoreo de vencimiento' : lang === 'pt' ? 'Rastreie seus passaportes e carteiras de motorista com monitoramento de validade' : lang === 'hi' ? 'समाप्ति निगरानी के साथ अपने पासपोर्ट और ड्राइविंग लाइसेंस ट्रैक करें' : lang === 'sw' ? 'Fuatilia pasi na leseni zako za kuendesha na ufuatiliaji wa kumalizika' : 'Volg u paspoort en rybewys met vervaldatum monitering',
    'doc.no_passports': lang === 'en' ? 'No passports tracked yet' : lang === 'es' ? 'Aún no se rastrean pasaportes' : lang === 'pt' ? 'Nenhum passaporte rastreado ainda' : lang === 'hi' ? 'अभी तक कोई पासपोर्ट ट्रैक नहीं किया गया' : lang === 'sw' ? 'Hakuna pasi zilizofuatiliwa bado' : 'Nog geen paspoort opgevolg nie',
    'doc.no_licenses': lang === 'en' ? 'No licenses tracked yet' : lang === 'es' ? 'Aún no se rastrean licencias' : lang === 'pt' ? 'Nenhuma licença rastreada ainda' : lang === 'hi' ? 'अभी तक कोई लाइसेंस ट्रैक नहीं किया गया' : lang === 'sw' ? 'Hakuna leseni zilizofuatiliwa bado' : 'Nog geen lisensies opgevolg nie',
    'doc.add_passport': lang === 'en' ? 'Add Passport' : lang === 'es' ? 'Agregar pasaporte' : lang === 'pt' ? 'Adicionar passaporte' : lang === 'hi' ? 'पासपोर्ट जोड़ें' : lang === 'sw' ? 'Ongeza Pasi' : 'Voeg Paspoort By',
    'doc.add_license': lang === 'en' ? 'Add License' : lang === 'es' ? 'Agregar licencia' : lang === 'pt' ? 'Adicionar licença' : lang === 'hi' ? 'लाइसेंस जोड़ें' : lang === 'sw' ? 'Ongeza Leseni' : 'Voeg Lisensie By',
    'doc.expired': lang === 'en' ? 'Expired' : lang === 'es' ? 'Vencido' : lang === 'pt' ? 'Expirado' : lang === 'hi' ? 'समाप्त' : lang === 'sw' ? 'Imeisha' : 'Verstreke',
    'doc.expiring_soon': lang === 'en' ? 'Expiring Soon' : lang === 'es' ? 'Vence pronto' : lang === 'pt' ? 'Expirando em breve' : lang === 'hi' ? 'जल्द समाप्त हो रहा है' : lang === 'sw' ? 'Inaisha Hivi Karibuni' : 'Verval Binnekort',
    'doc.valid': lang === 'en' ? 'Valid' : lang === 'es' ? 'Válido' : lang === 'pt' ? 'Válido' : lang === 'hi' ? 'वैध' : lang === 'sw' ? 'Halali' : 'Geldig',
    'doc.expires': lang === 'en' ? 'Expires' : lang === 'es' ? 'Vence' : lang === 'pt' ? 'Expira' : lang === 'hi' ? 'समाप्त होता है' : lang === 'sw' ? 'Inaisha' : 'Verval',
    'doc.country_state': lang === 'en' ? 'Country/State' : lang === 'es' ? 'País/Estado' : lang === 'pt' ? 'País/Estado' : lang === 'hi' ? 'देश/राज्य' : lang === 'sw' ? 'Nchi/Jimbo' : 'Land/Staat',
    'doc.license_class': lang === 'en' ? 'License Class' : lang === 'es' ? 'Clase de licencia' : lang === 'pt' ? 'Classe de licença' : lang === 'hi' ? 'लाइसेंस वर्ग' : lang === 'sw' ? 'Darasa la Leseni' : 'Lisensie Klas',
    'doc.issue_date': lang === 'en' ? 'Issue Date' : lang === 'es' ? 'Fecha de emisión' : lang === 'pt' ? 'Data de emissão' : lang === 'hi' ? 'जारी करने की तिथि' : lang === 'sw' ? 'Tarehe ya Kutolewa' : 'Uitgiftedatum',
    'doc.expiry_date': lang === 'en' ? 'Expiry Date' : lang === 'es' ? 'Fecha de vencimiento' : lang === 'pt' ? 'Data de validade' : lang === 'hi' ? 'समाप्ति तिथि' : lang === 'sw' ? 'Tarehe ya Kumalizika' : 'Vervaldatum',
    'doc.issuing_authority': lang === 'en' ? 'Issuing Authority' : lang === 'es' ? 'Autoridad emisora' : lang === 'pt' ? 'Autoridade emissora' : lang === 'hi' ? 'जारी करने वाला प्राधिकरण' : lang === 'sw' ? 'Mamlaka ya Kutoa' : 'Uitreik Owerheid',
    'doc.notes': lang === 'en' ? 'Notes' : lang === 'es' ? 'Notas' : lang === 'pt' ? 'Notas' : lang === 'hi' ? 'नोट्स' : lang === 'sw' ? 'Maelezo' : 'Nota',
    'doc.missing_info': lang === 'en' ? 'Missing information' : lang === 'es' ? 'Falta información' : lang === 'pt' ? 'Informação ausente' : lang === 'hi' ? 'जानकारी गायब है' : lang === 'sw' ? 'Habari inayokosekana' : 'Ontbrekende inligting',
    'doc.fill_required': lang === 'en' ? 'Please fill in all required fields' : lang === 'es' ? 'Por favor complete todos los campos requeridos' : lang === 'pt' ? 'Por favor, preencha todos os campos obrigatórios' : lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : lang === 'sw' ? 'Tafadhali jaza sehemu zote zinazohitajika' : 'Vul asseblief alle vereiste velde in',
    
    // Expense Tracker
    'expense.business_tracker': lang === 'en' ? 'Business Expense Tracker' : lang === 'es' ? 'Rastreador de gastos empresariales' : lang === 'pt' ? 'Rastreador de despesas empresariais' : lang === 'hi' ? 'व्यावसायिक व्यय ट्रैकर' : lang === 'sw' ? 'Kifuatiliaji cha Gharama za Biashara' : 'Sake-onkoste Opvolger',
    'expense.add_expense': lang === 'en' ? 'Add Expense' : lang === 'es' ? 'Agregar gasto' : lang === 'pt' ? 'Adicionar despesa' : lang === 'hi' ? 'खर्च जोड़ें' : lang === 'sw' ? 'Ongeza Gharama' : 'Voeg Onkoste By',
    'expense.tax_report': lang === 'en' ? 'Tax Report' : lang === 'es' ? 'Informe fiscal' : lang === 'pt' ? 'Relatório fiscal' : lang === 'hi' ? 'कर रिपोर्ट' : lang === 'sw' ? 'Ripoti ya Kodi' : 'Belasting Verslag',
    'expense.total_expenses': lang === 'en' ? 'Total Expenses' : lang === 'es' ? 'Gastos totales' : lang === 'pt' ? 'Despesas totais' : lang === 'hi' ? 'कुल खर्च' : lang === 'sw' ? 'Gharama Jumla' : 'Totale Onkostes',
    'expense.total_receipts': lang === 'en' ? 'Total Receipts' : lang === 'es' ? 'Recibos totales' : lang === 'pt' ? 'Recibos totais' : lang === 'hi' ? 'कुल रसीदें' : lang === 'sw' ? 'Risiti Jumla' : 'Totale Kwitansies',
    'expense.tax_deductible': lang === 'en' ? 'Tax Deductible' : lang === 'es' ? 'Deducible de impuestos' : lang === 'pt' ? 'Dedutível de impostos' : lang === 'hi' ? 'कर कटौती योग्य' : lang === 'sw' ? 'Inayotozwa Kodi' : 'Belasting Aftrekbaar',
    'expense.quick_actions': lang === 'en' ? 'Quick Actions' : lang === 'es' ? 'Acciones rápidas' : lang === 'pt' ? 'Ações rápidas' : lang === 'hi' ? 'त्वरित क्रियाएं' : lang === 'sw' ? 'Vitendo vya Haraka' : 'Vinnige Aksies',
    'expense.recent_expenses': lang === 'en' ? 'Recent Expenses' : lang === 'es' ? 'Gastos recientes' : lang === 'pt' ? 'Despesas recentes' : lang === 'hi' ? 'हाल के खर्च' : lang === 'sw' ? 'Gharama za Hivi Karibuni' : 'Onlangse Onkostes',
    'expense.no_expenses': lang === 'en' ? 'No expenses recorded yet. Add your first expense to get started.' : lang === 'es' ? 'Aún no se han registrado gastos. Agregue su primer gasto para comenzar.' : lang === 'pt' ? 'Nenhuma despesa registrada ainda. Adicione sua primeira despesa para começar.' : lang === 'hi' ? 'अभी तक कोई खर्च दर्ज नहीं किया गया। शुरू करने के लिए अपना पहला खर्च जोड़ें।' : lang === 'sw' ? 'Hakuna gharama zilizoandikwa bado. Ongeza gharama yako ya kwanza ili kuanza.' : 'Geen onkostes nog aangeteken nie. Voeg u eerste onkoste by om te begin.',
    'expense.type': lang === 'en' ? 'Expense Type' : lang === 'es' ? 'Tipo de gasto' : lang === 'pt' ? 'Tipo de despesa' : lang === 'hi' ? 'खर्च प्रकार' : lang === 'sw' ? 'Aina ya Gharama' : 'Onkoste Tipe',
    'expense.country': lang === 'en' ? 'Country' : lang === 'es' ? 'País' : lang === 'pt' ? 'País' : lang === 'hi' ? 'देश' : lang === 'sw' ? 'Nchi' : 'Land',
    'expense.amount': lang === 'en' ? 'Amount' : lang === 'es' ? 'Cantidad' : lang === 'pt' ? 'Quantia' : lang === 'hi' ? 'राशि' : lang === 'sw' ? 'Kiasi' : 'Bedrag',
    'expense.currency': lang === 'en' ? 'Currency' : lang === 'es' ? 'Moneda' : lang === 'pt' ? 'Moeda' : lang === 'hi' ? 'मुद्रा' : lang === 'sw' ? 'Sarafu' : 'Geldeenheid',
    'expense.date': lang === 'en' ? 'Date' : lang === 'es' ? 'Fecha' : lang === 'pt' ? 'Data' : lang === 'hi' ? 'तारीख' : lang === 'sw' ? 'Tarehe' : 'Datum',
    'expense.description': lang === 'en' ? 'Description' : lang === 'es' ? 'Descripción' : lang === 'pt' ? 'Descrição' : lang === 'hi' ? 'विवरण' : lang === 'sw' ? 'Maelezo' : 'Beskrywing',
    'expense.vendor': lang === 'en' ? 'Vendor/Company' : lang === 'es' ? 'Proveedor/Empresa' : lang === 'pt' ? 'Fornecedor/Empresa' : lang === 'hi' ? 'विक्रेता/कंपनी' : lang === 'sw' ? 'Muuzaji/Kampuni' : 'Verskaffer/Maatskappy',
    'expense.payment_method': lang === 'en' ? 'Payment Method' : lang === 'es' ? 'Método de pago' : lang === 'pt' ? 'Método de pagamento' : lang === 'hi' ? 'भुगतान का तरीका' : lang === 'sw' ? 'Njia ya Malipo' : 'Betaling Metode',
    'expense.receipt_image': lang === 'en' ? 'Receipt Image' : lang === 'es' ? 'Imagen del recibo' : lang === 'pt' ? 'Imagem do recibo' : lang === 'hi' ? 'रसीद छवि' : lang === 'sw' ? 'Picha ya Risiti' : 'Kwitansie Beeld',
    'expense.scan_receipt': lang === 'en' ? 'Scan Receipt' : lang === 'es' ? 'Escanear recibo' : lang === 'pt' ? 'Digitalizar recibo' : lang === 'hi' ? 'रसीद स्कैन करें' : lang === 'sw' ? 'Changanua Risiti' : 'Skandeer Kwitansie',
    
    // Smart Alerts
    'alerts.intelligent': lang === 'en' ? 'Intelligent alerts for visa limits, document expiry, and tax compliance' : lang === 'es' ? 'Alertas inteligentes para límites de visa, vencimiento de documentos y cumplimiento fiscal' : lang === 'pt' ? 'Alertas inteligentes para limites de visto, validade de documentos e conformidade fiscal' : lang === 'hi' ? 'वीज़ा सीमा, दस्तावेज़ समाप्ति और कर अनुपालन के लिए बुद्धिमान अलर्ट' : lang === 'sw' ? 'Arifa za akili kwa mipaka ya visa, kumalizika kwa hati, na ufuasi wa kodi' : 'Intelligente waarskuwings vir visabeperkings, dokument verval en belasting nakoming',
    'alerts.critical_action': lang === 'en' ? 'Critical Alerts Require Immediate Action' : lang === 'es' ? 'Las alertas críticas requieren acción inmediata' : lang === 'pt' ? 'Alertas críticos requerem ação imediata' : lang === 'hi' ? 'गंभीर अलर्ट को तत्काल कार्रवाई की आवश्यकता है' : lang === 'sw' ? 'Arifa Muhimu Zinahitaji Hatua za Haraka' : 'Kritieke Waarskuwings Vereis Onmiddellike Aksie',
    'alerts.no_alerts': lang === 'en' ? 'No active alerts' : lang === 'es' ? 'No hay alertas activas' : lang === 'pt' ? 'Sem alertas ativos' : lang === 'hi' ? 'कोई सक्रिय अलर्ट नहीं' : lang === 'sw' ? 'Hakuna arifa zinazotumika' : 'Geen aktiewe waarskuwings',
    'alerts.all_caught_up': lang === 'en' ? "You're all caught up!" : lang === 'es' ? '¡Estás al día!' : lang === 'pt' ? 'Você está em dia!' : lang === 'hi' ? 'आप सभी पकड़ में हैं!' : lang === 'sw' ? 'Umekamilisha yote!' : 'Jy is op datum!',
    'alerts.suggested_actions': lang === 'en' ? 'Suggested actions' : lang === 'es' ? 'Acciones sugeridas' : lang === 'pt' ? 'Ações sugeridas' : lang === 'hi' ? 'सुझाए गए कार्य' : lang === 'sw' ? 'Vitendo vilivyopendekezwa' : 'Voorgestelde aksies',
    'alerts.notification_prefs': lang === 'en' ? 'Notification Preferences' : lang === 'es' ? 'Preferencias de notificación' : lang === 'pt' ? 'Preferências de notificação' : lang === 'hi' ? 'सूचना प्राथमिकताएं' : lang === 'sw' ? 'Mapendeleo ya Taarifa' : 'Kennisgewing Voorkeure',
    'alerts.push_notifications': lang === 'en' ? 'Push Notifications' : lang === 'es' ? 'Notificaciones push' : lang === 'pt' ? 'Notificações push' : lang === 'hi' ? 'पुश सूचनाएं' : lang === 'sw' ? 'Taarifa za Kusukuma' : 'Stoot Kennisgewings',
    'alerts.email_alerts': lang === 'en' ? 'Email Alerts' : lang === 'es' ? 'Alertas por correo' : lang === 'pt' ? 'Alertas por e-mail' : lang === 'hi' ? 'ईमेल अलर्ट' : lang === 'sw' ? 'Arifa za Barua pepe' : 'E-pos Waarskuwings',
    'alerts.daily_digest': lang === 'en' ? 'Daily Digest' : lang === 'es' ? 'Resumen diario' : lang === 'pt' ? 'Resumo diário' : lang === 'hi' ? 'दैनिक सारांश' : lang === 'sw' ? 'Muhtasari wa Kila Siku' : 'Daaglikse Opsomming',
    'alerts.smart_predictions': lang === 'en' ? 'Smart Predictions' : lang === 'es' ? 'Predicciones inteligentes' : lang === 'pt' ? 'Previsões inteligentes' : lang === 'hi' ? 'स्मार्ट भविष्यवाणियां' : lang === 'sw' ? 'Utabiri wa Akili' : 'Slim Voorspellings',
    
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
    return saved && ['en', 'es', 'pt', 'hi', 'sw', 'af'].includes(saved) ? saved : 'en';
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
