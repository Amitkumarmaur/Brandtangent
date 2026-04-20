import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getPlatforms() {
  const { data, error } = await supabase
    .from('platforms')
    .select('id, platform_name')
    .order('platform_name');

  if (error) {
    console.error(`Error:`, error.message);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

getPlatforms();
