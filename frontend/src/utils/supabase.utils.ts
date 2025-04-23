import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://toutavviqvamhrwbprti.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdXRhdnZpcXZhbWhyd2JwcnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDM4MzEsImV4cCI6MjA1ODcxOTgzMX0.Ioyh4H5Gy21QVc_H8Jq2xg5zujseVXAXD8csIKrJ0jk';

export const supabase = createClient(supabaseUrl, supabaseKey);
