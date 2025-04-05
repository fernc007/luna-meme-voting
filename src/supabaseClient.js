// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your own project URL and anon API key
const supabaseUrl = 'https://vtncarurbitlxhsekmpm.supabase.co';  // e.g., 'https://xyzcompany.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bmNhcnVyYml0bHhoc2VrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDk0NzEsImV4cCI6MjA1OTM4NTQ3MX0.fLVg1-I-0Xwc-VlWMeT7YMw5dkHJ7ReQhZ3NLgeoWlk';  // e.g., 'your-anon-api-key'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
