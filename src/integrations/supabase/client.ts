import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jlgvdyzpbnftouivwkng.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZ3ZkeXpwYm5mdG91aXZ3a25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODc5NjcsImV4cCI6MjA3MDA2Mzk2N30.weeSsLwh6dPq9tBqzwCjsfyq3cCiDIA1G0pgm4QeJec';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});