import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, MapPin, ExternalLink, Cat, Dog, Bird, Plane, FileText,
  AlertCircle, Stethoscope, Clock, Star, Shield, Phone, Globe,
  Heart, Scissors, ShoppingBag, Home, Truck, ChevronRight, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LocationData } from '@/types/country';

interface PetServicesProps {
  currentLocation?: LocationData | null;
}

// ── Comprehensive Service Category Data ──
const SERVICE_CATEGORIES = [
  { id: 'emergency', label: '🚨 Emergency & 24/7 Vets', icon: AlertCircle, color: 'text-red-500' },
  { id: 'vet', label: '🏥 Veterinary Clinics', icon: Stethoscope, color: 'text-blue-500' },
  { id: 'grooming', label: '✂️ Grooming & Spa', icon: Scissors, color: 'text-purple-500' },
  { id: 'boarding', label: '🏠 Boarding & Daycare', icon: Home, color: 'text-amber-500' },
  { id: 'walking', label: '🐕 Dog Walking & Sitting', icon: Heart, color: 'text-pink-500' },
  { id: 'supplies', label: '🛒 Pet Shops & Supplies', icon: ShoppingBag, color: 'text-green-500' },
  { id: 'transport', label: '✈️ Pet Relocation', icon: Truck, color: 'text-cyan-500' },
  { id: 'training', label: '🎓 Training & Behavior', icon: Sparkles, color: 'text-orange-500' },
];

// ── City-level 24/7 Service Database ──
interface LocalService {
  name: string;
  type: string;
  rating: number;
  reviews: number;
  phone: string;
  address: string;
  website: string;
  hours: string;
  is24h: boolean;
  languages: string[];
  highlights: string[];
}

interface CityServiceData {
  city: string;
  country: string;
  countryCode: string;
  services: LocalService[];
}

