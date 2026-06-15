"use client"

import { motion } from "motion/react"
import { Shield } from "lucide-react"

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
      <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
        {children}
      </span>
    </div>
  )
}

export default function PrivacyContent() {
  return (
    <main className="relative overflow-hidden bg-white">
      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-white border-b border-border">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Eyebrow>Legal</Eyebrow>
            <h1 className="heading-h1 text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: January 01, 2025
            </p>
            <div className="mt-8 flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-[rgba(28,28,28,0.06)] flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-sm font-medium">Your data security is our priority.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="w-full max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-neutral max-w-none"
          >
            <div className="space-y-12">
              <section>
                <p className="text-muted-foreground text-lg leading-relaxed italic">
                  At Brandtangent, your privacy is our priority. Our policy transparently explains how we collect, use, and protect your information while delivering innovative, custom-tailored brand and digital solutions that empower your business.
                </p>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Brandtangent ("we," "us," or "our") is a creative agency dedicated to growing brands online. We provide full-service, custom-tailored brand strategy and digital solutions that increase brand awareness, drive conversions, and generate leads. This Privacy Policy explains how we collect, use, disclose, and protect your information when you access or use our website, digital platforms, and services ("Services"). By using our Services, you agree to the collection and use of information in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">2. Information We Collect</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-foreground font-semibold text-xl mb-3">Personal Information:</h3>
                    <p className="text-muted-foreground mb-4">When you interact with our website or engage with our Services, we may collect personally identifiable information ("Personal Information") such as:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Name, email address, telephone number, and mailing address.</li>
                      <li>Company name and job title, if applicable.</li>
                      <li>Payment and billing information.</li>
                      <li>Any additional information you voluntarily provide through forms, surveys, or communications.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-xl mb-3">Non-Personal Information:</h3>
                    <p className="text-muted-foreground mb-4">We also collect non-personal data, including but not limited to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Browser type, device information, IP address, and operating system.</li>
                      <li>Usage data and analytics on how you interact with our website and digital content.</li>
                      <li>Cookies and similar tracking technologies.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the collected information for several purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Service Provision:</strong> To operate and improve our Services, tailor brand and marketing strategies, and manage client relationships.</li>
                  <li><strong className="text-foreground">Communication:</strong> To send administrative information, promotional materials, and customer support communications.</li>
                  <li><strong className="text-foreground">Analytics &amp; Optimization:</strong> To analyze trends, monitor user engagement, and enhance the digital experience.</li>
                  <li><strong className="text-foreground">Legal &amp; Compliance:</strong> To comply with legal obligations, enforce our agreements, and protect the rights, property, or safety of Brandtangent, our users, or others.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">4. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website uses cookies, web beacons, and other tracking technologies to enhance user experience, analyze site usage, and assist in our marketing efforts. You have the option to accept or decline cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">5. Disclosure and Sharing of Your Information</h2>
                <p className="text-muted-foreground mb-4">We do not sell your personal data. However, we may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Service Providers:</strong> Trusted third-party vendors and partners who assist in operating our website, conducting our business, or servicing you.</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> When required by law, Brandtangent may disclose your information to comply with legal obligations.</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred as part of the transaction.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your information for as long as is necessary to fulfill the purposes for which it was collected, comply with our legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">7. Data Security</h2>
                <p className="text-muted-foreground mb-4">We implement robust security measures to protect your data, including:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Data encryption both in transit and at rest.</li>
                  <li>Regular security assessments and monitoring.</li>
                  <li>Restricted access controls and authentication protocols.</li>
                </ul>
                <p className="text-muted-foreground mt-4 italic">Note: while we strive to protect your personal information, no method of transmission over the internet is 100% secure.</p>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">8. Your Rights and Choices</h2>
                <p className="text-muted-foreground mb-4">Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and update your personal information.</li>
                  <li>Request correction or deletion of your data.</li>
                  <li>Object to or restrict our processing of your information.</li>
                  <li>Request data portability.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="heading-h2 text-foreground mb-6">10. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page along with the updated effective date.
                </p>
              </section>

              <section className="bg-white rounded-md p-8 border border-border">
                <h2 className="text-foreground font-semibold text-xl mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
                </p>
                <a
                  href="mailto:hello@brandtangent.com"
                  className="inline-flex items-center gap-2 text-foreground font-medium underline hover:opacity-70 transition-opacity"
                >
                  hello@brandtangent.com
                </a>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
