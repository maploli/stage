import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Profiles
    "profiles.title": "Pour qui est le FIAA ?",
    "profiles.subtitle": "Chaque profil dispose d'un parcours personnalisé, d'un badge spécifique et d'avantages exclusifs.",
    "profiles.agriculteur.title": "Agriculteurs & Coopératives",
    "profiles.agriculteur.desc": "Accédez aux dernières technologies agricoles et bénéficiez de formations gratuites sur les outils digitaux.",
    "profiles.agriculteur.badge": "Badge Vert",
    "profiles.startup.title": "Startups Agritech",
    "profiles.startup.desc": "Présentez vos solutions innovantes, participez au pitch contest et connectez-vous avec des investisseurs.",
    "profiles.startup.badge": "Badge Bleu",
    "profiles.partenaire.title": "Partenaires & Sponsors",
    "profiles.partenaire.desc": "Maximisez votre visibilité et générez des leads qualifiés avec nos packages premium personnalisés.",
    "profiles.partenaire.badge": "Badge Or/Argent",
    "profiles.institution.title": "Institutions",
    "profiles.institution.desc": "Renforcez votre engagement dans la transformation agricole africaine et nouez des partenariats stratégiques.",
    "profiles.institution.badge": "Badge Violet",
    "profiles.media.title": "Médias & Presse",
    "profiles.media.desc": "Couvrez l'événement phare de l'innovation agricole africaine avec un accès privilégié.",
    "profiles.media.badge": "Badge Jaune",
    
    // Program
    "program.title": "3 jours d'innovation intensive",
    "program.subtitle": "Un programme riche alliant conférences, ateliers pratiques, networking et célébrations.",
    "program.day1.title": "Jour 1",
    "program.day1.date": "Ouverture & Vision",
    "program.day1.event1": "Cérémonie d'ouverture officielle",
    "program.day1.event2": "Village innovation - visites stands",
    "program.day1.event3": "Cocktail networking institutionnel",
    
    "program.day2.title": "Jour 2",
    "program.day2.date": "Innovation & Tech",
    "program.day2.event1": "Ateliers techniques thématiques",
    "program.day2.event2": "Sessions B2B & rendez-vous d'affaires",
    "program.day2.event3": "Pitch contest startups",
    
    "program.day3.title": "Jour 3",
    "program.day3.date": "Impact & Futur",
    "program.day3.event1": "Démonstrations en conditions réelles",
    "program.day3.event2": "Annonces partenariats & clôture",
    "program.day3.event3": "Cérémonie de remise des prix",

    // Zones
    "zones.title": "Village FIAA 2026",
    "zones.subtitle": "Agbélouvé - Un espace de 4 zones thématiques conçues pour maximiser les rencontres et les opportunités.",
    "zones.innovation.name": "Zone Innovation",
    "zones.innovation.feat1": "Stands startups (30 unités)",
    "zones.innovation.feat2": "Lab d'expérimentation tech",
    "zones.innovation.feat3": "Espace pitch et démonstrations",
    "zones.innovation.feat4": "Zone prototypage rapide",
    "zones.formation.name": "Zone Formation",
    "zones.formation.feat1": "Ateliers pratiques (5 salles)",
    "zones.formation.feat2": "Demo centers thématiques",
    "zones.formation.feat3": "Espace coworking collaboratif",
    "zones.formation.feat4": "Lab digital mobile",
    "zones.institution.name": "Zone Institutionnelle",
    "zones.institution.feat1": "Pavillon partenaires stratégiques",
    "zones.institution.feat2": "Espace institutions publiques",
    "zones.institution.feat3": "Zone investisseurs",
    "zones.institution.feat4": "Point presse et médias",
    "zones.services.name": "Zone Services",
    "zones.services.feat1": "Restauration et détente",
    "zones.services.feat2": "Networking lounge",
    "zones.services.feat3": "Infirmerie et sécurité",
    "zones.services.feat4": "Informations et accueil",

    // CTA
    "cta.badge": "Places limitées à 600 participants",
    "cta.title": "Rejoignez le mouvement de l'agriculture africaine de demain",
    "cta.subtitle": "Ne manquez pas cette opportunité unique de rencontrer les acteurs clés, découvrir les dernières innovations et façonner l'avenir de l'agriculture africaine.",
    "cta.button": "S'inscire maintenant",
    "cta.partner": "Devenir partenaire",

    // Common
    "common.back": "Retour",
    "common.success": "Succès",
    "common.error": "Erreur",
    "common.loading": "Chargement...",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.programme": "Program",
    "nav.sponsors": "Sponsors",
    "nav.contact": "Contact",
    "nav.login": "Participant Area",
    "nav.register": "Register",

    // Auth / Login
    "auth.login.title": "Participant Area",
    "auth.login.desc": "Log in to download your badge and track your application.",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.forgot": "Forgot Password?",
    "auth.login.submit": "Log In",
    "auth.login.noAccount": "Don't have an account yet?",
    "auth.login.register": "Register here",

    // Hero
    "hero.firstEdition": "First Edition 2026",
    "hero.title": "International Festival of Agriculture & Agro-industry",
    "hero.subtitle": "Connecting Earth and Tech for a Future African Agriculture. Join 600 change-makers for 3 days of innovation, networking, and transformation.",
    "hero.days": "3 full days",
    "hero.location": "Agbelouve, Togo",
    "hero.participants": "600 participants",
    "hero.cta.register": "Register now",
    "hero.cta.program": "Discover the program",

    // Stats
    "stats.startups": "Agritech Startups",
    "stats.farmers": "Farmers trained",
    "stats.partners": "Partnerships",
    "stats.investment": "FCFA Investments",

    // Profiles
    "profiles.title": "Who is FIAA for?",
    "profiles.subtitle": "Each profile has a personalized journey, a specific badge, and exclusive benefits.",
    "profiles.agriculteur.title": "Farmers & Cooperatives",
    "profiles.agriculteur.desc": "Access the latest agricultural technologies and benefit from free digital tools training.",
    "profiles.agriculteur.badge": "Green Badge",
    "profiles.startup.title": "Agritech Startups",
    "profiles.startup.desc": "Present your innovative solutions, join the pitch contest, and connect with investors.",
    "profiles.startup.badge": "Blue Badge",
    "profiles.partenaire.title": "Partners & Sponsors",
    "profiles.partenaire.desc": "Maximize your visibility and generate qualified leads with our customized premium packages.",
    "profiles.partenaire.badge": "Gold/Silver Badge",
    "profiles.institution.title": "Institutions",
    "profiles.institution.desc": "Strengthen your engagement in African agricultural transformation and build strategic partnerships.",
    "profiles.institution.badge": "Purple Badge",
    "profiles.media.title": "Media & Press",
    "profiles.media.desc": "Cover Africa's flagship agricultural innovation event with privileged access.",
    "profiles.media.badge": "Yellow Badge",

    // Program
    "program.title": "3 Days of Intensive Innovation",
    "program.subtitle": "A rich program combining conferences, practical workshops, networking, and celebrations.",
    "program.day1.title": "Day 1",
    "program.day1.date": "Opening & Vision",
    "program.day1.event1": "Official Opening Ceremony",
    "program.day1.event2": "Innovation Village - Booth visits",
    "program.day1.event3": "Institutional Networking Cocktail",

    "program.day2.title": "Day 2",
    "program.day2.date": "Innovation & Tech",
    "program.day2.event1": "Technical Thematic Workshops",
    "program.day2.event2": "B2B Sessions & Business Meetings",
    "program.day2.event3": "Startup Pitch Contest",

    "program.day3.title": "Day 3",
    "program.day3.date": "Impact & Future",
    "program.day3.event1": "Real-world Condition Demonstrations",
    "program.day3.event2": "Partnership Announcements & Closing",
    "program.day3.event3": "Awards Ceremony",

    // Zones
    "zones.title": "FIAA 2026 Village",
    "zones.subtitle": "Agbelouve - A space of 4 thematic zones designed to maximize encounters and opportunities.",
    "zones.innovation.name": "Innovation Zone",
    "zones.innovation.feat1": "Startup Booths (30 units)",
    "zones.innovation.feat2": "Tech Experiment Lab",
    "zones.innovation.feat3": "Pitch & Demo Space",
    "zones.innovation.feat4": "Rapid Prototyping Zone",
    "zones.formation.name": "Training Zone",
    "zones.formation.feat1": "Practical Workshops (5 rooms)",
    "zones.formation.feat2": "Thematic Demo Centers",
    "zones.formation.feat3": "Collaborative Coworking Space",
    "zones.formation.feat4": "Mobile Digital Lab",
    "zones.institution.name": "Institutional Zone",
    "zones.institution.feat1": "Strategic Partners Pavilion",
    "zones.institution.feat2": "Public Institutions Area",
    "zones.institution.feat3": "Investors Zone",
    "zones.institution.feat4": "Press & Media Point",
    "zones.services.name": "Services Zone",
    "zones.services.feat1": "Catering & Relaxation",
    "zones.services.feat2": "Networking Lounge",
    "zones.services.feat3": "Infirmary & Security",
    "zones.services.feat4": "Info & Reception Desk",

    // CTA
    "cta.badge": "Seats limited to 600 participants",
    "cta.title": "Join the movement of tomorrow's African agriculture",
    "cta.subtitle": "Don't miss this unique opportunity to meet key players, discover the latest innovations, and shape the future of African agriculture.",
    "cta.button": "Register now",
    "cta.partner": "Become a partner",

    // Common
    "common.back": "Back",
    "common.success": "Success",
    "common.error": "Error",
    "common.loading": "Loading...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'fr';
  });

  const setLanguageAndStore = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return (value as string) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageAndStore, t }}>
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
