import fs from 'fs';

const services = [
  { "id": "a3621219-2855-4ade-b313-9210cf0c1542", "name": "Visual Content & Design", "slug": "visual-content-design" },
  { "id": "07504cd8-80e7-4884-8fc4-5e5ff8feb757", "name": "Workflow Automation", "slug": "workflow-automation" },
  { "id": "10f0fb20-b409-4901-a4e4-032553e56cd6", "name": "AI Integration", "slug": "ai-integration" },
  { "id": "a464e00a-9771-4e10-ab31-0c8e911e4051", "name": "Content Automation", "slug": "content-automation" },
  { "id": "dd2f64d7-dc42-45ce-8f30-ea4062b2eda5", "name": "API & System Integration", "slug": "api-system-integration" },
  { "id": "4262e2d6-ea7d-49ef-842e-d6a156b23272", "name": "E-Commerce Solutions", "slug": "e-commerce-solutions" },
  { "id": "21d3f6c8-706a-4c4d-a40e-47e9a095f3f6", "name": "Custom Web Applications", "slug": "custom-web-applications" },
  { "id": "8836759d-1959-4bf7-8ab8-1117ee4b1de5", "name": "Progressive Web Apps", "slug": "progressive-web-apps" },
  { "id": "d16e7455-d720-4471-95ed-13348836bb86", "name": "Technical SEO", "slug": "technical-seo" },
  { "id": "eb2b417d-bccd-49c4-af3d-29953fa4a273", "name": "Business Process Automation", "slug": "business-process-automation" },
  { "id": "b676a832-5576-41f2-8e1a-3b455068fac6", "name": "Performance Optimization", "slug": "performance-optimization" },
  { "id": "f74c06ab-9f9f-42ed-9f0d-db3ca8204d28", "name": "Paid Advertising", "slug": "paid-advertising" },
  { "id": "94112c93-5c9e-413f-9b13-b12171b78bfe", "name": "AI Consulting & Strategy", "slug": "ai-consulting-strategy" },
  { "id": "46216d27-1fde-4a12-b85e-585bb91168dc", "name": "Local SEO", "slug": "local-seo" },
  { "id": "e1c0bc71-828d-4d31-9f54-197b43492f65", "name": "Social Media Management", "slug": "social-media-management" },
  { "id": "191c4bad-63e9-4f9d-8b75-461e5d891959", "name": "Content Creation & Strategy", "slug": "content-creation-strategy" },
  { "id": "313f88df-87a3-476b-a3bf-d1c3524da66e", "name": "Email Marketing & Automation", "slug": "email-marketing-automation" },
  { "id": "987cda60-5fef-4da6-80f9-570938a99931", "name": "Conversion Rate Optimization", "slug": "conversion-rate-optimization" },
  { "id": "21369312-6fcf-4fb6-aa4e-3dac652c5c14", "name": "Answer Engine Optimization (AEO)", "slug": "answer-engine-optimization-aeo" },
  { "id": "c076fcf8-5fcb-44ee-a4e9-3a0783db0f84", "name": "CMS & Content Platforms", "slug": "cms-content-platforms" },
  { "id": "3b11448e-46c6-4a5f-8676-c5ac1fb287e2", "name": "AI Agents & Chatbots", "slug": "ai-agents-chatbots" },
  { "id": "f99d433c-8ab8-4472-8878-2d9e25e472b1", "name": "Content SEO Strategy", "slug": "content-seo-strategy" },
  { "id": "95dad7a2-640a-48b1-a91f-c6bae0114eee", "name": "Lead Generation", "slug": "lead-generation" },
  { "id": "0029f6b1-da31-401f-b19e-1b401c1e5bbb", "name": "CRM Setup & Automation", "slug": "crm-setup-automation" }
];

const platforms = [
  { "id": "11111111-1111-4111-8111-111111111111", "platform_name": "Next.js" },
  { "id": "11111111-1111-4111-8111-111111111112", "platform_name": "React" },
  { "id": "11111111-1111-4111-8111-111111111113", "platform_name": "Node.js" },
  { "id": "11111111-1111-4111-8111-111111111114", "platform_name": "PostgreSQL" },
  { "id": "11111111-1111-4111-8111-111111111115", "platform_name": "Tailwind CSS" },
  { "id": "78dbc3f4-6d81-4587-afc2-a621a3702234", "platform_name": "Webflow" },
  { "id": "99cbc699-4e77-465e-a6fc-95d8dbf7a8c8", "platform_name": "WordPress" },
  { "id": "f9f8548d-2235-4683-ba0d-7ac5ab63f92f", "platform_name": "Shopify" },
  { "id": "b58aaf52-823d-4051-b53d-cad90df26d72", "platform_name": "WooCommerce" },
  { "id": "41bedc41-86c5-4cc5-8b24-7352e8c398fd", "platform_name": "Perplexity" },
  { "id": "40545b86-1208-4226-a3df-71ddc50e8089", "platform_name": "Google" },
  { "id": "102c5280-6acb-49c4-b547-b4f2221362e4", "platform_name": "Resend" },
  { "id": "d6d3ce3e-ed45-4674-81b7-3d5ffd686e86", "platform_name": "Outlook" },
  { "id": "c4dbda2b-bb6d-4fcd-acd4-44397a15b59f", "platform_name": "Meta" },
  { "id": "552c3852-b951-49f4-bdac-e95b52d1a6c1", "platform_name": "LinkedIn" },
  { "id": "78fbeb25-d01d-4090-86fb-bcf0f8a297b1", "platform_name": "Instagram" },
  { "id": "53f5a78a-7ab9-4ea7-bfb4-501f98002c02", "platform_name": "Facebook" },
  { "id": "aabd38fc-8461-4b6c-a211-f50228690cd0", "platform_name": "X (Twitter)" },
  { "id": "1835ee96-f29e-463f-85cc-0f6e41fbd201", "platform_name": "PowerBroker" },
  { "id": "43383af3-df1c-4436-a346-ecf7acd6a73e", "platform_name": "Acturis" },
  { "id": "0f1099a1-efa1-42d4-af91-3b7189919d55", "platform_name": "Applied Epic" },
  { "id": "7a606d5a-ed50-4d64-8247-11c517e24936", "platform_name": "HubSpot" },
  { "id": "9b3f5712-5811-44a4-a119-7ecc05c0f749", "platform_name": "Salesforce" },
  { "id": "ee2c529f-d460-48ba-921f-d3132867e7c9", "platform_name": "Zapier" },
  { "id": "0936543d-d5e2-48fd-ab14-f8f5f957c50b", "platform_name": "Make" },
  { "id": "79d67caf-7a74-4b30-b220-f6a4048988e0", "platform_name": "n8n" },
  { "id": "edc34603-1255-4e17-9cf2-42197885df28", "platform_name": "ChatGPT" },
  { "id": "3b6741e2-d740-4919-87cf-74e8b14e4805", "platform_name": "Claude" }
];

