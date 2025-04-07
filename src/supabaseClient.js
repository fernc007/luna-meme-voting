// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your own project URL and anon API key
const supabaseUrl =   // e.g., 'https://xyzcompany.supabase.co'
const supabaseKey = // e.g., 'your-anon-api-key'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
