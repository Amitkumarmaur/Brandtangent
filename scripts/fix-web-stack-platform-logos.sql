-- Fix Devicon logo URLs for core web-stack rows in `platforms`.
-- These UUIDs match scripts/generate-sql.mjs (Next.js, React, Node.js, PostgreSQL, Tailwind CSS).
-- Run in Supabase SQL Editor so the database matches what the site shows and other consumers stay consistent.
--
-- Service "Custom Web Applications" (slug: custom-web-applications) links via services.platform_ids
-- to these platform rows when generated with link-all-platforms.sql.

UPDATE platforms SET logo = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'
WHERE id = '11111111-1111-4111-8111-111111111111';

UPDATE platforms SET logo = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
WHERE id = '11111111-1111-4111-8111-111111111112';

UPDATE platforms SET logo = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
WHERE id = '11111111-1111-4111-8111-111111111113';

UPDATE platforms SET logo = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
WHERE id = '11111111-1111-4111-8111-111111111114';

UPDATE platforms SET logo = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'
WHERE id = '11111111-1111-4111-8111-111111111115';
