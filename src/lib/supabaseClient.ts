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

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_URL.includes('your-project')) {
  console.warn('Supabase credentials are missing or invalid. Please update your .env file.');
}

export const supabase = supabaseInstance;
