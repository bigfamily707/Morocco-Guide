import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'nl' | 'ar';

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
];

const TRANSLATIONS = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_explore: 'Explore',
    nav_hosts: 'Hosts',
    nav_chat: 'Ask Aziz',
    nav_safety: 'Safety',
    nav_profile: 'Profile',
    // Home
    home_title: 'Marhaban!',
    home_subtitle: "Let's find your Moroccan magic.",
    home_plan: 'Plan Trip',
    home_plan_sub: 'Itineraries & tips',
    home_aziz: 'Ask Aziz',
    home_aziz_sub: 'AI Guide',
    home_must_visit: 'Must Visit',
    home_see_all: 'See All',
    home_mood: 'Browse by Mood',
    home_phrase: 'Phrase of the Day',
    // Profile
    profile_title: 'My Journey',
    profile_subtitle: 'Preferences & Settings',
    profile_traveler: 'Traveler',
    profile_customize: 'Customize your guide experience',
    profile_style: 'Travel Style',
    profile_style_desc: '"Ask Aziz" will tailor recommendations based on your selected style.',
    profile_offline: 'Offline Maps & Data',
    profile_used: 'Used',
    profile_general: 'General',
    profile_lang: 'App Language',
    profile_cache: 'Clear Cache',
    // Personas
    persona_Family: 'Family',
    persona_Solo: 'Solo',
    persona_Adventure: 'Adventure',
    persona_Luxury: 'Luxury',
    persona_Cultural: 'Cultural',
    // Common
    download: 'Download',
    downloading: 'Downloading...',
    downloaded: 'Downloaded',
  },
  fr: {
    nav_home: 'Accueil',
    nav_explore: 'Explorer',
    nav_hosts: 'Guides',
    nav_chat: 'Aziz',
    nav_safety: 'Sécurité',
    nav_profile: 'Profil',
    home_title: 'Marhaban !',
    home_subtitle: 'Trouvez votre magie marocaine.',
    home_plan: 'Planifier',
    home_plan_sub: 'Itinéraires et conseils',
    home_aziz: 'Demander à Aziz',
    home_aziz_sub: 'Guide IA',
    home_must_visit: 'Incontournable',
    home_see_all: 'Voir tout',
    home_mood: 'Par humeur',
    home_phrase: 'Phrase du jour',
    profile_title: 'Mon Voyage',
    profile_subtitle: 'Préférences et paramètres',
    profile_traveler: 'Voyageur',
    profile_customize: 'Personnalisez votre expérience',
    profile_style: 'Style de voyage',
    profile_style_desc: '"Aziz" adaptera ses recommandations à votre style.',
    profile_offline: 'Cartes hors ligne',
    profile_used: 'Utilisé',
    profile_general: 'Général',
    profile_lang: 'Langue de l\'app',
    profile_cache: 'Vider le cache',
    persona_Family: 'Famille',
    persona_Solo: 'Solo',
    persona_Adventure: 'Aventure',
    persona_Luxury: 'Luxe',
    persona_Cultural: 'Culturel',
    download: 'Télécharger',
    downloading: 'Téléchargement...',
    downloaded: 'Téléchargé',
  },
  es: {
    nav_home: 'Inicio',
    nav_explore: 'Explorar',
    nav_hosts: 'Guías',
    nav_chat: 'Aziz',
    nav_safety: 'Seguridad',
    nav_profile: 'Perfil',
    home_title: '¡Marhaban!',
    home_subtitle: 'Encuentra tu magia marroquí.',
    home_plan: 'Planificar',
    home_plan_sub: 'Itinerarios y consejos',
    home_aziz: 'Preguntar a Aziz',
    home_aziz_sub: 'Guía IA',
    home_must_visit: 'Imperdible',
    home_see_all: 'Ver todo',
    home_mood: 'Por estado de ánimo',
    home_phrase: 'Frase del día',
    profile_title: 'Mi Viaje',
    profile_subtitle: 'Preferencias y ajustes',
    profile_traveler: 'Viajero',
    profile_customize: 'Personaliza tu experiencia',
    profile_style: 'Estilo de viaje',
    profile_style_desc: '"Aziz" adaptará las recomendaciones a tu estilo.',
    profile_offline: 'Mapas sin conexión',
    profile_used: 'Usado',
    profile_general: 'General',
    profile_lang: 'Idioma de la app',
    profile_cache: 'Borrar caché',
    persona_Family: 'Familia',
    persona_Solo: 'Solo',
    persona_Adventure: 'Aventura',
    persona_Luxury: 'Lujo',
    persona_Cultural: 'Cultural',
    download: 'Descargar',
    downloading: 'Descargando...',
    downloaded: 'Descargado',
  },
  nl: {
    nav_home: 'Thuis',
    nav_explore: 'Verkennen',
    nav_hosts: 'Gidsen',
    nav_chat: 'Vraag Aziz',
    nav_safety: 'Veiligheid',
    nav_profile: 'Profiel',
    home_title: 'Marhaban!',
    home_subtitle: 'Vind jouw Marokkaanse magie.',
    home_plan: 'Plan Reis',
    home_plan_sub: 'Routes & tips',
    home_aziz: 'Vraag Aziz',
    home_aziz_sub: 'AI Gids',
    home_must_visit: 'Moet je zien',
    home_see_all: 'Alles zien',
    home_mood: 'Op stemming',
    home_phrase: 'Zin van de dag',
    profile_title: 'Mijn Reis',
    profile_subtitle: 'Voorkeuren & Instellingen',
    profile_traveler: 'Reiziger',
    profile_customize: 'Pas je ervaring aan',
    profile_style: 'Reisstijl',
    profile_style_desc: '"Aziz" past aanbevelingen aan op basis van jouw stijl.',
    profile_offline: 'Offline Kaarten',
    profile_used: 'Gebruikt',
    profile_general: 'Algemeen',
    profile_lang: 'App Taal',
    profile_cache: 'Cache wissen',
    persona_Family: 'Familie',
    persona_Solo: 'Solo',
    persona_Adventure: 'Avontuur',
    persona_Luxury: 'Luxe',
    persona_Cultural: 'Cultureel',
    download: 'Downloaden',
    downloading: 'Downloaden...',
    downloaded: 'Gedownload',
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_explore: 'استكشف',
    nav_hosts: 'مضيفون',
    nav_chat: 'اسأل عزيز',
    nav_safety: 'أمان',
    nav_profile: 'ملفي',
    home_title: 'مرحباً!',
    home_subtitle: 'اكتشف سحر المغرب الخاص بك.',
    home_plan: 'خطط رحلتك',
    home_plan_sub: 'مسارات ونصائح',
    home_aziz: 'اسأل عزيز',
    home_aziz_sub: 'دليلك الذكي',
    home_must_visit: 'أماكن لا تفوت',
    home_see_all: 'عرض الكل',
    home_mood: 'تصفح حسب المزاج',
    home_phrase: 'عبارة اليوم',
    profile_title: 'رحلتي',
    profile_subtitle: 'التفضيلات والإعدادات',
    profile_traveler: 'مسافر',
    profile_customize: 'خصص تجربتك',
    profile_style: 'أسلوب السفر',
    profile_style_desc: 'سيقوم "عزيز" بتخصيص التوصيات بناءً على أسلوبك.',
    profile_offline: 'خرائط بلا إنترنت',
    profile_used: 'مستخدم',
    profile_general: 'عام',
    profile_lang: 'لغة التطبيق',
    profile_cache: 'مسح الذاكرة المؤقتة',
    persona_Family: 'عائلة',
    persona_Solo: 'فردي',
    persona_Adventure: 'مغامرة',
    persona_Luxury: 'رفاهية',
    persona_Cultural: 'ثقافي',
    download: 'تحميل',
    downloading: 'جاري التحميل...',
    downloaded: 'تم التحميل',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      const supported = LANGUAGES.map(l => l.code);
      // @ts-ignore
      if (supported.includes(saved)) {
        return saved as Language;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  // Handle Text Direction & Persistence
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem('app_language', language);
  }, [language]);

  const t = (key: string): string => {
    // @ts-ignore - indexing flexibility
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
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
