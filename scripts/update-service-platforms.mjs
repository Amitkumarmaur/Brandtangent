import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateServicePlatforms() {
  const serviceId = '07504cd8-80e7-4884-8fc4-5e5ff8feb757';
  
  // First, check what service this is
  const { data: service, error: fetchError } = await supabase
    .from('services')
    .select('id, name')
    .eq('id', serviceId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching service:', fetchError);
    return;
  }
  
  console.log('Service:', service);
  
  // Platforms suitable for Workflow Automation
  const platformIds = [
    'ee2c529f-d460-48ba-921f-d3132867e7c9', // Zapier
    '0936543d-d5e2-48fd-ab14-f8f5f957c50b', // Make
    '79d67caf-7a74-4b30-b220-f6a4048988e0', // n8n
    'edc34603-1255-4e17-9cf2-42197885df28', // ChatGPT
    '3b6741e2-d740-4919-87cf-74e8b14e4805'  // Claude
  ];
  
  const { error: updateError } = await supabase
    .from('services')
    .update({ platform_ids: platformIds })
    .eq('id', serviceId);
    
  if (updateError) {
    console.error('Error updating service platforms:', updateError);
  } else {
    console.log(`Successfully updated platform_ids for service ${service.name}`);
  }
}

updateServicePlatforms();
