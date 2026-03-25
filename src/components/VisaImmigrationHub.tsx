import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Globe, ExternalLink, Search, Building, Star, Shield, FileText,
  Plane, MapPin, DollarSign, Clock, Users, CheckCircle, AlertCircle,
  Phone, Mail, Smartphone, BookOpen, ChevronRight, Award, Landmark,
  ArrowRight, Info
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface VisaServiceProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  type: 'global' | 'regional' | 'specialist';
  services: string[];
  countriesCovered: number;
  pricing: string;
  processingTime: string;
  rating: number;
  verified: boolean;
  featured?: boolean;
  contact?: { phone?: string; email?: string };
  appLinks?: { ios?: string; android?: string };
}

interface CountryImmigrationInfo {
  code: string;
  name: string;
  flag: string;
  region: string;
  governmentPortal: string;
  immigrationWebsite: string;
  passportWebsite: string;
  visaApplicationUrl: string;
  eVisaAvailable: boolean;
  visaOnArrival: string[];
  passportRenewalCost: string;
  visaApplicationCost: string;
  processingTime: string;
  emergencyContact: string;
  notes: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICE_PROVIDERS: VisaServiceProvider[] = [
  {
    id: 'vfs-global',
    name: 'VFS Global',
    logo: '🌐',
    description: 'World\'s largest outsourcing and technology services specialist for governments and diplomatic missions. Processes visa applications for 67 governments across 147 countries.',
    website: 'https://www.vfsglobal.com',
    type: 'global',
    services: ['Visa Application Processing', 'Biometric Enrollment', 'Passport Services', 'Consular Services', 'Attestation Services', 'eVisa Support'],
    countriesCovered: 147,
    pricing: 'Service fees vary by country ($20-$80 + government visa fee)',
    processingTime: '5-30 business days',
    rating: 4.2,
    verified: true,
    featured: true,
    contact: { phone: '+971-4-306-0333', email: 'info@vfsglobal.com' },
    appLinks: { ios: 'https://apps.apple.com/app/vfs-global/id1495873498', android: 'https://play.google.com/store/apps/details?id=com.vfsglobal.vfsapp' },
  },
  {
    id: 'tls-contact',
    name: 'TLScontact',
    logo: '🔵',
    description: 'Specialist in visa application management for governments, handling applications across Europe, North Africa, and Asia. Part of the Teleperformance Group.',
    website: 'https://www.tlscontact.com',
    type: 'global',
    services: ['Visa Application Management', 'Biometric Collection', 'Document Verification', 'Premium Lounge Services', 'Mobile Biometric Units'],
    countriesCovered: 90,
    pricing: 'Service charge €25-€50 + visa fee',
    processingTime: '5-15 business days',
    rating: 4.0,
    verified: true,
    contact: { email: 'support@tlscontact.com' },
  },
  {
    id: 'bis',
    name: 'BLS International',
    logo: '🟢',
    description: 'Global tech-enabled services partner for governments and citizens, providing visa, passport, consular, and citizen services across 66 countries.',
    website: 'https://www.blsinternational.com',
    type: 'global',
    services: ['Visa Processing', 'Passport Services', 'Attestation', 'eVisa Services', 'Travel Insurance', 'Document Legalization'],
    countriesCovered: 66,
    pricing: 'Service fees from $15-$60',
    processingTime: '3-20 business days',
    rating: 3.9,
    verified: true,
    contact: { email: 'info@blsinternational.com' },
  },
  {
    id: 'ivisa',
    name: 'iVisa',
    logo: '✈️',
    description: 'Online visa and travel document processing platform. Streamlined digital applications for eVisas, ETAs, and health declarations for 200+ destinations.',
    website: 'https://www.ivisa.com',
    type: 'specialist',
    services: ['eVisa Applications', 'ETA Processing', 'Health Declarations', 'Travel Insurance', 'Passport Photos', 'Embassy Registration'],
    countriesCovered: 200,
    pricing: '$20-$150 (service + government fee)',
    processingTime: '30 minutes - 5 business days',
    rating: 4.5,
    verified: true,
    appLinks: { ios: 'https://apps.apple.com/app/ivisa/id1261498498', android: 'https://play.google.com/store/apps/details?id=com.ivisa.app' },
  },
  {
    id: 'visahq',
    name: 'VisaHQ',
    logo: '📋',
    description: 'Full-service visa agency with offices in major cities. Expert assistance for complex visa applications, legalizations, and apostilles.',
    website: 'https://www.visahq.com',
    type: 'specialist',
    services: ['Visa Applications', 'Legalization', 'Apostille', 'Translation Services', 'Passport Renewal Assistance', 'Rush Processing'],
    countriesCovered: 195,
    pricing: '$49-$349 (service fee) + government fee',
    processingTime: '1-10 business days',
    rating: 4.3,
    verified: true,
    contact: { phone: '+1-202-661-8111', email: 'info@visahq.com' },
  },
  {
    id: 'travisa',
    name: 'Travisa / CIBT',
    logo: '🏢',
    description: 'Leading global provider of immigration and visa management services for businesses, governments, and individuals. Specialized in corporate immigration.',
    website: 'https://cibtvisas.com',
    type: 'specialist',
    services: ['Corporate Immigration', 'Visa Procurement', 'Compliance Programs', 'Relocation Support', 'Work Permit Processing', 'Global Mobility'],
    countriesCovered: 190,
    pricing: 'Custom pricing - from $79/application',
    processingTime: '2-15 business days',
    rating: 4.4,
    verified: true,
    contact: { phone: '+1-800-929-2428', email: 'info@cibtvisas.com' },
  },
  {
    id: 'fragomen',
    name: 'Fragomen',
    logo: '⚖️',
    description: 'World\'s largest immigration services firm, providing strategic immigration advice to major corporations. Specialized in work permits and corporate relocation.',
    website: 'https://www.fragomen.com',
    type: 'specialist',
    services: ['Work Permits', 'Corporate Immigration', 'Compliance Audits', 'Government Relations', 'Global Immigration Strategy', 'Digital Nomad Visas'],
    countriesCovered: 170,
    pricing: 'Enterprise pricing - consultation from $300/hr',
    processingTime: 'Varies by case',
    rating: 4.7,
    verified: true,
    contact: { email: 'info@fragomen.com' },
  },
  {
    id: 'henley',
    name: 'Henley & Partners',
    logo: '👑',
    description: 'Global leaders in residence and citizenship planning. Publishers of the Henley Passport Index. Expertise in investment migration and second citizenship.',
    website: 'https://www.henleyglobal.com',
    type: 'specialist',
    services: ['Citizenship by Investment', 'Residence by Investment', 'Passport Index', 'Tax Planning', 'Family Office Services', 'Global Mobility Consulting'],
    countriesCovered: 40,
    pricing: 'From $100K+ (investment migration programs)',
    processingTime: '3-18 months',
    rating: 4.8,
    verified: true,
    contact: { email: 'info@henleyglobal.com' },
  },
];

const COUNTRY_IMMIGRATION: CountryImmigrationInfo[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America', governmentPortal: 'https://www.usa.gov', immigrationWebsite: 'https://www.uscis.gov', passportWebsite: 'https://travel.state.gov/content/travel/en/passports.html', visaApplicationUrl: 'https://ceac.state.gov/genniv/', eVisaAvailable: true, visaOnArrival: ['ESTA/VWP for 41 countries'], passportRenewalCost: '$130-$160', visaApplicationCost: '$160 (B1/B2), $190 (H/L/O)', processingTime: '2-8 weeks (visa), 6-8 weeks (passport)', emergencyContact: '+1-202-647-4000', notes: 'ESTA required for VWP countries. Global Entry available.' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', governmentPortal: 'https://www.gov.uk', immigrationWebsite: 'https://www.gov.uk/browse/visas-immigration', passportWebsite: 'https://www.gov.uk/apply-renew-passport', visaApplicationUrl: 'https://www.gov.uk/apply-to-come-to-the-uk', eVisaAvailable: true, visaOnArrival: ['ETA for eligible nationalities'], passportRenewalCost: '£82.50 (online)', visaApplicationCost: '£100-£1,523 depending on type', processingTime: '3-8 weeks', emergencyContact: '+44-20-7008-1500', notes: 'UK ETA launching for more nationalities. Points-based immigration system.' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America', governmentPortal: 'https://www.canada.ca', immigrationWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship.html', passportWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html', visaApplicationUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html', eVisaAvailable: true, visaOnArrival: ['eTA for visa-exempt countries'], passportRenewalCost: 'CAD $120-$160', visaApplicationCost: 'CAD $100 (visitor), CAD $155 (work permit)', processingTime: '2-12 weeks', emergencyContact: '+1-613-996-8885', notes: 'Express Entry for skilled workers. eTA required for air travel.' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania', governmentPortal: 'https://www.australia.gov.au', immigrationWebsite: 'https://immi.homeaffairs.gov.au', passportWebsite: 'https://www.passports.gov.au', visaApplicationUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder', eVisaAvailable: true, visaOnArrival: ['ETA for eligible passports'], passportRenewalCost: 'AUD $325 (10-year)', visaApplicationCost: 'AUD $150 (ETA) - $4,115 (employer-sponsored)', processingTime: '1 day (ETA) - 12 months', emergencyContact: '+61-2-6261-3305', notes: 'Digital nomad visa not yet available. WHV for 18-30/35 year olds.' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', governmentPortal: 'https://www.bundesregierung.de', immigrationWebsite: 'https://www.make-it-in-germany.com', passportWebsite: 'https://www.bva.bund.de', visaApplicationUrl: 'https://videx.diplo.de', eVisaAvailable: false, visaOnArrival: ['Schengen visa-free for 90 days'], passportRenewalCost: '€37.50-€81', visaApplicationCost: '€75-€100 (Schengen), €75 (national)', processingTime: '2-12 weeks', emergencyContact: '+49-30-5000-0', notes: 'EU Blue Card available for skilled workers. Freelancer visa option.' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', governmentPortal: 'https://www.service-public.fr', immigrationWebsite: 'https://france-visas.gouv.fr', passportWebsite: 'https://www.service-public.fr/particuliers/vosdroits/N360', visaApplicationUrl: 'https://france-visas.gouv.fr/en/web/france-visas/', eVisaAvailable: true, visaOnArrival: ['Schengen visa-free'], passportRenewalCost: '€86 (adult)', visaApplicationCost: '€80 (Schengen short-stay)', processingTime: '15-60 days', emergencyContact: '+33-1-43-17-53-53', notes: 'Talent Passport for skilled professionals. French Tech Visa available.' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', governmentPortal: 'https://www.japan.go.jp', immigrationWebsite: 'https://www.moj.go.jp/isa/index.html', passportWebsite: 'https://www.mofa.go.jp/toko/passport/', visaApplicationUrl: 'https://www.mofa.go.jp/j_info/visit/visa/', eVisaAvailable: true, visaOnArrival: ['Visa-free for 68 countries'], passportRenewalCost: '¥10,000-¥16,000', visaApplicationCost: '¥3,000-¥6,000', processingTime: '5-10 business days', emergencyContact: '+81-3-3580-3311', notes: 'Visit Japan Web for entry. Digital nomad visa launched 2024.' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia', governmentPortal: 'https://www.gov.sg', immigrationWebsite: 'https://www.ica.gov.sg', passportWebsite: 'https://www.ica.gov.sg/passports', visaApplicationUrl: 'https://eservices.ica.gov.sg/esvclandingpage/save', eVisaAvailable: true, visaOnArrival: ['Visa-free for most nationalities'], passportRenewalCost: 'SGD $70', visaApplicationCost: 'SGD $30 (single entry)', processingTime: '3-5 business days', emergencyContact: '+65-6325-6100', notes: 'SG Arrival Card required. ONE Pass for top talent.' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', governmentPortal: 'https://u.ae', immigrationWebsite: 'https://icp.gov.ae', passportWebsite: 'https://icp.gov.ae/en/services/passport-services/', visaApplicationUrl: 'https://smartservices.icp.gov.ae', eVisaAvailable: true, visaOnArrival: ['Visa on arrival for 70+ countries'], passportRenewalCost: 'AED 200-600', visaApplicationCost: 'AED 100-1,100', processingTime: '3-5 business days', emergencyContact: '+971-800-5111', notes: 'Golden Visa (10-year). Green Visa for skilled workers. Digital nomad visa available.' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', governmentPortal: 'https://www.thaigov.go.th', immigrationWebsite: 'https://www.immigration.go.th', passportWebsite: 'https://www.passport.in.th', visaApplicationUrl: 'https://www.thaievisa.go.th', eVisaAvailable: true, visaOnArrival: ['Visa exemption 30-90 days for 57 countries'], passportRenewalCost: 'THB 1,000', visaApplicationCost: 'THB 1,000-10,000', processingTime: '3-10 business days', emergencyContact: '+66-2-572-8442', notes: 'Long Term Resident (LTR) visa for remote workers. Thailand Elite visa.' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', governmentPortal: 'https://www.portugal.gov.pt', immigrationWebsite: 'https://www.sef.pt', passportWebsite: 'https://www.irn.mj.pt/IRN/sections/irn/a_702/passaporte', visaApplicationUrl: 'https://pedidodevistos.mne.gov.pt', eVisaAvailable: false, visaOnArrival: ['Schengen visa-free'], passportRenewalCost: '€65', visaApplicationCost: '€80 (Schengen), €90 (national)', processingTime: '15-60 days', emergencyContact: '+351-21-329-4600', notes: 'D7 Passive Income Visa. Digital Nomad Visa (D8). NHR tax regime.' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', governmentPortal: 'https://www.lamoncloa.gob.es', immigrationWebsite: 'https://www.inclusion.gob.es/web/migraciones', passportWebsite: 'https://www.policia.es/documentacion/pasaporte.html', visaApplicationUrl: 'https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Visados.aspx', eVisaAvailable: false, visaOnArrival: ['Schengen visa-free'], passportRenewalCost: '€30', visaApplicationCost: '€80 (Schengen), €60-€80 (national)', processingTime: '15-60 days', emergencyContact: '+34-91-379-9700', notes: 'Digital Nomad Visa available. Beckham Law tax benefit for new residents.' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', governmentPortal: 'https://www.govt.nz', immigrationWebsite: 'https://www.immigration.govt.nz', passportWebsite: 'https://www.passports.govt.nz', visaApplicationUrl: 'https://www.immigration.govt.nz/new-zealand-visas', eVisaAvailable: true, visaOnArrival: ['NZeTA for visa-waiver countries'], passportRenewalCost: 'NZD $191 (10-year)', visaApplicationCost: 'NZD $35 (NZeTA) - $495+ (work visa)', processingTime: '72 hours (NZeTA) - 6 months', emergencyContact: '+64-4-439-8000', notes: 'NZeTA and IVL required for visa waiver travellers.' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Central America', governmentPortal: 'https://www.gob.mx', immigrationWebsite: 'https://www.gob.mx/inm', passportWebsite: 'https://www.gob.mx/sre/acciones-y-programas/pasaportes-702', visaApplicationUrl: 'https://www.gob.mx/sre/acciones-y-programas/visa-de-visitante', eVisaAvailable: true, visaOnArrival: ['Visa-free for 65+ countries (180 days)'], passportRenewalCost: 'MXN $1,345-$2,780', visaApplicationCost: '$44 USD (visitor)', processingTime: '5-15 business days', emergencyContact: '+52-55-3686-5100', notes: 'Temporary Resident visa for stays over 180 days. No specific digital nomad visa.' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America', governmentPortal: 'https://www.gov.br', immigrationWebsite: 'https://www.gov.br/pf/pt-br/assuntos/imigracao', passportWebsite: 'https://www.gov.br/pf/pt-br/assuntos/passaporte', visaApplicationUrl: 'https://formulario-mre.serpro.gov.br', eVisaAvailable: true, visaOnArrival: ['Visa-free for most SA/EU countries'], passportRenewalCost: 'BRL $257', visaApplicationCost: '$40-$160 USD', processingTime: '5-15 business days', emergencyContact: '+55-61-2030-9117', notes: 'Digital Nomad Visa available (1 year). e-Visa for US, Canada, Australia.' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', governmentPortal: 'https://www.india.gov.in', immigrationWebsite: 'https://boi.gov.in', passportWebsite: 'https://www.passportindia.gov.in', visaApplicationUrl: 'https://indianvisaonline.gov.in', eVisaAvailable: true, visaOnArrival: ['e-Visa for 160+ countries'], passportRenewalCost: '₹1,500-₹2,000', visaApplicationCost: '$25-$100 (e-Visa)', processingTime: '3-5 business days (e-Visa)', emergencyContact: '+91-11-2301-2300', notes: 'e-Visa categories: eTourist, eBusiness, eMedical. OCI card for diaspora.' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', governmentPortal: 'https://www.korea.go.kr', immigrationWebsite: 'https://www.immigration.go.kr', passportWebsite: 'https://www.passport.go.kr', visaApplicationUrl: 'https://www.visa.go.kr', eVisaAvailable: true, visaOnArrival: ['K-ETA for visa-free countries'], passportRenewalCost: '₩53,000 (10-year)', visaApplicationCost: '$40-$90', processingTime: '5-10 business days', emergencyContact: '+82-2-2100-2114', notes: 'K-ETA required for visa-exempt nationals. Digital Nomad Visa (Workcation) launched 2024.' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', governmentPortal: 'https://www.governo.it', immigrationWebsite: 'https://vistoperitalia.esteri.it', passportWebsite: 'https://www.poliziadistato.it/articolo/10619', visaApplicationUrl: 'https://vistoperitalia.esteri.it/home/en', eVisaAvailable: false, visaOnArrival: ['Schengen visa-free'], passportRenewalCost: '€116', visaApplicationCost: '€80 (Schengen)', processingTime: '15-60 days', emergencyContact: '+39-06-3691-1', notes: 'Digital Nomad Visa introduced 2024. Elective Residence Visa for passive income.' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', governmentPortal: 'https://www.government.nl', immigrationWebsite: 'https://ind.nl/en', passportWebsite: 'https://www.netherlandsworldwide.nl/passport', visaApplicationUrl: 'https://ind.nl/en/short-stay/applying-for-a-short-stay-visa', eVisaAvailable: false, visaOnArrival: ['Schengen visa-free'], passportRenewalCost: '€75.80', visaApplicationCost: '€80 (Schengen), €210 (MVV)', processingTime: '15-90 days', emergencyContact: '+31-70-348-6486', notes: '30% ruling for expats. Highly Skilled Migrant scheme. Startup visa.' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', governmentPortal: 'https://www.admin.ch', immigrationWebsite: 'https://www.sem.admin.ch', passportWebsite: 'https://www.sem.admin.ch/sem/en/home/themen/schweizer-reisedokumente.html', visaApplicationUrl: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html', eVisaAvailable: false, visaOnArrival: ['Schengen visa-free'], passportRenewalCost: 'CHF 140', visaApplicationCost: 'CHF 80 (Schengen)', processingTime: '10-15 business days', emergencyContact: '+41-58-465-1111', notes: 'Not EU but part of Schengen. Permit B/C/G/L system. Lump-sum taxation option.' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America', governmentPortal: 'https://www.gov.co', immigrationWebsite: 'https://www.migracioncolombia.gov.co', passportWebsite: 'https://www.cancilleria.gov.co/tramites_servicios/pasaportes', visaApplicationUrl: 'https://www.cancilleria.gov.co/tramites_servicios/visa', eVisaAvailable: true, visaOnArrival: ['Visa-free for 100+ countries (90 days)'], passportRenewalCost: 'COP $162,000-$270,000', visaApplicationCost: '$52 USD', processingTime: '5-10 business days', emergencyContact: '+57-1-381-5000', notes: 'Digital Nomad Visa available (2 years). Popular with remote workers in Medellín/Bogotá.' },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
    ))}
    <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
  </div>
);

