-- SQL Script to update bidirectional linking between Services and Platforms
-- Run this in your Supabase SQL Editor.

-- 'CRM Setup & Automation' Service ID: 0029f6b1-da31-401f-b19e-1b401c1e5bbb
-- 'Workflow Automation' Service ID: 07504cd8-80e7-4884-8fc4-5e5ff8feb757

-------------------------------------------------------------------------------
-- 1. Update platform_ids on the Services table
-------------------------------------------------------------------------------

UPDATE services 
SET platform_ids = ARRAY[
    '7a606d5a-ed50-4d64-8247-11c517e24936'::uuid, -- HubSpot
    '9b3f5712-5811-44a4-a119-7ecc05c0f749'::uuid, -- Salesforce
    'ee2c529f-d460-48ba-921f-d3132867e7c9'::uuid, -- Zapier
    '0936543d-d5e2-48fd-ab14-f8f5f957c50b'::uuid, -- Make
    '79d67caf-7a74-4b30-b220-f6a4048988e0'::uuid  -- n8n
] 
WHERE id = '0029f6b1-da31-401f-b19e-1b401c1e5bbb';

UPDATE services 
SET platform_ids = ARRAY[
    'ee2c529f-d460-48ba-921f-d3132867e7c9'::uuid, -- Zapier
    '0936543d-d5e2-48fd-ab14-f8f5f957c50b'::uuid, -- Make
    '79d67caf-7a74-4b30-b220-f6a4048988e0'::uuid, -- n8n
    'edc34603-1255-4e17-9cf2-42197885df28'::uuid, -- ChatGPT
    '3b6741e2-d740-4919-87cf-74e8b14e4805'::uuid  -- Claude
] 
WHERE id = '07504cd8-80e7-4884-8fc4-5e5ff8feb757';

-------------------------------------------------------------------------------
-- 2. Update linked_service_ids on the Platforms table (Bidirectional Link)
-------------------------------------------------------------------------------

-- HubSpot (Linked to CRM)
UPDATE platforms 
SET linked_service_ids = array_append(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid)
WHERE id = '7a606d5a-ed50-4d64-8247-11c517e24936';

-- Salesforce (Linked to CRM)
UPDATE platforms 
SET linked_service_ids = array_append(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid)
WHERE id = '9b3f5712-5811-44a4-a119-7ecc05c0f749';

-- Zapier (Linked to CRM & Workflow)
UPDATE platforms 
SET linked_service_ids = array_append(
    array_append(
        array_remove(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid),
        '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid
    ),
    '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid
)
WHERE id = 'ee2c529f-d460-48ba-921f-d3132867e7c9';

-- Make (Linked to CRM & Workflow)
UPDATE platforms 
SET linked_service_ids = array_append(
    array_append(
        array_remove(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid),
        '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid
    ),
    '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid
)
WHERE id = '0936543d-d5e2-48fd-ab14-f8f5f957c50b';

-- n8n (Linked to CRM & Workflow)
UPDATE platforms 
SET linked_service_ids = array_append(
    array_append(
        array_remove(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid),
        '0029f6b1-da31-401f-b19e-1b401c1e5bbb'::uuid
    ),
    '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid
)
WHERE id = '79d67caf-7a74-4b30-b220-f6a4048988e0';

-- ChatGPT (Linked to Workflow)
UPDATE platforms 
SET linked_service_ids = array_append(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid)
WHERE id = 'edc34603-1255-4e17-9cf2-42197885df28';

-- Claude (Linked to Workflow)
UPDATE platforms 
SET linked_service_ids = array_append(array_remove(COALESCE(linked_service_ids, ARRAY[]::uuid[]), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid), '07504cd8-80e7-4884-8fc4-5e5ff8feb757'::uuid)
WHERE id = '3b6741e2-d740-4919-87cf-74e8b14e4805';
