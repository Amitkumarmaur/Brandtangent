UPDATE public.careers
SET description = $jd$<h2>About this role</h2>
<p>DigiiMark delivers <strong>always-on marketing systems</strong> for B2B clients&mdash;sites, automation, data pipelines, and integrations that have to stay fast, secure, and observable. We are hiring a <strong>Cloud Infrastructure Engineer</strong> to own how those systems run in production: from VPC layout and secrets to CI/CD, cost guardrails, and calm incident response.</p>
<p>You will work primarily on <strong>AWS</strong>, packaging workloads with <strong>Docker</strong> and orchestrating them with <strong>Kubernetes</strong> (EKS or equivalent patterns). You will partner closely with full-stack engineers and occasionally advise client teams on hardening and scale.</p>
<blockquote><p>We optimize for <strong>boring operations</strong>: repeatable runbooks, small blast radius, and changes that are easy to roll back.</p></blockquote>

<h2>What you will own</h2>
<ul>
<li><strong>Platform foundations:</strong> accounts/organizations, networking (VPC, subnets, routing, endpoints), IAM baselines, and least-privilege access patterns for humans and workloads.</li>
<li><strong>Runtime &amp; delivery:</strong> container images, cluster lifecycle, workload identities, autoscaling signals, and safe deployment strategies (blue/green, canary where appropriate).</li>
<li><strong>Infrastructure as code:</strong> Terraform, Pulumi, or equivalent&mdash;reviewable modules, environments that match prod, and drift detection you actually act on.</li>
<li><strong>CI/CD:</strong> pipelines for build, test, scan, sign, and promote; cache hygiene; artifact governance; secrets injection without sprawl.</li>
<li><strong>Observability &amp; reliability:</strong> metrics, logs, tracing, SLOs/SLIs, alerting that pages humans for actionable events&mdash;not noise.</li>
<li><strong>Security &amp; compliance hygiene:</strong> patching cadence, image scanning, dependency and SBOM practices, backup/restore drills, and sensible encryption in transit and at rest.</li>
<li><strong>Cost &amp; performance:</strong> right-sizing, savings plans where justified, and profiling spend drivers with engineering.</li>
</ul>

<h2>Technical scope</h2>
<p>You do not need every bullet on day one, but this is the terrain we expect you to grow mastery across:</p>
<ul>
<li><strong>AWS:</strong> IAM, VPC, ALB/NLB, ECS and/or EKS, RDS or managed Postgres patterns, S3 lifecycle, CloudWatch, KMS, Route53, WAF concepts.</li>
<li><strong>Kubernetes:</strong> workloads, services, ingress, HPA, resource quotas, network policies, RBAC, and safe cluster upgrades.</li>
<li><strong>Linux:</strong> networking, systemd basics, disk and memory troubleshooting, performance triage.</li>
<li><strong>Automation:</strong> GitHub Actions or similar; scripting in bash/Python/Go for glue when it reduces toil.</li>
</ul>

<h2>What we look for</h2>
<ul>
<li><strong>Experience:</strong> 4+ years operating production systems with real traffic, incidents, and change management&mdash;not only lab clusters.</li>
<li><strong>Judgment:</strong> you can explain tradeoffs (cost vs. resilience vs. velocity) and document decisions stakeholders can trust later.</li>
<li><strong>Collaboration:</strong> async-friendly updates, pairing with app engineers, and crisp handoffs during incidents.</li>
<li><strong>Security instinct:</strong> least privilege, secret rotation, blast-radius reduction, and skepticism toward &quot;just open the security group.&quot;</li>
</ul>

<h2>Bonus signals (not required)</h2>
<ul>
<li>Experience with Supabase/Vercel-style edge and serverless adjacent workloads alongside long-lived services.</li>
<li>FinOps habits: unit economics of infra, chargeback/showback reporting, and forecasting.</li>
<li>Prior agency or consulting pace with multiple concurrent engagements.</li>
</ul>

<h2>How we work</h2>
<p>This role is <strong>remote-first</strong> within regions where we can contract and maintain healthy overlap with teammates and clients. We bias toward written RFCs for risky changes, blameless postmortems, and automation that removes repetitive manual steps.</p>
<p>On-call may evolve as the practice grows&mdash;we aim for <strong>low toil</strong>, actionable alerts, and humane rotations.</p>

<h2>Interview process (typical)</h2>
<ol>
<li><strong>Intro call</strong> &mdash; scope, mutual fit, and how you like to operate on-call and under pressure.</li>
<li><strong>Systems conversation</strong> &mdash; design and tradeoffs across AWS/Kubernetes/CI&mdash;not trivia.</li>
<li><strong>Practical exercise</strong> &mdash; bounded scenario (diagram + runbook outline, or hands-on in a sandbox).</li>
<li><strong>Team meet</strong> &mdash; values, incident culture, and expectations on both sides.</li>
</ol>

<h2>Compensation &amp; growth</h2>
<p>We offer <strong>competitive compensation</strong> aligned with ownership of production outcomes. We share ranges transparently once we align on scope and seniority.</p>

<h2>Equal opportunity</h2>
<p>DigiiMark is an equal opportunity employer. We welcome applicants of all backgrounds and do not discriminate on the basis of race, religion, gender identity, sexual orientation, age, disability, or any other protected characteristic.</p>$jd$, team = 'Platform & Delivery'
WHERE id = '99999999-9999-4999-8999-999999999994';
