import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

let supabaseInstance;

try {
  // Validate URL format to avoid crash in createClient
  new URL(supabaseUrl);
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error('L\'URL Supabase est invalide. Vérifiez votre fichier .env:', e);
  // Fallback to a dummy client to prevent app crash
  supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder');
}

const isProduction = import.meta.env.PROD;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_URL.includes('your-project')) {
  const message = isProduction 
    ? 'ERREUR CRITIQUE: Les variables d\'environnement Supabase sont manquantes dans la production. Vérifiez la configuration des variables d\'environnement (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY) dans votre tableau de bord Netlify.'
    : 'Supabase credentials are missing or invalid. Please update your .env file.';
  console.error(message);
}

export const supabase = supabaseInstance;
