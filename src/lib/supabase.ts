import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tksunqgbnturjsfjoseq.supabase.co';
const supabaseAnonKey = 'sb_publishable_ssoxOGz7yPAmaWYLopX1Uw_po_JZczj';

// This configuration is specifically tuned for Android/Mobile browsers
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Set to false to prevent mobile redirect loops
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});