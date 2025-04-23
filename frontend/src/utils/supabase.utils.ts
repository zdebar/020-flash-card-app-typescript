import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-or-service-role-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
