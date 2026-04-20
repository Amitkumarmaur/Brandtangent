import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const updates = [
  {
    name: 'Development',
    seo_title: 'Custom Website & Web App Development Services | DigiiMark',
    meta_description: 'Expert web and software development services tailored for your business. We build custom marketing websites, eCommerce stores, and scalable SaaS solutions.'
  },
  {
    name: 'AI & Automation',
    seo_title: 'AI Integration & Workflow Automation Services | DigiiMark',
    meta_description: 'Streamline your operations with our AI and automation experts. From custom AI agents to full business process automation using n8n and Zapier.'
  },
  {
    name: 'SEO & Search Visibility',
    seo_title: 'Advanced SEO & Answer Engine Optimization (AEO) | DigiiMark',
    meta_description: 'Dominate organic search and AI overviews with our comprehensive SEO services. We specialize in technical SEO, local search, and AI-powered content strategy.'
  },
  {
    name: 'Growth & Revenue Systems',
    seo_title: 'Revenue Systems, Lead Gen & CRM Setup Services | DigiiMark',
    meta_description: 'Accelerate your business growth with targeted lead generation, CRM automation, email marketing, and conversion rate optimization strategies.'
  },
  {
    name: 'Content & Social Media',
    seo_title: 'Targeted B2B Content & Social Media Management | DigiiMark',
    meta_description: 'Elevate your brand with data-driven social media management, automated content pipelines, and stunning visual design for maximum engagement.'
  }
];

async function updateSeo() {
  for (const update of updates) {
    const { data, error } = await supabase
      .from('service_categories')
      .update({
        seo_title: update.seo_title,
        meta_description: update.meta_description
      })
      .eq('name', update.name)
      .select('id, name, seo_title, meta_description');

    if (error) {
      console.error(`Error updating ${update.name}:`, error.message);
    } else {
      console.log(`Successfully updated ${update.name}`);
      console.log(data);
    }
  }
}

updateSeo();