const ServiceProviderCard: React.FC<{ provider: VisaServiceProvider }> = ({ provider }) => (
  <Card className={`transition-all hover:shadow-lg ${provider.featured ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{provider.logo}</span>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {provider.name}
              {provider.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
              {provider.featured && <Badge className="text-[10px]">TOP CHOICE</Badge>}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">{provider.type.toUpperCase()}</Badge>
              <RatingStars rating={provider.rating} />
            </div>
          </div>
        </div>
      </div>
      <CardDescription className="text-xs mt-2">{provider.description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span>{provider.countriesCovered} countries</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>{provider.processingTime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
          <DollarSign className="h-3.5 w-3.5 text-primary" />
          <span>{provider.pricing}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {provider.services.slice(0, 4).map(s => (
          <Badge key={s} variant="secondary" className="text-[10px] font-normal">{s}</Badge>
        ))}
        {provider.services.length > 4 && (
          <Badge variant="outline" className="text-[10px]">+{provider.services.length - 4} more</Badge>
        )}
      </div>

      <Separator />

      <div className="flex items-center gap-2 flex-wrap">
        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => window.open(provider.website, '_blank')}>
          <ExternalLink className="h-3 w-3" /> Visit Website
        </Button>
        {provider.appLinks?.ios && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.open(provider.appLinks?.ios, '_blank')}>
            <Smartphone className="h-3 w-3" /> iOS
          </Button>
        )}
        {provider.appLinks?.android && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.open(provider.appLinks?.android, '_blank')}>
            <Smartphone className="h-3 w-3" /> Android
          </Button>
        )}
        {provider.contact?.email && (
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => window.open(`mailto:${provider.contact?.email}`, '_blank')}>
            <Mail className="h-3 w-3" /> Contact
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const CountryImmigrationCard: React.FC<{ country: CountryImmigrationInfo }> = ({ country }) => (
  <Card className="transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-xl">{country.flag}</span>
          {country.name}
        </CardTitle>
        <div className="flex gap-1">
          {country.eVisaAvailable && <Badge variant="secondary" className="text-[10px]">eVisa</Badge>}
          <Badge variant="outline" className="text-[10px]">{country.region}</Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div><span className="font-medium text-foreground">Passport Renewal:</span> {country.passportRenewalCost}</div>
        <div><span className="font-medium text-foreground">Visa Cost:</span> {country.visaApplicationCost}</div>
        <div><span className="font-medium text-foreground">Processing:</span> {country.processingTime}</div>
        <div><span className="font-medium text-foreground">Emergency:</span> {country.emergencyContact}</div>
      </div>

      {country.notes && (
        <div className="flex items-start gap-1.5 text-xs bg-accent/50 rounded-md p-2">
          <Info className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
          <span>{country.notes}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.open(country.immigrationWebsite, '_blank')}>
          <Building className="h-3 w-3" /> Immigration
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.open(country.passportWebsite, '_blank')}>
          <FileText className="h-3 w-3" /> Passports
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.open(country.visaApplicationUrl, '_blank')}>
          <Plane className="h-3 w-3" /> Apply Visa
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.open(country.governmentPortal, '_blank')}>
          <Landmark className="h-3 w-3" /> Gov Portal
        </Button>
      </div>
    </CardContent>
  </Card>
);

// ─── Quick Links ─────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'VFS Global Appointment', url: 'https://www.vfsglobal.com', icon: Globe, color: 'text-blue-500' },
  { label: 'Henley Passport Index', url: 'https://www.henleyglobal.com/passport-index', icon: Award, color: 'text-yellow-500' },
  { label: 'IATA Travel Centre', url: 'https://www.iatatravelcentre.com', icon: Plane, color: 'text-primary' },
  { label: 'Schengen Calculator', url: 'https://www.schengenvisainfo.com/visa-calculator/', icon: MapPin, color: 'text-green-500' },
  { label: 'US ESTA Application', url: 'https://esta.cbp.dhs.gov', icon: Shield, color: 'text-red-500' },
  { label: 'UK ETA', url: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta', icon: Shield, color: 'text-indigo-500' },
  { label: 'Canada eTA', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html', icon: Shield, color: 'text-red-400' },
  { label: 'Australia ETA', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601', icon: Shield, color: 'text-amber-500' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

const VisaImmigrationHub: React.FC = () => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const regions = useMemo(() => {
    const r = new Set(COUNTRY_IMMIGRATION.map(c => c.region));
    return ['all', ...Array.from(r).sort()];
  }, []);

  const filteredCountries = useMemo(() => {
    return COUNTRY_IMMIGRATION.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === 'all' || c.region === regionFilter;
      return matchSearch && matchRegion;
    });
  }, [search, regionFilter]);

  const filteredProviders = useMemo(() => {
    if (!search) return SERVICE_PROVIDERS;
    return SERVICE_PROVIDERS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          Visa & Immigration Hub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive visa services, government portals, passport offices & immigration links for 20+ countries
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search countries, services, visa types..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Links Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Quick Links — Most Used Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_LINKS.map(link => (
              <Button
                key={link.label}
                variant="outline"
                size="sm"
                className="h-auto py-2 px-3 text-xs justify-start gap-2"
                onClick={() => window.open(link.url, '_blank')}
              >
                <link.icon className={`h-3.5 w-3.5 ${link.color} shrink-0`} />
                <span className="text-left truncate">{link.label}</span>
                <ExternalLink className="h-3 w-3 ml-auto shrink-0 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="services" className="text-xs">
            <Building className="h-3.5 w-3.5 mr-1.5" /> Service Providers
          </TabsTrigger>
          <TabsTrigger value="countries" className="text-xs">
            <Globe className="h-3.5 w-3.5 mr-1.5" /> Country Directory
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Resources
          </TabsTrigger>
        </TabsList>

        {/* SERVICE PROVIDERS */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProviders.map(p => (
              <ServiceProviderCard key={p.id} provider={p} />
            ))}
          </div>
          {filteredProviders.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No services match your search.</p>
            </div>
          )}
        </TabsContent>

        {/* COUNTRY DIRECTORY */}
        <TabsContent value="countries" className="space-y-4">
          {/* Region Filter */}
          <div className="flex flex-wrap gap-2">
            {regions.map(r => (
              <Button
                key={r}
                size="sm"
                variant={regionFilter === r ? 'default' : 'outline'}
                className="h-7 text-xs capitalize"
                onClick={() => setRegionFilter(r)}
              >
                {r}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCountries.map(c => (
              <CountryImmigrationCard key={c.code} country={c} />
            ))}
          </div>
          {filteredCountries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No countries match your search.</p>
            </div>
          )}
        </TabsContent>

        {/* RESOURCES */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🛂 Visa Types Explained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                {[
                  ['Tourist Visa', 'Short-term leisure travel (15-90 days)'],
                  ['Business Visa', 'Conferences, meetings, negotiations'],
                  ['Work Visa / Permit', 'Employment authorization required'],
                  ['Student Visa', 'Full-time enrollment at institution'],
                  ['Digital Nomad Visa', 'Remote work from another country (6-24 months)'],
                  ['Investor / Golden Visa', 'Residency through qualifying investment'],
                  ['Transit Visa', 'Passing through a country (24-72 hours)'],
                  ['eVisa / ETA', 'Electronic authorization — apply online'],
                ].map(([type, desc]) => (
                  <div key={type} className="flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                    <div><span className="font-medium text-foreground">{type}:</span> {desc}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">📋 Application Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                {[
                  'Valid passport (6+ months remaining)',
                  'Completed visa application form',
                  'Passport-sized photos (specifications vary)',
                  'Proof of accommodation',
                  'Flight itinerary / travel plan',
                  'Bank statements (3-6 months)',
                  'Travel insurance (required by some countries)',
                  'Invitation letter (if applicable)',
                  'Employment / enrollment verification',
                  'Biometric enrollment appointment',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">⚠️ Common Mistakes to Avoid</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                {[
                  'Applying too late — start 2-3 months early',
                  'Passport expiry less than 6 months',
                  'Insufficient funds in bank statement',
                  'Wrong photo specifications',
                  'Missing supporting documents',
                  'Not booking biometrics appointment',
                  'Overstaying previous visas (flags in system)',
                  'Using unofficial / scam visa websites',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-destructive shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🌍 Official International Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'IATA Travel Centre', url: 'https://www.iatatravelcentre.com', desc: 'Airline passport/visa requirements' },
                  { name: 'Henley Passport Index', url: 'https://www.henleyglobal.com/passport-index', desc: 'Global passport power rankings' },
                  { name: 'Schengen Visa Info', url: 'https://www.schengenvisainfo.com', desc: 'EU Schengen zone requirements' },
                  { name: 'Sherpa° by Kayak', url: 'https://apply.joinsherpa.com', desc: 'Travel restriction tracker' },
                  { name: 'VisaGuide.World', url: 'https://visaguide.world', desc: 'Visa requirements by nationality' },
                  { name: 'Nomad List', url: 'https://nomadlist.com/visas', desc: 'Digital nomad visa database' },
                ].map(r => (
                  <Button
                    key={r.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto py-2 text-xs gap-2"
                    onClick={() => window.open(r.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 text-primary shrink-0" />
                    <div className="text-left">
                      <div className="font-medium text-foreground">{r.name}</div>
                      <div className="text-muted-foreground">{r.desc}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisaImmigrationHub;
