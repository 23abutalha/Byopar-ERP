import { createClient } from '@supabase/supabase-js';

// Use Environment Variables for Vercel, fallback to your hardcoded keys for local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tksunqgbnturjsfjoseq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ssoxOGz7yPAmaWYLopX1Uw_po_JZczj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});