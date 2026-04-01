import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Shield, Users, Eye, Lock, Globe, Download, Trash2, Cookie, FileText, Server, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const effectiveDate = 'February 25, 2026';
  const lastUpdated = 'April 1, 2026';

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              GDPR · CCPA · UK GDPR
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground">
              Effective Date: {effectiveDate} · Last Updated: {lastUpdated}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>GDPR (EU) 2016/679</Badge>
              <Badge>UK GDPR</Badge>
              <Badge>CCPA / CPRA (California)</Badge>
              <Badge>EU AI Act 2024/1689</Badge>
              <Badge>EU Digital Services Act</Badge>
              <Badge>ePrivacy Directive 2002/58/EC</Badge>
              <Badge>Brazil LGPD</Badge>
              <Badge>CAN-SPAM Act</Badge>
              <Badge>COPPA (US)</Badge>
              <Badge>25+ jurisdictions</Badge>
            </div>
          </div>

          <Separator />

          {/* 1. Data Controller */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              1. Data Controller Information
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SuperNomad ("we", "us", "our") is the data controller responsible for your personal data processed through the SuperNomad application and website.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-1">
              <p className="text-sm"><strong>Data Controller:</strong> SuperNomad</p>
              <p className="text-sm"><strong>Email:</strong> privacy@supernomad.app</p>
              <p className="text-sm"><strong>Data Protection Officer (DPO):</strong> dpo@supernomad.app</p>
              <p className="text-sm"><strong>EU Representative (Art. 27 GDPR):</strong> eurep@supernomad.app</p>
              <p className="text-sm"><strong>UK Representative:</strong> ukrep@supernomad.app</p>
            </div>
          </section>

          <Separator />

          {/* 2. Data We Collect */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              2. Personal Data We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">2.1 Data You Provide Directly</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li><strong>Identity Data:</strong> Name, nationality, date of birth</li>
                  <li><strong>Contact Data:</strong> Email address, phone number</li>
                  <li><strong>Travel Data:</strong> Passport expiry dates, travel history, country entries/exits, visa information, vaccination records</li>
                  <li><strong>Financial Preferences:</strong> Currency preferences, tax residency selections, payment method metadata (encrypted), award card references (encrypted)</li>
                  <li><strong>Profile Data:</strong> Occupation, travel preferences, language preferences, demo persona selections</li>
                  <li><strong>Communication Data:</strong> Messages submitted to AI assistants (AI Doctor, AI Lawyer, AI Planner, Concierge), community chat messages (Nomad Pulse, Social Vibe), marketplace listings, support tickets</li>
                  <li><strong>Safety Data:</strong> Emergency contacts, Guardian activation logs (demo mode only), cyber incident reports, trusted peer designations</li>
                  <li><strong>Document Data:</strong> Encrypted document metadata stored in the Identity Vault (Snomad ID) — encrypted with AES-256-GCM, zero-knowledge architecture</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">2.2 Data Collected Automatically</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li><strong>Device Data:</strong> Device type, operating system, browser type and version, device fingerprint (for session isolation)</li>
                  <li><strong>Usage Data:</strong> Features used, interaction patterns, session duration, feature customisation preferences</li>
                  <li><strong>Location Data:</strong> GPS coordinates (only with your explicit consent for travel tracking and city services)</li>
                  <li><strong>AI Interaction Data:</strong> Conversation transcripts with AI features, AI-generated responses, memory distillations, knowledge graph relationships</li>
                  <li><strong>Cookie Data:</strong> As described in our Cookie Policy (Section 10)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">2.3 Data We Do NOT Collect</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>We do not collect biometric data, genetic data, or health data</li>
                  <li>We do not process payment card details directly (handled by third-party processors)</li>
                  <li>We do not collect data from children under 18</li>
                  <li>We do NOT sell, rent, or trade your personal data to any third party (CCPA §1798.120)</li>
                  <li>We do NOT share personal information for cross-context behavioural advertising</li>
                  <li>We do NOT use your data for automated decision-making that produces legal effects without human oversight (GDPR Art. 22, EU AI Act)</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* 3. How We Use Your Data */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. How We Use Your Data (Purposes of Processing)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 border-b border-border font-medium">Purpose</th>
                    <th className="text-left p-3 border-b border-border font-medium">Legal Basis (GDPR Art. 6)</th>
                    <th className="text-left p-3 border-b border-border font-medium">CCPA Category</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3">Provide core travel tracking features</td>
                    <td className="p-3">Contract performance (Art. 6(1)(b))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">GPS-based location tracking</td>
                    <td className="p-3">Consent (Art. 6(1)(a))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">AI assistant responses (Doctor, Lawyer, Planner, Concierge)</td>
                    <td className="p-3">Contract performance (Art. 6(1)(b))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Safety & emergency features (Guardian, SOS, Cyber Helpline)</td>
                    <td className="p-3">Vital interests (Art. 6(1)(d)) / Consent (Art. 6(1)(a))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Community features (Social Vibe, Nomad Pulse, Marketplace)</td>
                    <td className="p-3">Contract performance (Art. 6(1)(b))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">AI memory & knowledge graph (personalisation)</td>
                    <td className="p-3">Consent (Art. 6(1)(a)) / Legitimate interest (Art. 6(1)(f))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Analytics and service improvement</td>
                    <td className="p-3">Legitimate interest (Art. 6(1)(f))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Marketing communications</td>
                    <td className="p-3">Consent (Art. 6(1)(a))</td>
                    <td className="p-3">Commercial purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Tax, visa & immigration compliance tools</td>
                    <td className="p-3">Legitimate interest (Art. 6(1)(f))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Identity Vault (encrypted document storage)</td>
                    <td className="p-3">Consent (Art. 6(1)(a))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                  <tr>
                    <td className="p-3">Legal obligations (fraud prevention, regulatory compliance)</td>
                    <td className="p-3">Legal obligation (Art. 6(1)(c))</td>
                    <td className="p-3">Business purpose</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <Separator />

          {/* 4. Data Storage */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              4. Data Storage & Security
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.1. <strong>Client-Side Storage (Local-First):</strong> SuperNomad uses a privacy-first, local-first architecture. Your personal data (profile, travel tracking, preferences, Identity Vault documents) is stored in your browser's localStorage on your device. Sensitive data in the Identity Vault, Payment Options, and Award Cards is encrypted with AES-256-GCM using the Web Crypto API (zero-knowledge architecture — we cannot access your encrypted data). Data is not transmitted to our servers unless you use features requiring server communication.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.2. <strong>Server-Side Processing:</strong> When you use AI-powered features (AI Doctor, AI Lawyer, AI Planner, Concierge, Cyber Helpline, Support AI, City Services AI, Marketplace AI, Social Chat AI, Moving AI), your queries are transmitted to our Supabase Edge Functions, which forward sanitised inputs to third-party AI providers. We implement: input validation with Zod schemas, 5,000-character limits, HTML stripping, and prompt injection protection. AI conversation history and distilled memories are stored in our Supabase database with device-level Row-Level Security (RLS) isolation.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.3. <strong>Vector Embeddings & AI Memory:</strong> To provide personalised AI responses, we generate semantic embeddings (vector representations) of your conversation context using pgvector. These embeddings are mathematical representations that cannot be reverse-engineered into original text. They are stored in our database and isolated by your device ID.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.4. <strong>Security Measures:</strong> We implement appropriate technical and organisational measures including: HTTPS/TLS encryption in transit, AES-256-GCM encryption at rest for sensitive data, input sanitisation and HTML stripping, Row-Level Security (RLS) for database isolation, device fingerprinting for pre-authentication session security, and access controls. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <Separator />

          {/* 5. Data Retention */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Data Retention Periods</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 border-b border-border font-medium">Data Type</th>
                    <th className="text-left p-3 border-b border-border font-medium">Retention Period</th>
                    <th className="text-left p-3 border-b border-border font-medium">Justification</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3">Account / profile data</td>
                    <td className="p-3">Until account deletion + 30 days</td>
                    <td className="p-3">Service provision + grace period</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Travel history</td>
                    <td className="p-3">7 years</td>
                    <td className="p-3">Tax compliance requirements</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">AI chat logs</td>
                    <td className="p-3">90 days</td>
                    <td className="p-3">Service improvement</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Analytics data</td>
                    <td className="p-3">2 years</td>
                    <td className="p-3">Legitimate interest</td>
                  </tr>
                  <tr>
                    <td className="p-3">Marketing consent records</td>
                    <td className="p-3">Until withdrawal + 3 years</td>
                    <td className="p-3">Legal obligation (proof of consent)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <Separator />

          {/* 6. Your Rights - GDPR */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              6. Your Rights Under GDPR (EU/EEA/UK Users)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Under the GDPR, you have the following rights. We will respond to valid requests within 30 days (extendable by 60 days for complex requests):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Right of Access (Art. 15)', desc: 'Obtain a copy of all personal data we hold about you' },
                { title: 'Right to Rectification (Art. 16)', desc: 'Correct any inaccurate or incomplete personal data' },
                { title: 'Right to Erasure (Art. 17)', desc: 'Request deletion of your personal data ("right to be forgotten")' },
                { title: 'Right to Restrict Processing (Art. 18)', desc: 'Limit how we process your data in certain circumstances' },
                { title: 'Right to Data Portability (Art. 20)', desc: 'Receive your data in a structured, machine-readable format (JSON)' },
                { title: 'Right to Object (Art. 21)', desc: 'Object to processing based on legitimate interests or direct marketing' },
                { title: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time without affecting prior processing' },
                { title: 'Right to Lodge a Complaint', desc: 'File a complaint with your local Data Protection Authority (DPA)' },
              ].map((right) => (
                <div key={right.title} className="p-3 border border-border rounded-lg">
                  <p className="font-medium text-sm">{right.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{right.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* 7. CCPA Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Your Rights Under CCPA/CPRA (California Residents)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you are a California resident, you have additional rights under the CCPA as amended by the CPRA:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
              <li><strong>Right to Know:</strong> You have the right to request disclosure of the categories and specific pieces of personal information we have collected, the categories of sources, the business purpose for collection, and the categories of third parties with whom we share personal information.</li>
              <li><strong>Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions.</li>
              <li><strong>Right to Correct:</strong> You have the right to request correction of inaccurate personal information.</li>
              <li><strong>Right to Opt-Out of Sale/Sharing:</strong> SuperNomad does <strong>not sell</strong> your personal information. We do <strong>not share</strong> personal information for cross-context behavioural advertising.</li>
              <li><strong>Right to Limit Use of Sensitive Information:</strong> You may limit the use of sensitive personal information to purposes necessary to provide the Service.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To exercise your rights, email us at privacy@supernomad.app. We will verify your identity before processing your request. You may also designate an authorised agent to make requests on your behalf.
            </p>
          </section>

          <Separator />

          {/* 8. International Transfers */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              8. International Data Transfers
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When your data is processed by our AI features, it may be transferred to servers located outside your country of residence. We ensure appropriate safeguards are in place:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li><strong>EU-US Data Privacy Framework:</strong> Where applicable, we rely on the EU-US Data Privacy Framework for transfers to US-based processors certified under the framework</li>
              <li><strong>Standard Contractual Clauses (SCCs):</strong> We use EU Commission-approved SCCs (2021/914) with supplementary measures for transfers not covered by adequacy decisions</li>
              <li><strong>Adequacy Decisions:</strong> We rely on EU Commission adequacy decisions where available</li>
              <li><strong>UK International Data Transfer Agreement (IDTA):</strong> For transfers from the UK, we use the UK IDTA or the UK Addendum to the EU SCCs</li>
            </ul>
          </section>

          <Separator />

          {/* 9. Third-Party Processors */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Third-Party Data Processors</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the following categories of third-party processors:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 border-b border-border font-medium">Category</th>
                    <th className="text-left p-3 border-b border-border font-medium">Purpose</th>
                    <th className="text-left p-3 border-b border-border font-medium">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3">Cloud Infrastructure (Supabase)</td>
                    <td className="p-3">Edge function hosting, database, pgvector embeddings</td>
                    <td className="p-3">AI queries, conversation logs, community messages, device sessions</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">AI Model Providers (Google Gemini, OpenAI)</td>
                    <td className="p-3">AI Doctor, Lawyer, Planner, Concierge, Cyber Helpline, Support AI, City Services</td>
                    <td className="p-3">Sanitised user queries (PII stripped), conversation context</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Voice Services (ElevenLabs)</td>
                    <td className="p-3">Text-to-speech for Concierge AI</td>
                    <td className="p-3">Text content for voice synthesis (no PII)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Analytics Providers</td>
                    <td className="p-3">Usage analytics, performance monitoring</td>
                    <td className="p-3">Anonymised usage data, feature interaction patterns</td>
                  </tr>
                  <tr>
                    <td className="p-3">Payment Processors</td>
                    <td className="p-3">Subscription billing</td>
                    <td className="p-3">Payment details (not stored by SuperNomad)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <Separator />

          {/* 10. Cookie Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              10. Cookie Policy
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies and similar technologies in accordance with the ePrivacy Directive (2002/58/EC) and applicable national implementations. You can manage your cookie preferences at any time through our cookie banner.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 border-b border-border font-medium">Cookie Type</th>
                    <th className="text-left p-3 border-b border-border font-medium">Purpose</th>
                    <th className="text-left p-3 border-b border-border font-medium">Consent Required</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3">Strictly Necessary</td>
                    <td className="p-3">Essential functionality, authentication</td>
                    <td className="p-3">No (exempt under ePrivacy)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Functional</td>
                    <td className="p-3">Language preferences, UI settings</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Analytics</td>
                    <td className="p-3">Usage statistics, performance monitoring</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3">Marketing</td>
                    <td className="p-3">Personalised advertising (if applicable)</td>
                    <td className="p-3">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <Separator />

          {/* 11. Children */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">11. Children's Privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Service is not directed to individuals under the age of 18 (or 16 in certain EU Member States). We do not knowingly collect personal data from children. If we become aware that we have collected personal data from a child without parental consent, we will take steps to delete that data promptly. If you believe we have collected data from a child, please contact us at privacy@supernomad.app.
            </p>
          </section>

          <Separator />

          {/* 12. Do Not Track */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">12. Do Not Track & Global Privacy Control</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We honour the Global Privacy Control (GPC) signal as required by the CCPA/CPRA. When we detect a GPC signal, we treat it as a valid opt-out of the sale or sharing of personal information. We also respect browser-level "Do Not Track" (DNT) signals by disabling non-essential analytics tracking.
            </p>
          </section>

          <Separator />

          {/* 13. Data Breach */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              13. Data Breach Notification
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours as required by GDPR Article 33. If the breach poses a high risk, we will also notify affected individuals directly (GDPR Article 34). For California residents, we will comply with the data breach notification requirements under California Civil Code §1798.82.
            </p>
          </section>

          <Separator />

          {/* 14. US State Privacy Laws */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">14. Additional US State Privacy Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In addition to CCPA/CPRA, we comply with applicable state privacy laws including:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li><strong>Virginia (VCDPA):</strong> Right to access, correct, delete, and opt out of targeted advertising and profiling</li>
              <li><strong>Colorado (CPA):</strong> Right to opt out of targeted advertising, sale, and profiling</li>
              <li><strong>Connecticut (CTDPA):</strong> Right to access, correct, delete, and data portability</li>
              <li><strong>Utah (UCPA):</strong> Right to access, delete, and opt out of sale and targeted advertising</li>
              <li><strong>Texas (TDPSA), Oregon (OCPA), Montana (MCDPA), Iowa, Delaware, New Hampshire, New Jersey, Nebraska, Maryland, Minnesota, Indiana, Kentucky, Tennessee, Rhode Island:</strong> Applicable rights as provided by each state's respective privacy law</li>
            </ul>
          </section>

          <Separator />

          {/* 15. Changes */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">15. Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Material changes will be communicated at least 30 days before they take effect via email or in-app notification. The "Last Updated" date at the top of this policy indicates when the latest revision was made. We encourage you to review this policy periodically.
            </p>
          </section>

          <Separator />

          {/* 16. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">16. Contact Us</h2>
            <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-1">
              <p className="text-sm"><strong>SuperNomad – Privacy Team</strong></p>
              <p className="text-sm text-muted-foreground">General: privacy@supernomad.app</p>
              <p className="text-sm text-muted-foreground">Data Protection Officer: dpo@supernomad.app</p>
              <p className="text-sm text-muted-foreground">CCPA Requests: ccpa@supernomad.app</p>
              <p className="text-sm text-muted-foreground">Data Subject Requests: rights@supernomad.app</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              EU residents may lodge a complaint with their local supervisory authority. A list of EU DPAs is available at{' '}
              <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                edpb.europa.eu
              </a>.
            </p>
          </section>

          <div className="pt-4 pb-8 flex gap-3">
            <Button onClick={() => navigate(-1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => navigate('/terms')}>
              <FileText className="h-4 w-4 mr-2" />
              Terms & Conditions
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicy;
