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
    'quick.upload_documents': 'Upload Documents',
    'quick.check_visas': 'Check Visas',
    'quick.view_alerts': 'View Alerts',
    
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
    'quick.add_country': 'Agregar país',
    'quick.upload_documents': 'Subir documentos',
    'quick.check_visas': 'Verificar visas',
    'quick.view_alerts': 'Ver alertas',
    
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
    'quick.add_country': 'Adicionar país',
    'quick.upload_documents': 'Enviar documentos',
    'quick.check_visas': 'Verificar vistos',
    'quick.view_alerts': 'Ver alertas',
    
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
    'quick.upload_documents': 'दस्तावेज़ अपलोड करें',
    'quick.check_visas': 'वीज़ा जांचें',
    'quick.view_alerts': 'अलर्ट देखें',
    
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
    'quick.upload_documents': 'Pakia Hati',
    'quick.check_visas': 'Angalia Visa',
    'quick.view_alerts': 'Tazama Arifa',
    
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
    // Header
    'app.title': 'TravelTracker',
    'app.tagline': 'Jou globale reisgenoot',
    'header.profile': 'Profiel',
    'header.profile_settings': 'Profielinstellings',
    'header.app_settings': 'Programinstellings',
    'header.upgrade_plan': 'Gradeer Plan Op',
    'header.privacy_data': 'Privaatheid en Data',
    'header.sign_out': 'Teken Uit',
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Reisopsporing',
    'nav.tax': 'Belastingverblyf',
    'nav.visas': 'Visabestuurder',
    'nav.documents': 'Dokumente',
    'nav.health': 'Gesondheid en Entstowwe',
    'nav.news': 'Reisnuus',
    'nav.alerts': 'Slim Waarskuwings',
    'nav.services': 'Reisdienste',
    'nav.settings': 'Instellings',
    'nav.help': 'Hulp en Ondersteuning',
    'nav.footer_version': 'TravelTracker v2.0',
    'nav.footer_tagline': 'Bly wêreldwyd voldoend',
    
    // Dashboard Stats
    'stats.countries_tracked': 'Lande Opgespoor',
    'stats.active_destinations': 'Aktiewe bestemmings',
    'stats.critical_alerts': 'Kritieke Waarskuwings',
    'stats.require_attention': 'Benodig aandag',
    
    // Quick Actions
    'quick.title': 'Vinnige Aksies',
    'quick.add_country': 'Voeg Land By',
    'quick.upload_documents': 'Laai Dokumente Op',
    'quick.check_visas': 'Kyk Visas',
    'quick.view_alerts': 'Sien Waarskuwings',
    
    // AI Assistant
    'ai.title': 'KI Reis Assistent',
    'ai.typing': 'KI is besig om te tik...',
    
    // Document Tracker
    'doc.title': 'Dokumentopsporingstelsel',
    'doc.passports': 'Pasporte',
    'doc.licenses': 'Lisensies',
    
    // Expense Tracker
    'expense.title': 'Sake-onkosteopsporder',
    
    // Smart Alerts
    'alerts.title': 'Slim Waarskuwings en Kennisgewings',
    'alerts.settings': 'Instellings',
    
    // Passport Manager
    'passport.title': 'Paspoortbestuurder',
    
    // User Profile
    'profile.title': 'Gebruikersprofiel en Voorkeure',
    
    // Tax Residency
    'tax.title': 'Belastingverblyf en Nakoming Sentrum',
    
    // Common
    'common.save': 'Stoor',
    'common.cancel': 'Kanselleer',
    'common.close': 'Sluit',
  },
};

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
