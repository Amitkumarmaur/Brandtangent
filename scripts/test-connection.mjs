import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  // Query arbitrary data to verify connection
  const { data, error } = await supabase.from('service_categories').select('id').limit(1);

  if (error) {
    console.error("Connection failed:", error.message);
    process.exit(1);
  } else {
    console.log("Connection successful! Fetched data:", data);
  }
}

testConnection();
