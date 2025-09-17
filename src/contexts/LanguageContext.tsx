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

const translations = {
  en: {
    // Header
    'app.title': 'Travel Day Counter',
    'nav.dashboard': 'Dashboard',
    'nav.tracking': 'Tracking',
    'nav.tax': 'Tax Residency',
    'nav.visas': 'Visas',
    'nav.documents': 'Documents',
    'nav.health': 'Health',
    'nav.news': 'News',
    'nav.alerts': 'Alerts',
    'nav.services': 'Services',
    'nav.settings': 'Settings',
    
    // Tax Residency
    'tax.title': 'Tax Residency & Compliance Center',
    'tax.description': 'Comprehensive tax residency tracking, compliance monitoring, and planning tools',
    'tax.select_jurisdiction': 'Select your primary tax jurisdiction:',
    'tax.global_overview': 'Global Overview',
    'tax.united_states': 'United States',
    'tax.canada': 'Canada',
    'tax.days_spent': 'Days spent:',
    'tax.tax_resident': '⚠️ Tax resident',
    'tax.days_remaining': 'days remaining',
    'tax.no_countries': 'No countries tracked yet. Add countries to start monitoring tax residency.',
    
    // Countries
    'countries.afghanistan': 'Afghanistan',
    'countries.albania': 'Albania',
    'countries.algeria': 'Algeria',
    'countries.argentina': 'Argentina',
    'countries.australia': 'Australia',
    'countries.austria': 'Austria',
    'countries.brazil': 'Brazil',
    'countries.canada': 'Canada',
    'countries.china': 'China',
    'countries.france': 'France',
    'countries.germany': 'Germany',
    'countries.india': 'India',
    'countries.italy': 'Italy',
    'countries.japan': 'Japan',
    'countries.mexico': 'Mexico',
    'countries.netherlands': 'Netherlands',
    'countries.portugal': 'Portugal',
    'countries.russia': 'Russia',
    'countries.south_africa': 'South Africa',
    'countries.spain': 'Spain',
    'countries.sweden': 'Sweden',
    'countries.switzerland': 'Switzerland',
    'countries.united_kingdom': 'United Kingdom',
    'countries.united_states': 'United States',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.upgrade': 'Upgrade',
    'common.free': 'Free',
    'common.premium': 'Premium',
    'common.pro': 'Pro',
  },
  es: {
    // Header
    'app.title': 'Contador de Días de Viaje',
    'nav.dashboard': 'Panel',
    'nav.tracking': 'Seguimiento',
    'nav.tax': 'Residencia Fiscal',
    'nav.visas': 'Visas',
    'nav.documents': 'Documentos',
    'nav.health': 'Salud',
    'nav.news': 'Noticias',
    'nav.alerts': 'Alertas',
    'nav.services': 'Servicios',
    'nav.settings': 'Configuración',
    
    // Tax Residency
    'tax.title': 'Centro de Residencia Fiscal y Cumplimiento',
    'tax.description': 'Seguimiento integral de residencia fiscal, monitoreo de cumplimiento y herramientas de planificación',
    'tax.select_jurisdiction': 'Seleccione su jurisdicción fiscal principal:',
    'tax.global_overview': 'Vista General Global',
    'tax.united_states': 'Estados Unidos',
    'tax.canada': 'Canadá',
    'tax.days_spent': 'Días gastados:',
    'tax.tax_resident': '⚠️ Residente fiscal',
    'tax.days_remaining': 'días restantes',
    'tax.no_countries': 'Aún no se han rastreado países. Agregue países para comenzar a monitorear la residencia fiscal.',
    
    // Countries
    'countries.afghanistan': 'Afganistán',
    'countries.albania': 'Albania',
    'countries.algeria': 'Argelia',
    'countries.argentina': 'Argentina',
    'countries.australia': 'Australia',
    'countries.austria': 'Austria',
    'countries.brazil': 'Brasil',
    'countries.canada': 'Canadá',
    'countries.china': 'China',
    'countries.france': 'Francia',
    'countries.germany': 'Alemania',
    'countries.india': 'India',
    'countries.italy': 'Italia',
    'countries.japan': 'Japón',
    'countries.mexico': 'México',
    'countries.netherlands': 'Países Bajos',
    'countries.portugal': 'Portugal',
    'countries.russia': 'Rusia',
    'countries.south_africa': 'Sudáfrica',
    'countries.spain': 'España',
    'countries.sweden': 'Suecia',
    'countries.switzerland': 'Suiza',
    'countries.united_kingdom': 'Reino Unido',
    'countries.united_states': 'Estados Unidos',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.add': 'Agregar',
    'common.remove': 'Eliminar',
    'common.upgrade': 'Actualizar',
    'common.free': 'Gratis',
    'common.premium': 'Premium',
    'common.pro': 'Pro',
  },
  pt: {
    // Header
    'app.title': 'Contador de Dias de Viagem',
    'nav.dashboard': 'Painel',
    'nav.tracking': 'Rastreamento',
    'nav.tax': 'Residência Fiscal',
    'nav.visas': 'Vistos',
    'nav.documents': 'Documentos',
    'nav.health': 'Saúde',
    'nav.news': 'Notícias',
    'nav.alerts': 'Alertas',
    'nav.services': 'Serviços',
    'nav.settings': 'Configurações',
    
    // Tax Residency
    'tax.title': 'Centro de Residência Fiscal e Conformidade',
    'tax.description': 'Rastreamento abrangente de residência fiscal, monitoramento de conformidade e ferramentas de planejamento',
    'tax.select_jurisdiction': 'Selecione sua jurisdição fiscal principal:',
    'tax.global_overview': 'Visão Geral Global',
    'tax.united_states': 'Estados Unidos',
    'tax.canada': 'Canadá',
    'tax.days_spent': 'Dias gastos:',
    'tax.tax_resident': '⚠️ Residente fiscal',
    'tax.days_remaining': 'dias restantes',
    'tax.no_countries': 'Nenhum país rastreado ainda. Adicione países para começar a monitorar a residência fiscal.',
    
    // Countries
    'countries.afghanistan': 'Afeganistão',
    'countries.albania': 'Albânia',
    'countries.algeria': 'Argélia',
    'countries.argentina': 'Argentina',
    'countries.australia': 'Austrália',
    'countries.austria': 'Áustria',
    'countries.brazil': 'Brasil',
    'countries.canada': 'Canadá',
    'countries.china': 'China',
    'countries.france': 'França',
    'countries.germany': 'Alemanha',
    'countries.india': 'Índia',
    'countries.italy': 'Itália',
    'countries.japan': 'Japão',
    'countries.mexico': 'México',
    'countries.netherlands': 'Países Baixos',
    'countries.portugal': 'Portugal',
    'countries.russia': 'Rússia',
    'countries.south_africa': 'África do Sul',
    'countries.spain': 'Espanha',
    'countries.sweden': 'Suécia',
    'countries.switzerland': 'Suíça',
    'countries.united_kingdom': 'Reino Unido',
    'countries.united_states': 'Estados Unidos',
    
    // Common
    'common.loading': 'Carregando...',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.close': 'Fechar',
    'common.add': 'Adicionar',
    'common.remove': 'Remover',
    'common.upgrade': 'Atualizar',
    'common.free': 'Grátis',
    'common.premium': 'Premium',
    'common.pro': 'Pro',
  },
  hi: {
    // Header
    'app.title': 'यात्रा दिन काउंटर',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.tracking': 'ट्रैकिंग',
    'nav.tax': 'कर निवास',
    'nav.visas': 'वीजा',
    'nav.documents': 'दस्तावेज़',
    'nav.health': 'स्वास्थ्य',
    'nav.news': 'समाचार',
    'nav.alerts': 'अलर्ट',
    'nav.services': 'सेवाएं',
    'nav.settings': 'सेटिंग्स',
    
    // Tax Residency
    'tax.title': 'कर निवास और अनुपालन केंद्र',
    'tax.description': 'व्यापक कर निवास ट्रैकिंग, अनुपालन निगरानी और योजना उपकरण',
    'tax.select_jurisdiction': 'अपना प्राथमिक कर क्षेत्राधिकार चुनें:',
    'tax.global_overview': 'वैश्विक अवलोकन',
    'tax.united_states': 'संयुक्त राज्य अमेरिका',
    'tax.canada': 'कनाडा',
    'tax.days_spent': 'बिताए गए दिन:',
    'tax.tax_resident': '⚠️ कर निवासी',
    'tax.days_remaining': 'दिन शेष',
    'tax.no_countries': 'अभी तक कोई देश ट्रैक नहीं किया गया। कर निवास की निगरानी शुरू करने के लिए देश जोड़ें।',
    
    // Countries
    'countries.afghanistan': 'अफगानिस्तान',
    'countries.albania': 'अल्बानिया',
    'countries.algeria': 'अल्जीरिया',
    'countries.argentina': 'अर्जेंटीना',
    'countries.australia': 'ऑस्ट्रेलिया',
    'countries.austria': 'ऑस्ट्रिया',
    'countries.brazil': 'ब्राजील',
    'countries.canada': 'कनाडा',
    'countries.china': 'चीन',
    'countries.france': 'फ्रांस',
    'countries.germany': 'जर्मनी',
    'countries.india': 'भारत',
    'countries.italy': 'इटली',
    'countries.japan': 'जापान',
    'countries.mexico': 'मेक्सिको',
    'countries.netherlands': 'नीदरलैंड',
    'countries.portugal': 'पुर्तगाल',
    'countries.russia': 'रूस',
    'countries.south_africa': 'दक्षिण अफ्रीका',
    'countries.spain': 'स्पेन',
    'countries.sweden': 'स्वीडन',
    'countries.switzerland': 'स्विट्जरलैंड',
    'countries.united_kingdom': 'यूनाइटेड किंगडम',
    'countries.united_states': 'संयुक्त राज्य अमेरिका',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.add': 'जोड़ें',
    'common.remove': 'हटाएं',
    'common.upgrade': 'अपग्रेड',
    'common.free': 'मुफ्त',
    'common.premium': 'प्रीमियम',
    'common.pro': 'प्रो',
  },
  sw: {
    // Header
    'app.title': 'Kihesabu cha Siku za Kusafiri',
    'nav.dashboard': 'Dashibodi',
    'nav.tracking': 'Ufuatiliaji',
    'nav.tax': 'Makazi ya Kodi',
    'nav.visas': 'Visa',
    'nav.documents': 'Nyaraka',
    'nav.health': 'Afya',
    'nav.news': 'Habari',
    'nav.alerts': 'Tahadhari',
    'nav.services': 'Huduma',
    'nav.settings': 'Mipangilio',
    
    // Tax Residency
    'tax.title': 'Kituo cha Makazi ya Kodi na Utii',
    'tax.description': 'Ufuatiliaji wa kina wa makazi ya kodi, ufuatiliaji wa utii na zana za upangaji',
    'tax.select_jurisdiction': 'Chagua mamlaka yako kuu ya kodi:',
    'tax.global_overview': 'Muhtasari wa Kimataifa',
    'tax.united_states': 'Marekani',
    'tax.canada': 'Kanada',
    'tax.days_spent': 'Siku zilizotumika:',
    'tax.tax_resident': '⚠️ Mkazi wa kodi',
    'tax.days_remaining': 'siku zimebaki',
    'tax.no_countries': 'Hakuna nchi zilizofuatiliwa bado. Ongeza nchi ili kuanza kufuatilia makazi ya kodi.',
    
    // Countries
    'countries.afghanistan': 'Afghanistan',
    'countries.albania': 'Albania',
    'countries.algeria': 'Algeria',
    'countries.argentina': 'Argentina',
    'countries.australia': 'Australia',
    'countries.austria': 'Austria',
    'countries.brazil': 'Brazil',
    'countries.canada': 'Kanada',
    'countries.china': 'Uchina',
    'countries.france': 'Ufaransa',
    'countries.germany': 'Ujerumani',
    'countries.india': 'Uhindi',
    'countries.italy': 'Italia',
    'countries.japan': 'Japani',
    'countries.mexico': 'Meksiko',
    'countries.netherlands': 'Uholanzi',
    'countries.portugal': 'Ureno',
    'countries.russia': 'Urusi',
    'countries.south_africa': 'Afrika Kusini',
    'countries.spain': 'Uhispania',
    'countries.sweden': 'Uswidi',
    'countries.switzerland': 'Uswisi',
    'countries.united_kingdom': 'Uingereza',
    'countries.united_states': 'Marekani',
    
    // Common
    'common.loading': 'Inapakia...',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.close': 'Funga',
    'common.add': 'Ongeza',
    'common.remove': 'Ondoa',
    'common.upgrade': 'Boresha',
    'common.free': 'Bure',
    'common.premium': 'Premium',
    'common.pro': 'Pro',
  },
  af: {
    // Header
    'app.title': 'Reis Dag Teller',
    'nav.dashboard': 'Paneelbord',
    'nav.tracking': 'Opsporing',
    'nav.tax': 'Belasting Verblyf',
    'nav.visas': 'Visas',
    'nav.documents': 'Dokumente',
    'nav.health': 'Gesondheid',
    'nav.news': 'Nuus',
    'nav.alerts': 'Waarskuwings',
    'nav.services': 'Dienste',
    'nav.settings': 'Instellings',
    
    // Tax Residency
    'tax.title': 'Belasting Verblyf & Nakoming Sentrum',
    'tax.description': 'Omvattende belasting verblyf opsporing, nakoming monitering en beplanning gereedskap',
    'tax.select_jurisdiction': 'Kies jou primêre belasting jurisdiksie:',
    'tax.global_overview': 'Globale Oorsig',
    'tax.united_states': 'Verenigde State',
    'tax.canada': 'Kanada',
    'tax.days_spent': 'Dae spandeer:',
    'tax.tax_resident': '⚠️ Belasting inwoner',
    'tax.days_remaining': 'dae oor',
    'tax.no_countries': 'Geen lande nog opgespoor nie. Voeg lande by om belasting verblyf monitering te begin.',
    
    // Countries
    'countries.afghanistan': 'Afghanistan',
    'countries.albania': 'Albanië',
    'countries.algeria': 'Algerië',
    'countries.argentina': 'Argentinië',
    'countries.australia': 'Australië',
    'countries.austria': 'Oostenryk',
    'countries.brazil': 'Brasilië',
    'countries.canada': 'Kanada',
    'countries.china': 'Sjina',
    'countries.france': 'Frankryk',
    'countries.germany': 'Duitsland',
    'countries.india': 'Indië',
    'countries.italy': 'Italië',
    'countries.japan': 'Japan',
    'countries.mexico': 'Meksiko',
    'countries.netherlands': 'Nederland',
    'countries.portugal': 'Portugal',
    'countries.russia': 'Rusland',
    'countries.south_africa': 'Suid-Afrika',
    'countries.spain': 'Spanje',
    'countries.sweden': 'Swede',
    'countries.switzerland': 'Switserland',
    'countries.united_kingdom': 'Verenigde Koninkryk',
    'countries.united_states': 'Verenigde State',
    
    // Common
    'common.loading': 'Laai...',
    'common.save': 'Stoor',
    'common.cancel': 'Kanselleer',
    'common.close': 'Sluit',
    'common.add': 'Voeg by',
    'common.remove': 'Verwyder',
    'common.upgrade': 'Opgradeer',
    'common.free': 'Gratis',
    'common.premium': 'Premium',
    'common.pro': 'Pro',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem('selectedLanguage', code);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};