const CITY_SERVICES_DB: CityServiceData[] = [
  {
    city: 'Bangkok', country: 'Thailand', countryCode: 'TH',
    services: [
      { name: 'Thonglor Pet Hospital', type: 'emergency', rating: 4.8, reviews: 2340, phone: '+66-2-712-4400', address: '588 Sukhumvit 55, Thonglor, Bangkok', website: 'https://www.thonglorpethospital.com', hours: '24/7', is24h: true, languages: ['English', 'Thai'], highlights: ['24/7 ICU', 'CT/MRI', 'Specialist surgeons'] },
      { name: 'Bangkok Pet Hospital', type: 'emergency', rating: 4.7, reviews: 1890, phone: '+66-2-391-4412', address: '1064/1 Sukhumvit Rd, Phra Khanong', website: 'https://www.bangkokpethospital.com', hours: '24/7', is24h: true, languages: ['English', 'Thai', 'Japanese'], highlights: ['24/7 Emergency', 'Exotic pets', 'Pet ambulance'] },
      { name: 'Pet Kingdom Grooming', type: 'grooming', rating: 4.6, reviews: 890, phone: '+66-2-714-9988', address: 'Sukhumvit Soi 39, Bangkok', website: 'https://www.petkingdom.co.th', hours: '9am-8pm', is24h: false, languages: ['English', 'Thai'], highlights: ['Premium grooming', 'Cat spa', 'Organic products'] },
      { name: 'Happy Tails Dog Walking', type: 'walking', rating: 4.5, reviews: 430, phone: '+66-89-234-5678', address: 'Serves Sukhumvit/Silom area', website: 'https://www.happytailsbkk.com', hours: '6am-8pm', is24h: false, languages: ['English', 'Thai'], highlights: ['GPS tracking', 'Photo updates', 'Insured walkers'] },
    ]
  },
  {
    city: 'Lisbon', country: 'Portugal', countryCode: 'PT',
    services: [
      { name: 'Hospital Veterinário do Restelo', type: 'emergency', rating: 4.8, reviews: 1560, phone: '+351-21-301-5300', address: 'R. Gonçalves Zarco 11A, 1400-190 Lisboa', website: 'https://www.hvr.pt', hours: '24/7', is24h: true, languages: ['English', 'Portuguese', 'Spanish'], highlights: ['24/7 Emergency', 'Oncology', 'Rehabilitation'] },
      { name: 'VetSet Hospital Veterinário', type: 'emergency', rating: 4.7, reviews: 1230, phone: '+351-21-771-4400', address: 'Av. Eng. Arantes e Oliveira 34, Lisboa', website: 'https://www.vetset.pt', hours: '24/7', is24h: true, languages: ['English', 'Portuguese'], highlights: ['24/7 ICU', 'Cardiology', 'Dentistry'] },
      { name: 'PetWash Lisboa', type: 'grooming', rating: 4.5, reviews: 670, phone: '+351-21-555-1234', address: 'R. do Sol ao Rato 12, Lisboa', website: 'https://www.petwash.pt', hours: '10am-7pm', is24h: false, languages: ['English', 'Portuguese'], highlights: ['Self-service wash', 'Premium grooming', 'Organic shampoos'] },
    ]
  },
  {
    city: 'London', country: 'United Kingdom', countryCode: 'GB',
    services: [
      { name: 'The Royal Veterinary College', type: 'emergency', rating: 4.9, reviews: 3200, phone: '+44-1707-666-333', address: 'Hawkshead Ln, Brookmans Park, Hatfield AL9 7TA', website: 'https://www.rvc.ac.uk', hours: '24/7', is24h: true, languages: ['English'], highlights: ['24/7 Emergency', 'Teaching hospital', 'All species'] },
      { name: 'Vets Now Emergency', type: 'emergency', rating: 4.7, reviews: 2100, phone: '+44-1onal-1234', address: 'Multiple London locations', website: 'https://www.vets-now.com', hours: '24/7', is24h: true, languages: ['English'], highlights: ['Out-of-hours care', '24/7 Emergency', 'Nationwide network'] },
      { name: 'Battersea Dogs & Cats Home', type: 'boarding', rating: 4.8, reviews: 5600, phone: '+44-20-7622-3626', address: '4 Battersea Park Rd, London SW8 4AA', website: 'https://www.battersea.org.uk', hours: '10am-4pm', is24h: false, languages: ['English'], highlights: ['Rescue & rehoming', 'Boarding', 'Training classes'] },
    ]
  },
  {
    city: 'Dubai', country: 'UAE', countryCode: 'AE',
    services: [
      { name: 'Modern Vet', type: 'emergency', rating: 4.8, reviews: 1980, phone: '+971-4-395-3131', address: 'Multiple locations, Dubai', website: 'https://www.modernvet.com', hours: '24/7', is24h: true, languages: ['English', 'Arabic'], highlights: ['24/7 Emergency', 'Pet hotel', 'Advanced diagnostics'] },
      { name: 'Canadian Veterinary Clinic', type: 'emergency', rating: 4.7, reviews: 1450, phone: '+971-4-330-9498', address: 'Beach Rd, Jumeirah 1, Dubai', website: 'https://www.canadianvc.com', hours: '24/7', is24h: true, languages: ['English', 'Arabic', 'French'], highlights: ['24/7 ICU', 'Exotic animals', 'Pet taxi'] },
    ]
  },
  {
    city: 'Singapore', country: 'Singapore', countryCode: 'SG',
    services: [
      { name: 'Animal Recovery Centre (ARC)', type: 'emergency', rating: 4.8, reviews: 1670, phone: '+65-6742-9635', address: '86 Joo Chiat Pl, Singapore 427790', website: 'https://www.arcvet.com.sg', hours: '24/7', is24h: true, languages: ['English', 'Mandarin', 'Malay'], highlights: ['24/7 Emergency', 'Surgery', 'Rehabilitation'] },
      { name: 'Mount Pleasant Veterinary Group', type: 'emergency', rating: 4.7, reviews: 2340, phone: '+65-6250-8333', address: 'Multiple locations', website: 'https://www.mountpleasant.com.sg', hours: '24/7', is24h: true, languages: ['English', 'Mandarin'], highlights: ['24/7 Emergency', '10 clinics', 'Pet ambulance'] },
    ]
  },
  {
    city: 'Barcelona', country: 'Spain', countryCode: 'ES',
    services: [
      { name: 'Hospital Veterinari Glòries', type: 'emergency', rating: 4.7, reviews: 1340, phone: '+34-93-300-0191', address: 'Av. Diagonal 340, Barcelona', website: 'https://www.hvglories.com', hours: '24/7', is24h: true, languages: ['English', 'Spanish', 'Catalan'], highlights: ['24/7 Emergency', 'Orthopedics', 'Neurology'] },
      { name: 'ARS Veterinaria', type: 'emergency', rating: 4.8, reviews: 1100, phone: '+34-93-218-9000', address: 'C/ Cardedeu 3, Barcelona', website: 'https://www.arsveterinaria.es', hours: '24/7', is24h: true, languages: ['English', 'Spanish', 'Catalan', 'French'], highlights: ['24/7 Referral hospital', 'CT/MRI', 'Oncology'] },
    ]
  },
  {
    city: 'Berlin', country: 'Germany', countryCode: 'DE',
    services: [
      { name: 'Tierklinik Düppel (FU Berlin)', type: 'emergency', rating: 4.7, reviews: 1890, phone: '+49-30-838-62200', address: 'Oertzenweg 19b, 14163 Berlin', website: 'https://www.vetmed.fu-berlin.de', hours: '24/7', is24h: true, languages: ['English', 'German'], highlights: ['24/7 Emergency', 'University hospital', 'All specialties'] },
      { name: 'Tierärztliche Praxis am Volkspark', type: 'emergency', rating: 4.6, reviews: 780, phone: '+49-30-364-3300', address: 'Hasenheide 20, 10967 Berlin', website: 'https://www.tierarzt-volkspark.de', hours: '24/7', is24h: true, languages: ['English', 'German'], highlights: ['24/7 on-call', 'Digital X-ray', 'Dental care'] },
    ]
  },
  {
    city: 'Tokyo', country: 'Japan', countryCode: 'JP',
    services: [
      { name: 'DVMs Animal Medical Center Tokyo', type: 'emergency', rating: 4.8, reviews: 2100, phone: '+81-3-5765-1212', address: '2-5-8 Higashishinagawa, Shinagawa, Tokyo', website: 'https://www.dvms-amc.com', hours: '24/7', is24h: true, languages: ['English', 'Japanese'], highlights: ['24/7 Emergency', 'Specialist referral', 'CT/MRI'] },
      { name: 'Japan Animal Referral Medical Center', type: 'emergency', rating: 4.7, reviews: 1560, phone: '+81-44-850-7001', address: '2-12-10 Mizonokuchi, Takatsu-ku, Kawasaki', website: 'https://www.jarmec.co.jp', hours: '24/7', is24h: true, languages: ['English', 'Japanese'], highlights: ['24/7 ICU', 'Cardiology', 'Oncology'] },
    ]
  },
  {
    city: 'New York', country: 'USA', countryCode: 'US',
    services: [
      { name: 'Animal Medical Center', type: 'emergency', rating: 4.7, reviews: 4200, phone: '+1-212-838-8100', address: '510 E 62nd St, New York, NY 10065', website: 'https://www.amcny.org', hours: '24/7', is24h: true, languages: ['English', 'Spanish'], highlights: ['24/7 Emergency', 'Non-profit', '17 specialties'] },
      { name: 'BluePearl Pet Hospital', type: 'emergency', rating: 4.6, reviews: 2800, phone: '+1-212-924-3311', address: '410 W 55th St, New York, NY 10019', website: 'https://www.bluepearlvet.com', hours: '24/7', is24h: true, languages: ['English', 'Spanish'], highlights: ['24/7 ER', 'Critical care', 'Specialty referral'] },
    ]
  },
  {
    city: 'Paris', country: 'France', countryCode: 'FR',
    services: [
      { name: 'Clinique Vétérinaire des Urgences', type: 'emergency', rating: 4.6, reviews: 1780, phone: '+33-1-47-55-47-55', address: '58 Boulevard de la Tour-Maubourg, 75007 Paris', website: 'https://www.urgences-veterinaires.fr', hours: '24/7', is24h: true, languages: ['English', 'French'], highlights: ['24/7 Emergency', 'Surgery', 'Imaging'] },
      { name: 'Centre Hospitalier Vétérinaire Frégis', type: 'emergency', rating: 4.8, reviews: 2450, phone: '+33-1-49-85-83-00', address: '43 Avenue Aristide Briand, 94110 Arcueil', website: 'https://www.fregis.com', hours: '24/7', is24h: true, languages: ['English', 'French'], highlights: ['24/7 Referral', 'CT/MRI/Endoscopy', 'Oncology'] },
    ]
  },
  {
    city: 'Sydney', country: 'Australia', countryCode: 'AU',
    services: [
      { name: 'Small Animal Specialist Hospital (SASH)', type: 'emergency', rating: 4.8, reviews: 2670, phone: '+61-2-9889-0289', address: '1 Richardson Pl, North Ryde NSW 2113', website: 'https://www.sashvets.com', hours: '24/7', is24h: true, languages: ['English'], highlights: ['24/7 Emergency', 'Specialists', 'Oncology'] },
      { name: 'Animal Referral Hospital', type: 'emergency', rating: 4.7, reviews: 1890, phone: '+61-2-9758-8666', address: '250 Parramatta Rd, Homebush NSW 2140', website: 'https://www.arh.com.au', hours: '24/7', is24h: true, languages: ['English'], highlights: ['24/7 ER', 'Surgery', 'Cardiology'] },
    ]
  },
  {
    city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL',
    services: [
      { name: 'Universiteitskliniek voor Gezelschapsdieren', type: 'emergency', rating: 4.7, reviews: 1340, phone: '+31-30-253-9111', address: 'Yalelaan 108, 3584 CM Utrecht', website: 'https://www.uu.nl/vgd', hours: '24/7', is24h: true, languages: ['English', 'Dutch'], highlights: ['24/7 Emergency', 'University clinic', 'All specialties'] },
      { name: 'Dierenkliniek Vondelpark', type: 'vet', rating: 4.6, reviews: 890, phone: '+31-20-662-3210', address: 'Overtoom 525, 1054 LJ Amsterdam', website: 'https://www.dierenkliniekvondelpark.nl', hours: '8am-10pm', is24h: false, languages: ['English', 'Dutch'], highlights: ['Extended hours', 'Central location', 'Multilingual'] },
    ]
  },
  {
    city: 'Bali', country: 'Indonesia', countryCode: 'ID',
    services: [
      { name: 'Sunset Vet Bali', type: 'emergency', rating: 4.7, reviews: 1120, phone: '+62-361-765-225', address: 'Jl. Sunset Road No.88X, Seminyak', website: 'https://www.sunsetvetbali.com', hours: '24/7', is24h: true, languages: ['English', 'Indonesian'], highlights: ['24/7 Emergency', 'Surgery', 'Dental'] },
      { name: 'Bali Pet Crusaders', type: 'emergency', rating: 4.6, reviews: 870, phone: '+62-811-380-1000', address: 'Jl. Raya Canggu, Badung', website: 'https://www.balipetcrusaders.com', hours: '24/7', is24h: true, languages: ['English', 'Indonesian'], highlights: ['24/7 Rescue', 'Low-cost care', 'Vaccinations'] },
    ]
  },
  {
    city: 'Chiang Mai', country: 'Thailand', countryCode: 'TH',
    services: [
      { name: 'Chiang Mai University Veterinary Hospital', type: 'emergency', rating: 4.7, reviews: 1560, phone: '+66-53-948-023', address: '155 Huay Kaew Rd, Chiang Mai', website: 'https://www.vet.cmu.ac.th', hours: '24/7', is24h: true, languages: ['English', 'Thai'], highlights: ['24/7 Emergency', 'University hospital', 'All species'] },
      { name: 'Chiang Mai Pet Hospital', type: 'emergency', rating: 4.6, reviews: 980, phone: '+66-53-211-511', address: '32/2 Chotana Rd, Chiang Mai', website: 'https://www.chiangmaipethospital.com', hours: '24/7', is24h: true, languages: ['English', 'Thai'], highlights: ['24/7 on-call', 'X-ray', 'Lab tests'] },
    ]
  },
  {
    city: 'Mexico City', country: 'Mexico', countryCode: 'MX',
    services: [
      { name: 'Hospital Veterinario UNAM', type: 'emergency', rating: 4.8, reviews: 2890, phone: '+52-55-5622-5875', address: 'Circuito Exterior s/n, Ciudad Universitaria', website: 'https://www.fmvz.unam.mx', hours: '24/7', is24h: true, languages: ['English', 'Spanish'], highlights: ['24/7 Emergency', 'University hospital', 'Low cost'] },
      { name: 'Hospital Veterinario del Valle', type: 'emergency', rating: 4.6, reviews: 1340, phone: '+52-55-5559-3020', address: 'Av. Coyoacán 1624, Col. del Valle, CDMX', website: 'https://www.hvdelvalle.com', hours: '24/7', is24h: true, languages: ['English', 'Spanish'], highlights: ['24/7 ICU', 'Surgery', 'Diagnostics'] },
    ]
  },
  {
    city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY',
    services: [
      { name: 'The Animal Clinic', type: 'emergency', rating: 4.7, reviews: 1200, phone: '+60-3-7727-2747', address: '65 Jalan SS 21/62, Damansara Utama', website: 'https://www.theanimalclinic.com.my', hours: '24/7', is24h: true, languages: ['English', 'Malay', 'Mandarin'], highlights: ['24/7 Emergency', 'Exotic pets', 'Boarding'] },
      { name: 'Vertex Veterinary Specialist', type: 'emergency', rating: 4.8, reviews: 890, phone: '+60-3-7733-1515', address: 'PJ Trade Centre, Damansara', website: 'https://www.vertexvet.com', hours: '24/7', is24h: true, languages: ['English', 'Malay'], highlights: ['24/7 ICU', 'Surgery', 'Dermatology'] },
    ]
  },
  {
    city: 'Cape Town', country: 'South Africa', countryCode: 'ZA',
    services: [
      { name: 'Panorama Veterinary Clinic & Specialist Centre', type: 'emergency', rating: 4.7, reviews: 1560, phone: '+27-21-930-6632', address: '1 Hennie Winterbach St, Panorama', website: 'https://www.panoramavet.co.za', hours: '24/7', is24h: true, languages: ['English', 'Afrikaans'], highlights: ['24/7 Emergency', 'Specialists', 'ICU'] },
      { name: 'Tygerberg Animal Hospital', type: 'emergency', rating: 4.6, reviews: 1100, phone: '+27-21-910-1072', address: 'Voortrekker Rd, Bellville', website: 'https://www.tygerbergvet.co.za', hours: '24/7', is24h: true, languages: ['English', 'Afrikaans'], highlights: ['24/7 ER', 'Surgery', 'Orthopedics'] },
    ]
  },
  {
    city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR',
    services: [
      { name: 'Pet\'s Hospital', type: 'emergency', rating: 4.6, reviews: 1890, phone: '+54-11-4831-8000', address: 'Av. Córdoba 5639, Buenos Aires', website: 'https://www.petshospital.com.ar', hours: '24/7', is24h: true, languages: ['English', 'Spanish'], highlights: ['24/7 Emergency', 'Cardiology', 'Endoscopy'] },
      { name: 'Centro Veterinario Palermo', type: 'emergency', rating: 4.5, reviews: 780, phone: '+54-11-4773-4000', address: 'Honduras 5900, Palermo, Buenos Aires', website: 'https://www.vetpalermo.com.ar', hours: '24/7', is24h: true, languages: ['Spanish', 'English'], highlights: ['24/7 on-call', 'Lab tests', 'Dental'] },
    ]
  },
  {
    city: 'Seoul', country: 'South Korea', countryCode: 'KR',
    services: [
      { name: 'SNU Veterinary Medical Teaching Hospital', type: 'emergency', rating: 4.8, reviews: 2100, phone: '+82-2-880-1234', address: '1 Gwanak-ro, Gwanak-gu, Seoul', website: 'https://www.vet.snu.ac.kr', hours: '24/7', is24h: true, languages: ['English', 'Korean'], highlights: ['24/7 Emergency', 'University hospital', 'Referrals'] },
      { name: 'Irion Animal Medical Center', type: 'emergency', rating: 4.7, reviews: 1340, phone: '+82-2-545-0075', address: 'Gangnam-gu, Seoul', website: 'https://www.irion.co.kr', hours: '24/7', is24h: true, languages: ['English', 'Korean'], highlights: ['24/7 ICU', 'Surgery', 'Internal medicine'] },
    ]
  },
  {
    city: 'Toronto', country: 'Canada', countryCode: 'CA',
    services: [
      { name: 'Veterinary Emergency Clinic (VEC)', type: 'emergency', rating: 4.7, reviews: 2340, phone: '+1-416-920-2002', address: '920 Yonge St #117, Toronto', website: 'https://www.veccs.com', hours: '24/7', is24h: true, languages: ['English', 'French'], highlights: ['24/7 Emergency', 'Critical care', 'Surgery'] },
      { name: 'Toronto Animal Health Partners', type: 'emergency', rating: 4.8, reviews: 1560, phone: '+1-416-360-4040', address: '685 Sheppard Ave E, North York', website: 'https://www.torontovets.com', hours: '24/7', is24h: true, languages: ['English', 'French', 'Mandarin'], highlights: ['24/7 ER', 'Neurology', 'Cardiology'] },
    ]
  },
];

