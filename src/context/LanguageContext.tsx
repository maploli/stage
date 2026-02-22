import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.programme": "Programme",
    "nav.sponsors": "Sponsors",
    "nav.contact": "Contact",
    "nav.login": "Espace Participant",
    "nav.register": "S'inscrire",
    
    // Auth / Login
    "auth.login.title": "Espace Participant",
    "auth.login.desc": "Connectez-vous pour télécharger votre badge et suivre votre dossier.",
    "auth.login.email": "Email",
    "auth.login.password": "Mot de passe",
    "auth.login.forgot": "Mot de passe oublié ?",
    "auth.login.submit": "Se connecter",
    "auth.login.noAccount": "Vous n'avez pas encore de compte ?",
    "auth.login.register": "Inscrivez-vous ici",
    
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

    // Common
    "common.back": "Back",
    "common.success": "Success",
    "common.error": "Error",
    "common.loading": "Loading...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return (value as string) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
