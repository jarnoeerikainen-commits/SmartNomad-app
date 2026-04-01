import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Shield, FileText, Scale, Globe, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
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
              EU · USA · Global
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold">Terms & Conditions</h1>
            </div>
            <p className="text-muted-foreground">
              Effective Date: {effectiveDate} · Last Updated: {lastUpdated}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>GDPR Compliant</Badge>
              <Badge>CCPA / CPRA Compliant</Badge>
              <Badge>EU AI Act 2024/1689</Badge>
              <Badge>ePrivacy Directive</Badge>
              <Badge>UK GDPR</Badge>
              <Badge>25+ jurisdictions</Badge>
            </div>
          </div>

          <Separator />

          {/* 1. Agreement */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", "your") and SuperNomad ("Company", "we", "us", "our"), governing your access to and use of the SuperNomad application, website, and all related services (collectively, the "Service").
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Service.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms apply to all visitors, users, and others who access or use the Service, whether through a web browser, mobile application, or any other means. You must be at least 18 years of age or the age of majority in your jurisdiction to use this Service.
            </p>
          </section>

          <Separator />

          {/* 2. Service Description */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Description of Service</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SuperNomad is a digital platform designed for digital nomads, expatriates, and frequent travellers. The Service provides tools for:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Travel day tracking and country stay-limit monitoring (130+ countries, 50 US states)</li>
              <li>Tax residency tracking and compliance guidance (Schengen, Substantial Presence Test)</li>
              <li>Visa management, ETIAS 2026, and immigration document tracking (37 visa types)</li>
              <li>AI-powered travel assistance (AI Doctor, AI Lawyer, AI Planner, Concierge)</li>
              <li>Identity Vault (Snomad ID) with AES-256-GCM encrypted document storage</li>
              <li>Currency conversion, digital banking, payment management, and financial tools</li>
              <li>Emergency services, SOS, embassy directory, and safety information</li>
              <li>Black Box Guardian personal safety system (DEMO MODE)</li>
              <li>Cyber Helpline & Threat Intelligence monitoring</li>
              <li>Community features: Social Vibe, Nomad Pulse, Marketplace</li>
              <li>Local services discovery, weather, wellness, and recommendations</li>
              <li>Vaccination & medicine tracking (WHO-sourced data)</li>
              <li>Help & Support AI with auto-updated feature knowledge</li>
            </ul>
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Important Disclaimer:</strong> SuperNomad provides informational tools and guidance only. The Service does not constitute legal, tax, financial, medical, or immigration advice. Always consult qualified professionals for decisions affecting your legal or financial situation.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 3. User Accounts */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. User Accounts & Registration</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              3.1. You may use certain features of the Service without creating an account. Creating an account may be required to access premium features.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              3.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              3.3. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              3.4. We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent or harmful activities.
            </p>
          </section>

          <Separator />

          {/* 4. Subscriptions */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Subscriptions & Payments</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.1. <strong>Free Tier:</strong> The Service offers a free tier with limited functionality. Free tier access may be modified or discontinued at our discretion.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.2. <strong>Paid Subscriptions:</strong> Premium features are available through paid subscription plans ("PRO"). Subscription fees are billed in advance on a recurring basis (monthly or annually) as indicated at the time of purchase.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.3. <strong>Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period. You may cancel at any time through your account settings.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.4. <strong>Refund Policy:</strong> Refunds are provided in accordance with applicable consumer protection laws. EU consumers have a 14-day right of withdrawal from the date of purchase, unless the digital content has been fully accessed or downloaded with prior express consent and acknowledgement that the right of withdrawal is lost. For all other jurisdictions, refund requests are handled on a case-by-case basis within 30 days of purchase.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4.5. <strong>Price Changes:</strong> We reserve the right to change subscription fees. Existing subscribers will receive at least 30 days' notice before any price increase takes effect.
            </p>
          </section>

          <Separator />

          {/* 5. Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Acceptable Use Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">You agree not to:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Interfere with or disrupt the Service's infrastructure or security</li>
              <li>Upload malicious software, viruses, or harmful code</li>
              <li>Scrape, crawl, or harvest data from the Service without permission</li>
              <li>Use the AI features to generate harmful, discriminatory, or illegal content</li>
              <li>Share false or misleading information in community features</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Use automated systems (bots) to access the Service without express consent</li>
            </ul>
          </section>

          <Separator />

          {/* 6. Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Intellectual Property Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              6.1. The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of SuperNomad and its licensors. The Service is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              6.2. You retain ownership of any content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free licence to use, reproduce, modify, and display such content solely for the purpose of operating and improving the Service.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              6.3. The SuperNomad name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of SuperNomad. You may not use such marks without our prior written permission.
            </p>
          </section>

          <Separator />

          {/* 7. AI Services Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. AI-Powered Features Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              7.1. SuperNomad integrates artificial intelligence features including but not limited to: AI Travel Assistant (Concierge), AI Travel Doctor, AI Travel Lawyer, AI Travel Planner, Cyber Helpline, Support AI, City Services AI, Marketplace AI, Social Chat AI, Moving AI Assistant, and Subject Chat Moderator. These features are powered by third-party large language models (LLMs) including Google Gemini and OpenAI models.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              7.2. <strong>No Professional Advice:</strong> AI-generated responses do not constitute professional medical, legal, financial, tax, immigration, or security advice. The AI features provide general informational guidance only and should not be relied upon as a substitute for professional consultation. You accept full responsibility for any decisions made based on AI-generated content.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              7.3. <strong>Accuracy & Hallucinations:</strong> While we strive for accuracy, AI-generated content may contain errors, inaccuracies, hallucinations, or outdated information. We do not guarantee the completeness, reliability, or suitability of AI-generated content. SuperNomad expressly disclaims all liability for losses arising from reliance on AI outputs.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              7.4. <strong>Data Processing & EU AI Act:</strong> Queries submitted to AI features are processed by third-party AI service providers. We implement input sanitisation, character limits, and prompt injection protection. Please do not submit sensitive personal data to AI chat features. Pursuant to the EU AI Act (Regulation 2024/1689), all AI-generated content is transparently labelled and no autonomous decisions with legal effects are made by our AI systems.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              7.5. <strong>AI Memory & Personalisation:</strong> SuperNomad may store distilled facts and semantic embeddings from your AI conversations to improve future interactions. You may delete this data at any time through the Data Management settings. AI memories are isolated by device and cannot be accessed by other users.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              7.6. <strong>Safety Features — DEMO MODE:</strong> The Black Box Guardian, SOS Services, and emergency AI features operate exclusively in DEMO MODE in the current version. NO real emergency calls, police alerts, GPS tracking signals, or distress notifications are transmitted to any emergency service, law enforcement agency, or third party. SuperNomad is not a licensed security service, emergency response provider, or law enforcement agency. In any genuine emergency, you must contact local emergency services directly (112 EU, 911 US, 999 UK, 000 AU).
            </p>
          </section>

          <Separator />

          {/* 8. Data & Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Data Protection & Privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              8.1. Your privacy is important to us. Our collection and use of personal data is governed by our <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate('/privacy-policy')}>Privacy Policy</Button>, which is incorporated into these Terms by reference.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              8.2. <strong>Local Storage:</strong> SuperNomad primarily stores user data (profiles, tracking data, preferences) in your browser's local storage. This means your data remains on your device and is not transmitted to our servers unless you explicitly use features that require server communication (e.g., AI chat, community features).
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              8.3. We comply with applicable data protection laws including the EU General Data Protection Regulation (GDPR), the UK GDPR, the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA), and other applicable US state privacy laws.
            </p>
          </section>

          <Separator />

          {/* 9. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              9.1. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SUPERNOMAD, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Your access to or use of, or inability to access or use, the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service, including AI-generated content, AI Doctor/Lawyer/Planner outputs</li>
              <li>Unauthorised access, use, or alteration of your transmissions or content</li>
              <li>Tax, visa, immigration, or financial decisions made based on Service information</li>
              <li>Inaccuracies in travel day calculations, tax residency tracking, visa monitoring, or Schengen calculations</li>
              <li>Actions taken or not taken based on Black Box Guardian, SOS Services, or Cyber Helpline outputs</li>
              <li>Medical, legal, or security decisions influenced by AI-generated responses</li>
              <li>Data loss from the Identity Vault, browser localStorage clearing, or device changes</li>
              <li>Disruptions to third-party services (AI providers, payment processors, mapping services)</li>
              <li>Currency conversion inaccuracies or exchange rate fluctuations</li>
              <li>Community content posted by other users in Social Vibe, Nomad Pulse, or Marketplace</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              9.2. Our total aggregate liability to you for all claims arising out of or relating to the Service shall not exceed the greater of (a) the amount you paid to us in the twelve (12) months preceding the claim, or (b) one hundred euros (€100) / one hundred US dollars ($100).
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              9.3. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SUPERNOMAD EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              9.4. Nothing in these Terms excludes or limits liability for (a) death or personal injury caused by negligence, (b) fraud or fraudulent misrepresentation, or (c) any liability that cannot be excluded or limited under applicable law, including mandatory consumer protection rights under EU law.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              9.5. <strong>Force Majeure:</strong> SuperNomad shall not be liable for any failure or delay in performance resulting from circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, pandemic, war, terrorism, cyber attacks, power outages, or disruptions to third-party services including AI model providers, cloud infrastructure, and telecommunications networks.
            </p>
          </section>

          <Separator />

          {/* 10. Indemnification */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Indemnification</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to defend, indemnify, and hold harmless SuperNomad and its licensors, service providers, employees, agents, officers, and directors from and against any claims, damages, obligations, losses, liabilities, costs, or expenses arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) your content submitted through the Service. This indemnification obligation shall survive termination of these Terms. This clause does not apply to the extent prohibited by applicable consumer protection laws.
            </p>
          </section>

          <Separator />

          {/* 11. Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">11. Third-Party Services & Links</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              11.1. The Service may contain links to or integrations with third-party websites, services, or applications ("Third-Party Services"), including but not limited to AI model providers, payment processors, mapping services, and news aggregators.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              11.2. We do not control and are not responsible for the content, privacy policies, or practices of any Third-Party Services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by or in connection with your use of any Third-Party Services.
            </p>
          </section>

          <Separator />

          {/* 12. Termination */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">12. Termination</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              12.1. You may terminate your account at any time by deleting your data through the Settings panel or by contacting us at support@supernomad.app.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              12.2. We may terminate or suspend your access immediately, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              12.3. Upon termination, your right to use the Service will immediately cease. Provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <Separator />

          {/* 13. Governing Law */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">13. Governing Law & Dispute Resolution</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              13.1. <strong>For EU/EEA Users:</strong> These Terms shall be governed by and construed in accordance with the laws of the European Union and the Member State of your habitual residence. Nothing in these Terms affects your rights as a consumer under the mandatory consumer protection laws of your country of residence. You may bring proceedings in the courts of your habitual residence. You may also use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://ec.europa.eu/consumers/odr</a>.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              13.2. <strong>For UK Users:</strong> These Terms shall be governed by the laws of England and Wales. You may bring proceedings in the courts of England and Wales, Scotland, or Northern Ireland depending on where you live.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              13.3. <strong>For US Users:</strong> These Terms shall be governed by the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes shall first be subject to good-faith mediation. If mediation fails, disputes shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Consumer Arbitration Rules. You agree that any arbitration shall be conducted on an individual basis and not as a class action. Nothing in this section prevents either party from seeking injunctive relief in court.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              13.4. <strong>For All Other Users:</strong> These Terms shall be governed by the laws of the jurisdiction of your habitual residence, to the extent those laws provide mandatory consumer protections that cannot be overridden by contract. Otherwise, the laws of the European Union shall apply.
            </p>
          </section>

          <Separator />

          {/* 14. Changes */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">14. Changes to Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              14.1. We reserve the right to modify or replace these Terms at any time. Material changes will be communicated at least 30 days before they take effect via email or in-app notification.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              14.2. Your continued use of the Service after such changes constitutes acceptance of the new Terms. If you do not agree with the revised Terms, you must stop using the Service and may request deletion of your data.
            </p>
          </section>

          <Separator />

          {/* 15. Severability */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">15. Severability & Waiver</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              15.1. If any provision of these Terms is held to be unenforceable or invalid, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              15.2. No waiver of any provision of these Terms shall be deemed a further or continuing waiver of such term or any other term.
            </p>
          </section>

          <Separator />

          {/* 16. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">16. Contact Information</h2>
            <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-1">
              <p className="text-sm"><strong>SuperNomad</strong></p>
              <p className="text-sm text-muted-foreground">Email: legal@supernomad.app</p>
              <p className="text-sm text-muted-foreground">Support: support@supernomad.app</p>
              <p className="text-sm text-muted-foreground">Data Protection Officer: dpo@supernomad.app</p>
            </div>
          </section>

          <div className="pt-4 pb-8 flex gap-3">
            <Button onClick={() => navigate(-1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => navigate('/privacy-policy')}>
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TermsAndConditions;