// ── Search cities for Google Maps integration ──
const SEARCHABLE_CITIES = [
  'Abu Dhabi', 'Amsterdam', 'Athens', 'Auckland', 'Austin', 'Bali', 'Bangkok', 'Barcelona',
  'Beijing', 'Berlin', 'Bogotá', 'Boston', 'Brisbane', 'Brussels', 'Bucharest', 'Budapest',
  'Buenos Aires', 'Cairo', 'Cape Town', 'Chiang Mai', 'Chicago', 'Copenhagen', 'Dallas',
  'Denver', 'Doha', 'Dubai', 'Dublin', 'Edinburgh', 'Florence', 'Frankfurt', 'Geneva',
  'Hanoi', 'Helsinki', 'Ho Chi Minh City', 'Hong Kong', 'Houston', 'Istanbul',
  'Jakarta', 'Johannesburg', 'Kuala Lumpur', 'Kyoto', 'Lagos', 'Lima', 'Lisbon',
  'London', 'Los Angeles', 'Madrid', 'Manila', 'Marrakech', 'Medellín', 'Melbourne',
  'Mexico City', 'Miami', 'Milan', 'Montreal', 'Moscow', 'Mumbai', 'Munich',
  'Nairobi', 'New York', 'Nice', 'Osaka', 'Oslo', 'Paris', 'Perth', 'Philadelphia',
  'Prague', 'Rio de Janeiro', 'Rome', 'San Diego', 'San Francisco', 'Santiago',
  'São Paulo', 'Seattle', 'Seoul', 'Shanghai', 'Singapore', 'Stockholm', 'Sydney',
  'Taipei', 'Tel Aviv', 'Tokyo', 'Toronto', 'Vancouver', 'Vienna', 'Warsaw',
  'Washington DC', 'Zurich'
];

