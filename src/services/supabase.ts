import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

export const supabaseUrl = 'https://uezancgxaodkxjwphzdl.supabase.co';

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
