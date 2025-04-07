// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your own project URL and anon API key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey =  process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