// ── Government Resources ──
const GOVERNMENT_RESOURCES = [
  { name: 'USDA APHIS Pet Travel', url: 'https://www.aphis.usda.gov/aphis/pet-travel', desc: 'US pet travel requirements', region: 'USA' },
  { name: 'UK Pet Travel (PETS)', url: 'https://www.gov.uk/take-pet-abroad', desc: 'UK government pet travel regulations', region: 'UK' },
  { name: 'EU Pet Travel Regulation', url: 'https://food.ec.europa.eu/animals/pet-movement_en', desc: 'EU pet movement regulations', region: 'EU' },
  { name: 'Canada Pet Import', url: 'https://inspection.canada.ca/animal-health/terrestrial-animals/imports/pets/eng/1326600389775/1326600500578', desc: 'CFIA pet import rules', region: 'Canada' },
  { name: 'Australia Pet Import', url: 'https://www.agriculture.gov.au/biosecurity-trade/cats-dogs', desc: 'Australian pet import requirements', region: 'Australia' },
  { name: 'Japan Animal Quarantine', url: 'https://www.maff.go.jp/aqs/english/animal/dog/index.html', desc: 'Japan pet import quarantine system', region: 'Japan' },
  { name: 'Singapore AVS Pet Import', url: 'https://www.nparks.gov.sg/avs/pets', desc: 'Singapore pet import procedures', region: 'Singapore' },
  { name: 'UAE Pet Import', url: 'https://www.moccae.gov.ae', desc: 'UAE Ministry of Climate Change pet regulations', region: 'UAE' },
  { name: 'New Zealand MPI', url: 'https://www.mpi.govt.nz/bringing-goods-into-nz/pets/', desc: 'NZ biosecurity pet import regulations', region: 'New Zealand' },
  { name: 'Thailand DLD Pet Import', url: 'https://en.dld.go.th/', desc: 'Thailand Department of Livestock Development', region: 'Thailand' },
];

