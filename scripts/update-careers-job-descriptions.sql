-- DigiiMark — full job descriptions for public.careers
-- Run in Supabase SQL Editor (service role / owner). Public anon keys cannot UPDATE under typical RLS.
-- After this runs, the same HTML is rendered on /careers/[slug] because pages read from this table.

UPDATE public.careers
SET description = $jd$
<p>DigiiMark builds AI-first marketing and product systems for B2B teams. We are hiring a <strong>Senior Full Stack Engineer</strong> to own features end-to-end—from schema and APIs to polished UI in production.</p>
<h3>What you will do</h3>
<ul>
<li>Design and ship web applications on <strong>Next.js (App Router)</strong> with strict TypeScript and predictable data loading patterns.</li>
<li>Model data in <strong>Supabase (Postgres)</strong>, write efficient queries, and collaborate on Row Level Security where product access requires it.</li>
<li>Implement integrations (CRM, analytics, automation tools) with clear error handling, observability, and documentation.</li>
<li>Partner with designers and strategists to translate complex workflows into fast, accessible interfaces.</li>
<li>Review code, improve performance (Core Web Vitals, bundle size, caching), and raise the bar for reliability.</li>
</ul>
<h3>What we look for</h3>
<ul>
<li>5+ years shipping production web software; strong React fundamentals and server/client boundary judgment.</li>
<li>Comfort owning a vertical slice: database shapes, API contracts, UI states, and deployment.</li>
<li>Experience with modern CSS (Tailwind or equivalent), forms, auth flows, and secure handling of user uploads.</li>
<li>Clear written communication; async-friendly collaboration across time zones.</li>
</ul>
<h3>Nice to have</h3>
<ul>
<li>Experience with marketing automation, attribution, or B2B SaaS admin surfaces.</li>
<li>Familiarity with edge runtimes, background jobs, or workflow engines.</li>
</ul>
<p>We work <strong>remote-first</strong> with overlap for key ceremonies. Compensation is competitive and aligned with ownership and impact.</p>
$jd$
WHERE id = '99999999-9999-4999-8999-999999999991';

UPDATE public.careers
SET description = $jd$
<p>We are growing our organic growth practice and need an <strong>SEO Specialist</strong> who can connect technical SEO, content strategy, and measurable revenue outcomes for B2B clients.</p>
<h3>What you will do</h3>
<ul>
<li>Run technical audits (crawl budget, indexation, structured data, internal linking, page experience) and prioritize fixes with engineering.</li>
<li>Build keyword and topic models aligned to buyer journeys; partner on briefs that match search intent and brand voice.</li>
<li>Monitor performance in Search Console and analytics; report trends with clear recommendations.</li>
<li>Stay current on algorithm updates, SERP changes, and <strong>Generative Engine Optimization (GEO)</strong> where it affects visibility.</li>
<li>Collaborate with paid media and product marketing to align landing experiences with campaigns.</li>
</ul>
<h3>What we look for</h3>
<ul>
<li>3+ years hands-on SEO for websites with meaningful complexity (multi-locale, large templates, or regulated industries is a plus).</li>
<li>Strong grasp of HTML rendering basics, redirects, canonicalization, and log analysis concepts.</li>
<li>Excellent communication with stakeholders; comfort presenting in client calls.</li>
</ul>
<p>This role is based in <strong>Dubai, UAE</strong> with hybrid flexibility. English fluency is required.</p>
$jd$
WHERE id = '99999999-9999-4999-8999-999999999992';

UPDATE public.careers
SET description = $jd$
<p>We are hiring a <strong>UI/UX Designer</strong> to craft interfaces that feel engineered: clear hierarchy, disciplined components, and outcomes-focused UX for B2B products and marketing experiences.</p>
<h3>What you will do</h3>
<ul>
<li>Lead discovery workshops, map user flows, and translate requirements into <strong>Figma</strong> systems (components, variants, documentation).</li>
<li>Produce high-fidelity UI for web, balancing brand expression with accessibility (contrast, focus states, keyboard paths).</li>
<li>Work closely with engineers to implement designs in Next.js + Tailwind with pixel-appropriate pragmatism.</li>
<li>Prototype interactions where motion clarifies state; validate ideas with lightweight usability checks.</li>
<li>Maintain and evolve a shared design language across client engagements.</li>
</ul>
<h3>What we look for</h3>
<ul>
<li>Portfolio demonstrating product UI, marketing sites, or complex dashboards—not only static brand decks.</li>
<li>Strong typography, layout, and information architecture instincts; comfort with data-dense screens.</li>
<li>Experience collaborating in cross-functional teams with tight iteration loops.</li>
</ul>
<p>Location: <strong>Dubai</strong>. We value craft, clarity, and kindness in critique.</p>
$jd$
WHERE id = '99999999-9999-4999-8999-999999999993';

UPDATE public.careers
SET description = $jd$
<p>DigiiMark ships reliable systems for clients who cannot afford downtime. We need a <strong>Cloud Infrastructure Engineer</strong> to harden and scale our delivery platform on <strong>AWS</strong> with <strong>Docker</strong> and <strong>Kubernetes</strong>.</p>
<h3>What you will do</h3>
<ul>
<li>Design and operate environments for web apps, data pipelines, and automation services (networking, secrets, backups, patching).</li>
<li>Implement infrastructure as code, reproducible environments, and CI/CD pipelines with safe rollbacks.</li>
<li>Improve observability: metrics, logs, tracing, SLOs, and incident response playbooks.</li>
<li>Collaborate with application engineers on performance, cost, and security tradeoffs.</li>
<li>Participate in on-call rotation as the practice matures (we aim for low toil).</li>
</ul>
<h3>What we look for</h3>
<ul>
<li>4+ years operating production systems on AWS (IAM, VPC, ECS/EKS or equivalent, RDS/S3 patterns).</li>
<li>Solid Linux fundamentals; experience packaging services with Docker and orchestrating with Kubernetes.</li>
<li>Security-first mindset: least privilege, secret hygiene, dependency and image governance.</li>
</ul>
<p><strong>Remote</strong> within regions where we can contract and support healthy overlap with client teams.</p>
$jd$
WHERE id = '99999999-9999-4999-8999-999999999994';

UPDATE public.careers
SET description = $jd$
<p>We are hiring an <strong>AI/ML Content Strategist</strong> (part-time to start) to help clients plan editorial systems that combine human judgment with scalable AI workflows—without sacrificing accuracy or brand trust.</p>
<h3>What you will do</h3>
<ul>
<li>Design content programs across SEO, thought leadership, and lifecycle touchpoints with clear measurement.</li>
<li>Build prompt libraries, style guides, and QA rubrics so generated drafts are reviewable and on-brand.</li>
<li>Partner with engineers on retrieval, tooling, and governance (citations, disclaimers, PII boundaries).</li>
<li>Educate client teams on responsible use of AI in marketing operations.</li>
<li>Analyze performance signals and iterate on briefs, templates, and distribution.</li>
</ul>
<h3>What we look for</h3>
<ul>
<li>Demonstrated experience in B2B content strategy, editorial planning, or product marketing writing.</li>
<li>Hands-on experimentation with LLM tools; structured thinking about evaluation and risk.</li>
<li>Excellent writing and editing; comfort presenting recommendations with evidence.</li>
</ul>
<p>This is a <strong>part-time</strong>, <strong>remote</strong> role with flexible hours; scope can grow with results.</p>
$jd$
WHERE id = '99999999-9999-4999-8999-999999999995';