const platformMap = platforms.reduce((acc, p) => ({ ...acc, [p.platform_name]: p.id }), {});

const mapIds = (names) => names.map(n => platformMap[n]).filter(Boolean);

const serviceMappings = {
  "visual-content-design": mapIds(["Meta", "Instagram", "Facebook"]),
  "workflow-automation": mapIds(["Zapier", "Make", "n8n", "ChatGPT", "Claude"]),
  "ai-integration": mapIds(["ChatGPT", "Claude", "Perplexity", "Zapier", "Make"]),
  "content-automation": mapIds(["ChatGPT", "Claude", "Make", "Zapier", "WordPress", "Webflow"]),
  "api-system-integration": mapIds(["Node.js", "Next.js", "PostgreSQL", "Zapier", "Make", "n8n"]),
  "e-commerce-solutions": mapIds(["Shopify", "WooCommerce", "Next.js", "React", "Tailwind CSS"]),
  "custom-web-applications": mapIds(["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"]),
  "progressive-web-apps": mapIds(["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"]),
  "technical-seo": mapIds(["Google", "Next.js", "React", "Webflow", "WordPress"]),
  "business-process-automation": mapIds(["Zapier", "Make", "n8n", "Salesforce", "HubSpot"]),
  "performance-optimization": mapIds(["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"]),
  "paid-advertising": mapIds(["Google", "Meta", "Facebook", "Instagram", "LinkedIn"]),
  "ai-consulting-strategy": mapIds(["ChatGPT", "Claude", "Perplexity"]),
  "local-seo": mapIds(["Google", "Facebook", "WordPress", "Webflow"]),
  "social-media-management": mapIds(["Meta", "Facebook", "Instagram", "LinkedIn", "X (Twitter)"]),
  "content-creation-strategy": mapIds(["ChatGPT", "Claude", "Perplexity", "Google", "WordPress"]),
  "email-marketing-automation": mapIds(["HubSpot", "Salesforce", "Resend", "Outlook", "Zapier", "Make"]),
  "conversion-rate-optimization": mapIds(["Google", "Shopify", "WooCommerce", "WordPress", "Webflow"]),
  "answer-engine-optimization-aeo": mapIds(["Perplexity", "ChatGPT", "Claude", "Google"]),
  "cms-content-platforms": mapIds(["WordPress", "Webflow", "Next.js", "React"]),
  "ai-agents-chatbots": mapIds(["ChatGPT", "Claude", "Perplexity", "Make", "Zapier"]),
  "content-seo-strategy": mapIds(["Google", "ChatGPT", "Claude", "Perplexity", "WordPress"]),
  "lead-generation": mapIds(["HubSpot", "Salesforce", "LinkedIn", "Meta", "Google"]),
  "crm-setup-automation": mapIds(["HubSpot", "Salesforce", "Zapier", "Make", "n8n"])
};

let sql = `-- AUTO-GENERATED SQL TO LINK PLATFORMS & SERVICES\n\n`;

// 1. CLEAR existing linked_service_ids safely by initializing empty if null
sql += `-- Clear existing arrays to ensure no stale data\n`;
sql += `UPDATE platforms SET linked_service_ids = ARRAY[]::uuid[];\n\n`;

// 2. Loop through each service and generate UPDATE statement
for (const s of services) {
  const pIds = serviceMappings[s.slug];
  if (pIds && pIds.length > 0) {
    const arrayStr = pIds.map(id => `'${id}'::uuid`).join(', ');
    sql += `UPDATE services SET platform_ids = ARRAY[${arrayStr}] WHERE id = '${s.id}';\n`;
  } else {
    sql += `UPDATE services SET platform_ids = ARRAY[]::uuid[] WHERE id = '${s.id}';\n`;
  }
}

sql += `\n-- Populate linked_service_ids back into platforms\n`;

// 3. For each platform, find all services mapping to it, and generate array append
for (const p of platforms) {
  const sidList = [];
  for (const s of services) {
    if (serviceMappings[s.slug] && serviceMappings[s.slug].includes(p.id)) {
      sidList.push(s.id);
    }
  }
  
  if (sidList.length > 0) {
    const arrayStr = sidList.map(id => `'${id}'::uuid`).join(', ');
    sql += `UPDATE platforms SET linked_service_ids = ARRAY[${arrayStr}] WHERE id = '${p.id}';\n`;
  }
}

fs.writeFileSync('scripts/link-all-platforms.sql', sql, 'utf8');
console.log("Generated scripts/link-all-platforms.sql");