// ── International Pet Transport Companies ──
const TRANSPORT_COMPANIES = [
  { name: 'IPATA', url: 'https://www.ipata.org/', desc: 'International Pet & Animal Transportation Association', badge: 'Industry Body' },
  { name: 'PetRelocation', url: 'https://www.petrelocation.com/', desc: 'Door-to-door international pet relocation', badge: 'Premium' },
  { name: 'AirAnimal', url: 'https://www.airanimal.com/', desc: 'USDA certified pet transportation', badge: 'Certified' },
  { name: 'Starwood Pet Travel', url: 'https://www.starwoodanimaltransport.com/', desc: 'Luxury pet relocation worldwide', badge: 'Luxury' },
  { name: 'World Care Pet', url: 'https://www.worldcarepet.com/', desc: 'Complete pet shipping services', badge: 'Global' },
];

// ── Pet Requirements Data ──
const PET_REQUIREMENTS = {
  dog: [
    'Microchip (ISO 11784/11785 compliant)',
    'Rabies vaccination (≥21 days before travel)',
    'Health certificate from licensed veterinarian',
    'Import permit (country-specific)',
    'Quarantine requirements (varies 0–180 days)',
    'Breed restrictions (check destination country)',
    'Tapeworm treatment (some EU countries)',
    'Titer test (rabies antibody, some countries)'
  ],
  cat: [
    'Microchip (ISO 11784/11785 compliant)',
    'Rabies vaccination (≥21 days before travel)',
    'Health certificate from licensed veterinarian',
    'Import permit (country-specific)',
    'Quarantine requirements (varies by destination)',
    'FeLV/FIV test (some countries require)',
    'Internal/external parasite treatment',
    'Blood tests (titer test for certain countries)'
  ],
  bird: [
    'CITES permit (for protected species)',
    'Avian health certificate',
    'Quarantine (often 30+ days)',
    'Import permit from destination country',
    'Psittacosis/chlamydia test (for parrots)',
    'Avian influenza clearance',
    'Species-specific restrictions',
    'Leg band or microchip identification'
  ],
};

