import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  throw new Error('Missing Supabase environment variables');
}

console.log('[Supabase] Using URL:', supabaseUrl);
console.log('[Supabase] Using Anon Key:', supabaseAnonKey ? '***' : '(empty)');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test initial connection
(async () => {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.error('[Supabase] Connection test failed:', error);
    } else {
      console.log('[Supabase] Connection test succeeded.');
    }
  } catch (err) {
    console.error('[Supabase] Unexpected error during connection test:', err);
  }
})();
