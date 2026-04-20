const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data: categories } = await supabase.from('content_categories').select('*');
  console.log('Categories:', JSON.stringify(categories, null, 2));

  const testSlug = 'test-insertion-' + Date.now();
  console.log('Attempting to insert test blog:', testSlug);
  const { data, error } = await supabase.from('blogs').insert([
    {
      slug: testSlug,
      seo_title: 'Test Insertion',
      meta_description: 'Test',
      body_content: 'Test content',
      published: false
    }
  ]).select();

  if (error) {
    console.error('Insertion failed:', error.message);
  } else {
    console.log('Insertion successful!', JSON.stringify(data, null, 2));
    // Clean up
    await supabase.from('blogs').delete().eq('slug', testSlug);
  }
}

checkDb();