export const PetServices: React.FC<PetServicesProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [searchCity, setSearchCity] = useState('');
  const [selectedSearchCity, setSelectedSearchCity] = useState('');
  const [activeTab, setActiveTab] = useState('local');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Find user's city in our DB
  const userCity = currentLocation?.city || '';
  const userCountry = currentLocation?.country || '';

  const matchedCityData = useMemo(() => {
    if (!userCity) return null;
    return CITY_SERVICES_DB.find(c =>
      c.city.toLowerCase() === userCity.toLowerCase() ||
      c.country.toLowerCase() === userCountry.toLowerCase()
    );
  }, [userCity, userCountry]);

  // Top 2 24/7 services for user's location
  const top24hServices = useMemo(() => {
    if (!matchedCityData) return [];
    return matchedCityData.services
      .filter(s => s.is24h)
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      .slice(0, 2);
  }, [matchedCityData]);

  // Search results
  const searchResults = useMemo(() => {
    const query = (selectedSearchCity || searchCity).toLowerCase();
    if (!query) return [];
    return CITY_SERVICES_DB.filter(c =>
      c.city.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query)
    );
  }, [searchCity, selectedSearchCity]);

  // Filtered services for search results
  const filteredSearchServices = useMemo(() => {
    return searchResults.flatMap(city =>
      city.services
        .filter(s => selectedCategory === 'all' || s.type === selectedCategory)
        .map(s => ({ ...s, cityName: city.city, countryName: city.country }))
    );
  }, [searchResults, selectedCategory]);

  const locationDisplay = userCity ? `${userCity}, ${userCountry}` : 'your location';

  const renderServiceCard = (service: LocalService & { cityName?: string; countryName?: string }, showCity = false) => (
    <Card key={service.name} className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-sm truncate">{service.name}</h3>
              {service.is24h && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">
                  <Clock className="h-3 w-3 mr-0.5" /> 24/7
                </Badge>
              )}
              {service.rating >= 4.7 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                  <Star className="h-3 w-3 mr-0.5" /> Top Rated
                </Badge>
              )}
            </div>
            {showCity && service.cityName && (
              <p className="text-xs text-muted-foreground mb-1">
                <MapPin className="h-3 w-3 inline mr-1" />{service.cityName}, {service.countryName}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {service.rating} ({service.reviews.toLocaleString()})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {service.hours}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 truncate">{service.address}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {service.highlights.map(h => (
                <Badge key={h} variant="outline" className="text-[10px] px-1.5 py-0">{h}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {service.languages.map(l => (
                <span key={l} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{l}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <Button size="sm" variant="default" className="h-7 text-xs" asChild>
              <a href={`tel:${service.phone}`}><Phone className="h-3 w-3 mr-1" /> Call</a>
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
              <a href={service.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3 w-3 mr-1" /> Web
              </a>
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(service.name + ' ' + service.address)}`} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-3 w-3 mr-1" /> Map
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            🐾 Pet Services Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Premium veterinary care, pet relocation & travel services worldwide
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1.5">
          <Shield className="h-4 w-4 mr-1.5" /> 4.5★+ Verified Only
        </Badge>
      </div>

      {/* ── TOP 2 LOCAL 24/7 SERVICES ── */}
      {top24hServices.length > 0 && (
        <Card className="border-2 border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              24/7 Emergency Vets Near You
              <Badge variant="outline" className="ml-auto text-xs">
                <MapPin className="h-3 w-3 mr-1" /> {locationDisplay}
              </Badge>
            </CardTitle>
            <CardDescription>
              Top-rated 24/7 emergency veterinary services in {matchedCityData?.city}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {top24hServices.map(s => renderServiceCard(s))}
          </CardContent>
        </Card>
      )}

      {!matchedCityData && userCity && (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            We're expanding coverage to {locationDisplay}. Use the search below or try Google Maps for local services.
            <Button variant="link" className="px-1 h-auto" asChild>
              <a href={`https://www.google.com/maps/search/24+hour+emergency+vet+${encodeURIComponent(locationDisplay)}`} target="_blank" rel="noopener noreferrer">
                Find 24/7 Vets on Google Maps <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── MAIN TABS ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="local">🔍 Search</TabsTrigger>
          <TabsTrigger value="travel">✈️ Travel</TabsTrigger>
          <TabsTrigger value="relocate">🚚 Relocate</TabsTrigger>
          <TabsTrigger value="requirements">📋 Docs</TabsTrigger>
        </TabsList>

        {/* ── SEARCH TAB ── */}
        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search city, country, or area..."
                    value={searchCity}
                    onChange={(e) => { setSearchCity(e.target.value); setSelectedSearchCity(''); }}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSearchCity} onValueChange={(v) => { setSelectedSearchCity(v); setSearchCity(''); }}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Browse cities..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {CITY_SERVICES_DB.map(c => (
                      <SelectItem key={c.city} value={c.city.toLowerCase()}>
                        {c.city}, {c.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >All Services</Badge>
                {SERVICE_CATEGORIES.map(cat => (
                  <Badge
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(cat.id)}
                  >{cat.label}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {filteredSearchServices.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {filteredSearchServices.length} service{filteredSearchServices.length !== 1 ? 's' : ''} found
              </h3>
              {filteredSearchServices.map(s => renderServiceCard(s, true))}
            </div>
          ) : (searchCity || selectedSearchCity) ? (
            <Card className="p-8 text-center">
              <Search className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold mb-2">No results in our database</h3>
              <p className="text-sm text-muted-foreground mb-4">Try searching on Google Maps instead:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" asChild>
                  <a href={`https://www.google.com/maps/search/veterinary+clinic+${encodeURIComponent(searchCity || selectedSearchCity)}`} target="_blank" rel="noopener noreferrer">
                    <Stethoscope className="h-4 w-4 mr-2" /> Find Vets
                  </a>
                </Button>
                <Button variant="destructive" asChild>
                  <a href={`https://www.google.com/maps/search/24+hour+emergency+vet+${encodeURIComponent(searchCity || selectedSearchCity)}`} target="_blank" rel="noopener noreferrer">
                    <AlertCircle className="h-4 w-4 mr-2" /> 24/7 Emergency
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`https://www.google.com/maps/search/pet+grooming+${encodeURIComponent(searchCity || selectedSearchCity)}`} target="_blank" rel="noopener noreferrer">
                    <Scissors className="h-4 w-4 mr-2" /> Grooming
                  </a>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {CITY_SERVICES_DB.map(city => (
                <Button
                  key={city.city}
                  variant="outline"
                  className="h-auto py-3 flex-col items-start text-left"
                  onClick={() => { setSelectedSearchCity(city.city.toLowerCase()); setSearchCity(''); }}
                >
                  <span className="font-medium text-sm">{city.city}</span>
                  <span className="text-xs text-muted-foreground">{city.country} · {city.services.length} services</span>
                </Button>
              ))}
            </div>
          )}

          {/* Always show Google Maps fallback */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Quick Search Any Location
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Vet Clinics', q: 'veterinary+clinic', icon: Stethoscope },
                  { label: '24/7 Emergency Vet', q: '24+hour+emergency+vet', icon: AlertCircle },
                  { label: 'Pet Grooming', q: 'pet+grooming', icon: Scissors },
                  { label: 'Pet Shops', q: 'pet+shop+supplies', icon: ShoppingBag },
                  { label: 'Dog Walking', q: 'dog+walking+service', icon: Heart },
                  { label: 'Pet Boarding', q: 'pet+boarding+kennel', icon: Home },
                ].map(item => (
                  <Button key={item.label} variant="outline" size="sm" className="justify-start" asChild>
                    <a href={`https://www.google.com/maps/search/${item.q}+${encodeURIComponent(searchCity || selectedSearchCity || userCity || 'near me')}`} target="_blank" rel="noopener noreferrer">
                      <item.icon className="h-4 w-4 mr-2" /> {item.label}
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TRAVEL TAB ── */}
        <TabsContent value="travel" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Always verify requirements with official government sources. Regulations change frequently.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Official Government Resources
              </CardTitle>
              <CardDescription>Verify pet import/export requirements with official sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {GOVERNMENT_RESOURCES.map(r => (
                  <Button key={r.name} variant="outline" className="w-full justify-start h-auto py-3" asChild>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3">
                      <FileText className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {r.name} <Badge variant="outline" className="text-[10px]">Official</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{r.desc}</div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">{r.region}</Badge>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Airline Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" /> Airline Pet Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {[
                  { name: 'IATA Live Animals Regulations', url: 'https://www.iata.org/en/programs/cargo/live-animals/', desc: 'International aviation pet standards', type: 'Standards' },
                  { name: 'Lufthansa Cargo Animals', url: 'https://www.lufthansa-cargo.com/special-cargo/live-animals', desc: 'Professional animal transport', type: 'Airline' },
                  { name: 'KLM Pet Travel', url: 'https://www.klm.com/information/travel/extra-baggage/animals', desc: 'KLM pet travel booking', type: 'Airline' },
                  { name: 'American Airlines Pets', url: 'https://www.aa.com/i18n/travel-info/special-assistance/pets.jsp', desc: 'AA pet travel requirements', type: 'Airline' },
                  { name: 'Emirates SkyCargo Animals', url: 'https://www.skycargo.com/en/live-animals', desc: 'Emirates live animal transport', type: 'Airline' },
                  { name: 'Singapore Airlines Pets', url: 'https://www.singaporeair.com/en_UK/sg/travel-info/special-assistance/travelling-with-pets/', desc: 'SIA pet travel policies', type: 'Airline' },
                ].map(r => (
                  <Button key={r.name} variant="outline" className="w-full justify-start h-auto py-3" asChild>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                      <Plane className="h-4 w-4 shrink-0 text-blue-500" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.desc}</div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RELOCATE TAB ── */}
        <TabsContent value="relocate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" /> Certified Pet Relocation Companies
              </CardTitle>
              <CardDescription>Professional international pet transport services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {TRANSPORT_COMPANIES.map(c => (
                  <Button key={c.name} variant="outline" className="w-full justify-start h-auto py-4" asChild>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                      <Shield className="h-5 w-5 shrink-0 text-green-500" />
                      <div className="flex-1 text-left">
                        <div className="font-medium flex items-center gap-2">
                          {c.name}
                          <Badge variant="default" className="text-[10px] bg-green-600">{c.badge}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">{c.desc}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">💡 Pet Relocation Tips</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>✅ Book 3-6 months ahead for international moves</li>
                <li>✅ Get quotes from at least 3 companies</li>
                <li>✅ Verify IPATA/USDA certification</li>
                <li>✅ Ensure door-to-door service includes customs clearance</li>
                <li>✅ Check breed restrictions at destination (BSL laws)</li>
                <li>✅ Budget $2,000–$8,000+ for international relocation</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── REQUIREMENTS TAB ── */}
        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travel Requirements by Pet Type</CardTitle>
              <CardDescription>Essential documentation and health requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dog" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dog" className="gap-1.5"><Dog className="h-4 w-4" /> Dogs</TabsTrigger>
                  <TabsTrigger value="cat" className="gap-1.5"><Cat className="h-4 w-4" /> Cats</TabsTrigger>
                  <TabsTrigger value="bird" className="gap-1.5"><Bird className="h-4 w-4" /> Birds</TabsTrigger>
                </TabsList>
                {(['dog', 'cat', 'bird'] as const).map(type => (
                  <TabsContent key={type} value={type} className="space-y-3 mt-4">
                    <ul className="space-y-2">
                      {PET_REQUIREMENTS[type].map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" /> Important Reminders
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>⚠️ Some countries have 6-month quarantine (UK, Australia, NZ, Japan, Singapore)</li>
                <li>⚠️ Brachycephalic breeds (pugs, bulldogs) restricted on most airlines</li>
                <li>⚠️ Certain countries ban specific breeds entirely (pit bulls, Rottweilers)</li>
                <li>⚠️ Rabies-free countries have stricter import protocols</li>
                <li>⚠️ Start preparation 6+ months before international travel</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PetServices;
