import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getData() {
  const { data: services, error: sErr } = await supabase.from('services').select('id, name, slug');
  const { data: platforms, error: pErr } = await supabase.from('platforms').select('id, platform_name');
  
  if (sErr) console.error("Error fetching services", sErr);
  if (pErr) console.error("Error fetching platforms", pErr);
  
  console.log("SERVICES:", JSON.stringify(services, null, 2));
  console.log("PLATFORMS:", JSON.stringify(platforms, null, 2));
}

getData();
