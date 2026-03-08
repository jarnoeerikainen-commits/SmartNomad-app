import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Star, ExternalLink, Search, Navigation, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaxiService {
  name: string;
  type: 'standard' | 'premium' | 'luxury';
  rating: number;
  bookingUrl: string;
  appAvailable: boolean;
  features: string[];
  priceLevel: string;
  availability: string;
}

interface CityTaxis {
  city: string;
  country: string;
  countryCode: string;
  services: TaxiService[];
}

const svc = (
  name: string, type: 'standard' | 'premium' | 'luxury', rating: number,
  bookingUrl: string, priceLevel: string, availability: string,
  features: string[]
): TaxiService => ({ name, type, rating, bookingUrl, appAvailable: true, features, priceLevel, availability });

const ct = (city: string, country: string, countryCode: string, services: TaxiService[]): CityTaxis =>
  ({ city, country, countryCode, services });

const taxiServicesData: CityTaxis[] = [
  // ===== EUROPE =====
  ct('London', 'United Kingdom', 'GB', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/gb/en/ride/', '£8-15 avg', 'Excellent', ['24/7', 'Split fare', 'Multiple types', 'Safety features']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en-gb/cities/london/', '£6-12 avg', 'Wide coverage', ['Lower prices', 'Carbon neutral', 'Scheduled rides']),
    svc('Gett', 'premium', 4.6, 'https://gett.com/uk/', '£15-30 avg', 'Central London', ['Professional drivers', 'Business accounts', 'Fixed pricing']),
    svc('Addison Lee', 'luxury', 4.7, 'https://www.addisonlee.com/', '£40-100+', 'London & airports', ['Luxury fleet', 'Chauffeur service', 'Airport transfers', 'Corporate']),
  ]),
  ct('Paris', 'France', 'FR', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/fr/en/ride/', '€10-20 avg', 'Excellent', ['UberX', 'UberGreen', 'Airport service']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en-fr/cities/paris/', '€8-16 avg', 'Wide coverage', ['Competitive pricing', 'Eco-friendly']),
    svc('G7 Taxi', 'premium', 4.5, 'https://www.g7.fr/', '€15-35 avg', 'Paris & suburbs', ['Official taxis', 'Fixed airport rates', 'Business class']),
    svc('Blacklane', 'luxury', 4.8, 'https://www.blacklane.com/en/chauffeur-service-paris/', '€80-200+', 'Paris & CDG/Orly', ['Chauffeur', 'Premium vehicles', 'Meet & greet']),
  ]),
  ct('Berlin', 'Germany', 'DE', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/de/en/ride/', '€8-18 avg', 'Excellent', ['Green rides', 'Split payment']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/berlin/', '€6-14 avg', 'Wide coverage', ['Lower fares', 'Quick arrival']),
    svc('FREE NOW', 'premium', 4.6, 'https://www.free-now.com/', '€12-25 avg', 'Berlin city', ['Licensed taxis', 'Fixed pricing', 'Business accounts']),
  ]),
  ct('Madrid', 'Spain', 'ES', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/es/en/ride/', '€8-15 avg', 'Excellent', ['UberX', 'Comfort', 'Airport transfers']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/madrid/', '€6-12 avg', 'Wide coverage', ['Affordable rates', 'Scheduled rides']),
    svc('Cabify', 'premium', 4.6, 'https://cabify.com/en/spain', '€12-30 avg', 'Madrid & suburbs', ['Premium service', 'Corporate', 'Executive cars']),
  ]),
  ct('Barcelona', 'Spain', 'ES', [
    svc('Uber', 'standard', 4.2, 'https://www.uber.com/es-es/ride/', '€8-16 avg', 'Good coverage', ['Multiple types', 'Airport service']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/barcelona/', '€6-13 avg', 'Wide coverage', ['Competitive pricing', 'Eco options']),
    svc('Cabify', 'premium', 4.7, 'https://cabify.com/en/barcelona', '€15-35 avg', 'Barcelona city', ['Premium vehicles', 'Fixed rates', 'Airport transfers']),
  ]),
  ct('Rome', 'Italy', 'IT', [
    svc('Uber', 'standard', 4.2, 'https://www.uber.com/it/en/ride/', '€10-18 avg', 'Rome center', ['UberX', 'Black', 'Green']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/rome/', '€8-15 avg', 'Good coverage', ['Lower prices', 'Reliable']),
    svc('IT Taxi', 'premium', 4.5, 'https://www.ittaxi.it/', '€15-40 avg', 'Rome & Fiumicino', ['Official taxis', 'Fixed airport rates', 'English drivers']),
  ]),
  ct('Milan', 'Italy', 'IT', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/it/en/ride/', '€8-16 avg', 'Good coverage', ['UberX', 'Comfort', 'Black']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/milan/', '€6-13 avg', 'Wide coverage', ['Competitive', 'Quick service']),
    svc('Blacklane', 'luxury', 4.8, 'https://www.blacklane.com/', '€70-200+', 'Milan & Malpensa', ['Chauffeur', 'Luxury vehicles', 'Meet & greet']),
  ]),
  ct('Amsterdam', 'Netherlands', 'NL', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/nl/en/ride/', '€10-20 avg', 'Excellent', ['Green rides', 'Airport service']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/amsterdam/', '€8-16 avg', 'Wide coverage', ['Affordable', 'Quick arrival']),
    svc('FREE NOW', 'premium', 4.6, 'https://www.free-now.com/nl/', '€15-30 avg', 'Amsterdam & Schiphol', ['Licensed taxis', 'Fixed pricing']),
  ]),
  ct('Vienna', 'Austria', 'AT', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/at/en/ride/', '€8-16 avg', 'Excellent', ['Comfort', 'Green', 'Airport']),
    svc('Bolt', 'standard', 4.6, 'https://bolt.eu/en/cities/vienna/', '€6-12 avg', 'Wide coverage', ['Competitive', 'Eco-friendly']),
  ]),
  ct('Prague', 'Czech Republic', 'CZ', [
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/prague/', '€4-10 avg', 'Excellent', ['Cheap rides', 'Quick service']),
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/cz/en/ride/', '€5-12 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Liftago', 'premium', 4.4, 'https://www.liftago.com/', '€8-20 avg', 'Prague', ['Local taxis', 'Transparent pricing', 'Driver rating']),
  ]),
  ct('Lisbon', 'Portugal', 'PT', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/pt/en/ride/', '€6-15 avg', 'Excellent', ['UberX', 'Comfort', 'Green']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/lisbon/', '€5-12 avg', 'Wide coverage', ['Affordable', 'Quick arrival']),
    svc('FREE NOW', 'premium', 4.3, 'https://www.free-now.com/pt/', '€8-20 avg', 'Lisbon metro', ['Licensed taxis', 'Fixed pricing']),
  ]),
  ct('Budapest', 'Hungary', 'HU', [
    svc('Bolt', 'standard', 4.6, 'https://bolt.eu/en/cities/budapest/', '€3-8 avg', 'Excellent', ['Very cheap', 'Quick service', 'Reliable']),
    svc('Főtaxi', 'premium', 4.4, 'https://www.fotaxi.hu/', '€6-15 avg', 'Budapest', ['Official taxis', 'Fixed rates', 'Airport service']),
  ]),
  ct('Warsaw', 'Poland', 'PL', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/pl/en/ride/', '€4-10 avg', 'Excellent', ['UberX', 'Comfort', 'Green']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/warsaw/', '€3-8 avg', 'Wide coverage', ['Lower prices', 'Quick arrival']),
    svc('FREE NOW', 'premium', 4.3, 'https://www.free-now.com/pl/', '€6-15 avg', 'Warsaw center', ['Licensed taxis', 'Fixed pricing']),
  ]),
  ct('Zurich', 'Switzerland', 'CH', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/ch/en/ride/', 'CHF 15-35 avg', 'Good coverage', ['Comfort', 'Green', 'XL']),
    svc('Blacklane', 'luxury', 4.8, 'https://www.blacklane.com/', 'CHF 100-300+', 'Zurich & ZRH airport', ['Chauffeur', 'Luxury vehicles', 'Meet & greet']),
  ]),
  ct('Munich', 'Germany', 'DE', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/de/en/ride/', '€8-16 avg', 'Good coverage', ['UberX', 'Green', 'Comfort']),
    svc('FREE NOW', 'premium', 4.5, 'https://www.free-now.com/', '€10-22 avg', 'Munich city', ['Licensed taxis', 'Business accounts']),
  ]),
  ct('Stockholm', 'Sweden', 'SE', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/se/en/ride/', 'SEK 100-250 avg', 'Good coverage', ['UberX', 'Comfort', 'Green']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/stockholm/', 'SEK 80-200 avg', 'Wide coverage', ['Lower fares', 'Professional']),
  ]),
  ct('Copenhagen', 'Denmark', 'DK', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/dk/en/ride/', 'DKK 80-200 avg', 'Good coverage', ['UberX', 'Comfort', 'Premium']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/copenhagen/', 'DKK 60-160 avg', 'Wide coverage', ['Competitive', 'Quick booking']),
  ]),
  ct('Oslo', 'Norway', 'NO', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/no/en/ride/', 'NOK 120-300 avg', 'Good coverage', ['UberX', 'Comfort', 'Green']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/oslo/', 'NOK 100-250 avg', 'Wide coverage', ['Competitive pricing', 'Eco-friendly']),
  ]),
  ct('Helsinki', 'Finland', 'FI', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/fi/en/ride/', '€8-18 avg', 'Good coverage', ['UberX', 'Comfort', 'Green']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/helsinki/', '€6-14 avg', 'Wide coverage', ['Affordable', 'Quick service']),
  ]),
  ct('Dublin', 'Ireland', 'IE', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/ie/en/ride/', '€8-18 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/dublin/', '€6-14 avg', 'Wide coverage', ['Lower prices', 'Quick arrival']),
    svc('FREE NOW', 'premium', 4.5, 'https://www.free-now.com/ie/', '€10-25 avg', 'Dublin metro', ['Licensed taxis', 'Fixed pricing']),
  ]),
  ct('Athens', 'Greece', 'GR', [
    svc('Uber', 'standard', 4.2, 'https://www.uber.com/gr/en/ride/', '€5-12 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/athens/', '€4-10 avg', 'Wide coverage', ['Affordable', 'Quick service']),
    svc('BEAT', 'premium', 4.5, 'https://thebeat.co/en/', '€6-15 avg', 'Athens city', ['Licensed taxis', 'Transparent fares', 'Popular local app']),
  ]),
  ct('Istanbul', 'Turkey', 'TR', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/tr/en/ride/', '₺80-200 avg', 'Good coverage', ['Comfort', 'Taxi', 'Van']),
    svc('BiTaksi', 'standard', 4.5, 'https://www.bitaksi.com/', '₺70-180 avg', 'Excellent', ['Official taxis', 'Lower fares', 'Quick booking']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/istanbul/', '₺60-150 avg', 'Wide coverage', ['Competitive', 'Professional drivers']),
  ]),
  ct('Moscow', 'Russia', 'RU', [
    svc('Yandex Go', 'standard', 4.6, 'https://taxi.yandex.com/', '₽300-800 avg', 'Excellent', ['Dominant app', 'Comfort+', 'Business class', 'Cargo']),
    svc('Citymobil', 'standard', 4.3, 'https://city-mobil.ru/', '₽250-700 avg', 'Wide coverage', ['Competitive', 'Multiple types']),
    svc('Wheely', 'luxury', 4.8, 'https://wheely.com/', '₽2,000-5,000+', 'Moscow city', ['Luxury chauffeur', 'Premium fleet', 'Business class']),
  ]),
  ct('Bucharest', 'Romania', 'RO', [
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/bucharest/', '€3-8 avg', 'Excellent', ['Very affordable', 'Quick service']),
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/ro/en/ride/', '€4-10 avg', 'Good coverage', ['UberX', 'Comfort']),
  ]),
  ct('Tbilisi', 'Georgia', 'GE', [
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/tbilisi/', '₾3-8 avg', 'Wide coverage', ['Very cheap', 'Quick service']),
    svc('Yandex Go', 'standard', 4.4, 'https://taxi.yandex.com/', '₾4-10 avg', 'Good coverage', ['Multiple types', 'Popular locally']),
  ]),

  // ===== NORTH AMERICA =====
  ct('New York', 'United States', 'US', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/us/en/ride/', '$15-30 avg', 'Excellent', ['UberX', 'Comfort', 'XL', 'Pool', 'Pet-friendly']),
    svc('Lyft', 'standard', 4.4, 'https://www.lyft.com/', '$14-28 avg', 'Excellent', ['Standard', 'XL', 'Lux', 'Scheduled']),
    svc('Via', 'standard', 4.3, 'https://ridewithvia.com/', '$5-15 avg', 'Manhattan & boroughs', ['Shared rides', 'Lower cost', 'Eco-friendly']),
    svc('Blacklane', 'luxury', 4.8, 'https://www.blacklane.com/en/chauffeur-service-new-york/', '$100-300+', 'NYC & airports', ['Chauffeur', 'Premium vehicles', 'Meet & greet']),
  ]),
  ct('Los Angeles', 'United States', 'US', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/us/en/ride/', '$12-25 avg', 'Excellent', ['UberX', 'Comfort', 'Black', 'SUV']),
    svc('Lyft', 'standard', 4.3, 'https://www.lyft.com/', '$11-23 avg', 'Excellent', ['Standard', 'XL', 'Lux']),
    svc('Blacklane', 'luxury', 4.7, 'https://www.blacklane.com/', '$90-250+', 'LA & LAX', ['Chauffeur', 'Luxury', 'Airport transfers']),
  ]),
  ct('San Francisco', 'United States', 'US', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/us/en/ride/', '$15-30 avg', 'Excellent', ['UberX', 'Comfort', 'Green']),
    svc('Lyft', 'standard', 4.4, 'https://www.lyft.com/', '$14-28 avg', 'Excellent', ['Standard', 'XL', 'Lux', 'Wait & Save']),
  ]),
  ct('Chicago', 'United States', 'US', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/us/en/ride/', '$12-22 avg', 'Excellent', ['UberX', 'Comfort', 'Black']),
    svc('Lyft', 'standard', 4.3, 'https://www.lyft.com/', '$11-20 avg', 'Excellent', ['Standard', 'XL', 'Lux']),
  ]),
  ct('Washington DC', 'United States', 'US', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/us/en/ride/', '$12-25 avg', 'Excellent', ['UberX', 'Comfort', 'Black', 'XL']),
    svc('Lyft', 'standard', 4.3, 'https://www.lyft.com/', '$11-23 avg', 'Excellent', ['Standard', 'XL', 'Lux']),
  ]),
  ct('Miami', 'United States', 'US', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/us/en/ride/', '$10-22 avg', 'Excellent', ['UberX', 'Comfort', 'Black', 'Español']),
    svc('Lyft', 'standard', 4.3, 'https://www.lyft.com/', '$9-20 avg', 'Good coverage', ['Standard', 'XL']),
  ]),
  ct('Toronto', 'Canada', 'CA', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/ca/en/ride/', 'CAD $15-30 avg', 'Excellent', ['UberX', 'Comfort', 'Green']),
    svc('Lyft', 'standard', 4.4, 'https://www.lyft.com/', 'CAD $14-28 avg', 'Good coverage', ['Standard', 'XL', 'Airport']),
    svc('Beck Taxi', 'premium', 4.3, 'https://www.becktaxi.com/', 'CAD $20-40 avg', 'Toronto GTA', ['Licensed taxis', 'Airport flat rates']),
  ]),
  ct('Vancouver', 'Canada', 'CA', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/ca/en/ride/', 'CAD $12-25 avg', 'Excellent', ['UberX', 'Comfort', 'Pet']),
    svc('Lyft', 'standard', 4.3, 'https://www.lyft.com/', 'CAD $11-23 avg', 'Good coverage', ['Standard', 'XL']),
  ]),
  ct('Montreal', 'Canada', 'CA', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/ca/en/ride/', 'CAD $10-22 avg', 'Excellent', ['UberX', 'Comfort', 'Green']),
    svc('Lyft', 'standard', 4.3, 'https://www.lyft.com/', 'CAD $9-20 avg', 'Good coverage', ['Standard', 'XL']),
  ]),
  ct('Mexico City', 'Mexico', 'MX', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/mx/en/ride/', 'MXN $60-150 avg', 'Excellent', ['UberX', 'Comfort', 'Black', 'Flash']),
    svc('Didi', 'standard', 4.4, 'https://web.didiglobal.com/mx/', 'MXN $50-130 avg', 'Wide coverage', ['Express', 'Taxi', 'Preferred']),
    svc('Cabify', 'premium', 4.6, 'https://cabify.com/mexico', 'MXN $100-250 avg', 'Mexico City', ['Premium', 'Executive', 'Corporate']),
  ]),

  // ===== ASIA =====
  ct('Tokyo', 'Japan', 'JP', [
    svc('JapanTaxi (GO)', 'standard', 4.5, 'https://go.mo-t.com/', '¥1,200-3,000 avg', 'Excellent', ['Official taxis', 'English app', 'Advance booking']),
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/jp/en/ride/', '¥1,500-3,500 avg', 'Tokyo 23 wards', ['Taxi', 'Premium', 'Black']),
    svc('S.RIDE', 'premium', 4.6, 'https://www.sride.jp/', '¥2,000-5,000 avg', 'Tokyo metro', ['Premium taxis', 'One-tap booking', 'AI dispatch']),
  ]),
  ct('Osaka', 'Japan', 'JP', [
    svc('GO', 'standard', 4.5, 'https://go.mo-t.com/', '¥1,000-2,500 avg', 'Excellent', ['Official taxis', 'English app']),
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/jp/en/ride/', '¥1,200-3,000 avg', 'Good coverage', ['Taxi', 'Premium']),
  ]),
  ct('Singapore', 'Singapore', 'SG', [
    svc('Grab', 'standard', 4.6, 'https://www.grab.com/sg/', 'SGD $8-20 avg', 'Excellent', ['JustGrab', 'GrabCar', 'Premium', 'Airport']),
    svc('Gojek', 'standard', 4.4, 'https://www.gojek.com/sg/', 'SGD $6-16 avg', 'Wide coverage', ['GoRide', 'GoCar', 'Lower fares']),
    svc('ComfortDelGro', 'premium', 4.5, 'https://www.cdgtaxi.com.sg/', 'SGD $12-35 avg', 'Island-wide', ['Official taxis', 'Limousine', 'Fixed rates']),
  ]),
  ct('Hong Kong', 'Hong Kong', 'HK', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/hk/en/ride/', 'HKD $50-150 avg', 'Excellent', ['UberX', 'Comfort', 'Black']),
    svc('HKTaxi', 'standard', 4.3, 'https://www.hktaxi.com/', 'HKD $40-120 avg', 'HK Island & Kowloon', ['Official taxis', 'English app']),
  ]),
  ct('Seoul', 'South Korea', 'KR', [
    svc('Kakao T', 'standard', 4.7, 'https://www.kakaomobility.com/', '₩5,000-15,000 avg', 'Excellent', ['Standard', 'Black', 'Venti', 'English support']),
    svc('Uber', 'premium', 4.4, 'https://www.uber.com/kr/en/ride/', '₩15,000-40,000 avg', 'Seoul center', ['Uber Black', 'Premium', 'English app']),
  ]),
  ct('Bangkok', 'Thailand', 'TH', [
    svc('Grab', 'standard', 4.5, 'https://www.grab.com/th/', '฿80-200 avg', 'Excellent', ['JustGrab', 'GrabCar', 'Premium', 'Airport']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/bangkok/', '฿60-160 avg', 'Wide coverage', ['Lower prices', 'Quick service']),
    svc('inDrive', 'standard', 4.3, 'https://indrive.com/', '฿50-150 avg', 'Good coverage', ['Negotiate price', 'Choose driver']),
  ]),
  ct('Shanghai', 'China', 'CN', [
    svc('Didi', 'standard', 4.5, 'https://web.didiglobal.com/', '¥15-50 avg', 'Excellent', ['Express', 'Premier', 'Luxe', 'English app']),
  ]),
  ct('Beijing', 'China', 'CN', [
    svc('Didi', 'standard', 4.5, 'https://web.didiglobal.com/', '¥14-45 avg', 'Excellent', ['Express', 'Premier', 'English support']),
  ]),
  ct('Dubai', 'United Arab Emirates', 'AE', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/ae/en/ride/', 'AED 20-50 avg', 'Excellent', ['UberX', 'Comfort', 'Black', 'Yacht']),
    svc('Careem', 'standard', 4.6, 'https://www.careem.com/', 'AED 18-45 avg', 'Excellent', ['Go', 'Go+', 'Kids', 'Business']),
    svc('Dubai Taxi', 'premium', 4.4, 'https://www.dubaitaxi.ae/', 'AED 25-70 avg', 'Dubai city', ['Official taxis', 'Ladies taxis', 'Luxury cabs']),
    svc('Blacklane', 'luxury', 4.8, 'https://www.blacklane.com/', 'AED 300-800+', 'Dubai & DXB', ['Chauffeur', 'Luxury', 'Meet & greet']),
  ]),
  ct('Abu Dhabi', 'United Arab Emirates', 'AE', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/ae/en/ride/', 'AED 18-40 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Careem', 'standard', 4.5, 'https://www.careem.com/', 'AED 15-35 avg', 'Excellent', ['Go', 'Business']),
  ]),
  ct('Doha', 'Qatar', 'QA', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/qa/en/ride/', 'QAR 15-40 avg', 'Good coverage', ['UberX', 'Comfort', 'XL']),
    svc('Careem', 'standard', 4.5, 'https://www.careem.com/', 'QAR 12-35 avg', 'Excellent', ['Go', 'Business']),
    svc('Karwa Taxi', 'premium', 4.3, 'https://www.mowasalat.com/', 'QAR 20-60 avg', 'Doha city', ['Official taxis', 'Airport service', 'Limousine']),
  ]),
  ct('Mumbai', 'India', 'IN', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/in/en/ride/', '₹150-400 avg', 'Excellent', ['Go', 'Premier', 'XL', 'Auto']),
    svc('Ola', 'standard', 4.4, 'https://www.olacabs.com/', '₹120-350 avg', 'Excellent', ['Mini', 'Prime', 'Lux', 'Auto']),
  ]),
  ct('Delhi', 'India', 'IN', [
    svc('Uber', 'standard', 4.2, 'https://www.uber.com/in/en/ride/', '₹140-380 avg', 'Excellent', ['Go', 'Premier', 'Auto']),
    svc('Ola', 'standard', 4.3, 'https://www.olacabs.com/', '₹110-330 avg', 'Excellent', ['Mini', 'Prime', 'Auto']),
  ]),
  ct('Bangalore', 'India', 'IN', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/in/en/ride/', '₹120-350 avg', 'Excellent', ['Go', 'Premier', 'Auto', 'Moto']),
    svc('Ola', 'standard', 4.4, 'https://www.olacabs.com/', '₹100-300 avg', 'Excellent', ['Mini', 'Prime', 'Auto']),
    svc('Rapido', 'standard', 4.2, 'https://www.rapido.bike/', '₹30-100 avg', 'Wide coverage', ['Bike taxi', 'Auto', 'Very cheap']),
  ]),
  ct('Kuala Lumpur', 'Malaysia', 'MY', [
    svc('Grab', 'standard', 4.5, 'https://www.grab.com/my/', 'MYR 8-25 avg', 'Excellent', ['GrabCar', 'Premium', 'Airport']),
    svc('AirAsia Ride', 'standard', 4.3, 'https://www.airasia.com/ride/', 'MYR 7-22 avg', 'Good coverage', ['Competitive', 'Super app']),
  ]),
  ct('Jakarta', 'Indonesia', 'ID', [
    svc('Grab', 'standard', 4.5, 'https://www.grab.com/id/', 'IDR 20,000-60,000 avg', 'Excellent', ['GrabCar', 'GrabBike', 'Premium']),
    svc('Gojek', 'standard', 4.5, 'https://www.gojek.com/', 'IDR 15,000-50,000 avg', 'Excellent', ['GoRide', 'GoCar', 'Multi-service']),
  ]),
  ct('Taipei', 'Taiwan', 'TW', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/tw/en/ride/', 'TWD 100-300 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('LINE TAXI', 'standard', 4.5, 'https://taxi.line.me/', 'TWD 85-250 avg', 'Excellent', ['LINE integration', 'Official taxis', 'Popular locally']),
  ]),
  ct('Manila', 'Philippines', 'PH', [
    svc('Grab', 'standard', 4.4, 'https://www.grab.com/ph/', 'PHP 100-300 avg', 'Excellent', ['GrabCar', 'GrabShare', 'Premium']),
    svc('Angkas', 'standard', 4.3, 'https://www.angkas.com/', 'PHP 50-150 avg', 'Metro Manila', ['Motorcycle taxi', 'Beat traffic']),
  ]),
  ct('Ho Chi Minh City', 'Vietnam', 'VN', [
    svc('Grab', 'standard', 4.5, 'https://www.grab.com/vn/', 'VND 30,000-80,000 avg', 'Excellent', ['GrabCar', 'GrabBike', 'Premium']),
    svc('Be', 'standard', 4.4, 'https://be.com.vn/', 'VND 25,000-70,000 avg', 'Wide coverage', ['Vietnamese app', 'Bike & car', 'Lower fares']),
  ]),
  ct('Tel Aviv', 'Israel', 'IL', [
    svc('Gett', 'standard', 4.5, 'https://gett.com/il/', 'ILS 25-60 avg', 'Excellent', ['Official taxis', 'Fixed pricing', 'Popular locally']),
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/il/en/ride/', 'ILS 30-70 avg', 'Good coverage', ['UberX', 'Comfort']),
  ]),

  // ===== AUSTRALIA & OCEANIA =====
  ct('Sydney', 'Australia', 'AU', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/au/en/ride/', 'AUD $15-35 avg', 'Excellent', ['UberX', 'Comfort', 'Green', 'Pet']),
    svc('DiDi', 'standard', 4.4, 'https://web.didiglobal.com/au/', 'AUD $12-30 avg', 'Wide coverage', ['Express', 'Max', 'Share']),
    svc('13cabs', 'premium', 4.3, 'https://www.13cabs.com.au/', 'AUD $20-50 avg', 'Sydney metro', ['Official taxis', 'Maxi cabs', 'Silver Service']),
  ]),
  ct('Melbourne', 'Australia', 'AU', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/au/en/ride/', 'AUD $14-32 avg', 'Excellent', ['UberX', 'Comfort', 'Premium']),
    svc('DiDi', 'standard', 4.3, 'https://web.didiglobal.com/au/', 'AUD $11-28 avg', 'Wide coverage', ['Express', 'Max', 'Share']),
    svc('13cabs', 'premium', 4.2, 'https://www.13cabs.com.au/', 'AUD $18-45 avg', 'Melbourne metro', ['Official taxis', 'Silver Service']),
  ]),
  ct('Auckland', 'New Zealand', 'NZ', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/nz/en/ride/', 'NZD $12-30 avg', 'Good coverage', ['UberX', 'Comfort', 'XL']),
    svc('Ola', 'standard', 4.3, 'https://www.olacabs.com/nz/', 'NZD $10-25 avg', 'Auckland', ['Standard', 'Comfort', 'Competitive']),
  ]),

  // ===== SOUTH AMERICA =====
  ct('São Paulo', 'Brazil', 'BR', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/br/en/ride/', 'R$15-40 avg', 'Excellent', ['UberX', 'Comfort', 'Black', 'Flash']),
    svc('99', 'standard', 4.5, 'https://99app.com/', 'R$12-35 avg', 'Excellent', ['Pop', 'Comfort', 'Top', 'Lower prices']),
  ]),
  ct('Buenos Aires', 'Argentina', 'AR', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/ar/en/ride/', 'ARS $800-2,000 avg', 'Good coverage', ['UberX', 'Comfort', 'Black']),
    svc('Cabify', 'premium', 4.5, 'https://cabify.com/argentina', 'ARS $1,000-2,500 avg', 'Buenos Aires', ['Lite', 'Executive', 'Fixed pricing']),
    svc('BA Taxi', 'standard', 4.2, 'https://www.bataxiapp.com/', 'ARS $900-2,200 avg', 'Buenos Aires', ['Official taxis', 'Airport service']),
  ]),
  ct('Bogotá', 'Colombia', 'CO', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/co/en/ride/', 'COP $8,000-20,000 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Didi', 'standard', 4.4, 'https://web.didiglobal.com/co/', 'COP $7,000-18,000 avg', 'Wide coverage', ['Express', 'Taxi']),
    svc('InDriver', 'standard', 4.2, 'https://indrive.com/', 'COP $6,000-15,000 avg', 'Good coverage', ['Negotiate price', 'Choose driver']),
  ]),
  ct('Santiago', 'Chile', 'CL', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/cl/en/ride/', 'CLP $3,000-8,000 avg', 'Excellent', ['UberX', 'Comfort', 'Black']),
    svc('Didi', 'standard', 4.3, 'https://web.didiglobal.com/cl/', 'CLP $2,500-7,000 avg', 'Wide coverage', ['Express', 'Taxi']),
  ]),
  ct('Lima', 'Peru', 'PE', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/pe/en/ride/', 'PEN 8-25 avg', 'Good coverage', ['UberX', 'Flash']),
    svc('Didi', 'standard', 4.4, 'https://web.didiglobal.com/pe/', 'PEN 7-22 avg', 'Wide coverage', ['Express', 'Taxi', 'Competitive']),
    svc('InDriver', 'standard', 4.2, 'https://indrive.com/', 'PEN 6-20 avg', 'Good coverage', ['Negotiate price']),
  ]),
  ct('Medellín', 'Colombia', 'CO', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/co/en/ride/', 'COP $7,000-18,000 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Didi', 'standard', 4.3, 'https://web.didiglobal.com/co/', 'COP $6,000-15,000 avg', 'Wide coverage', ['Express', 'Taxi']),
  ]),

  // ===== AFRICA =====
  ct('Cape Town', 'South Africa', 'ZA', [
    svc('Uber', 'standard', 4.5, 'https://www.uber.com/za/en/ride/', 'ZAR 50-150 avg', 'Excellent', ['UberX', 'Comfort', 'XL']),
    svc('Bolt', 'standard', 4.6, 'https://bolt.eu/en/cities/cape-town/', 'ZAR 40-120 avg', 'Wide coverage', ['Lower fares', 'Quick service']),
  ]),
  ct('Johannesburg', 'South Africa', 'ZA', [
    svc('Uber', 'standard', 4.4, 'https://www.uber.com/za/en/ride/', 'ZAR 45-140 avg', 'Excellent', ['UberX', 'Comfort', 'XL']),
    svc('Bolt', 'standard', 4.5, 'https://bolt.eu/en/cities/johannesburg/', 'ZAR 35-110 avg', 'Wide coverage', ['Lower fares', 'Professional']),
  ]),
  ct('Nairobi', 'Kenya', 'KE', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/ke/en/ride/', 'KES 200-600 avg', 'Good coverage', ['UberX', 'Comfort', 'Boda (motorcycle)']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/nairobi/', 'KES 150-500 avg', 'Wide coverage', ['Lower fares', 'Quick service']),
    svc('Little Cab', 'standard', 4.2, 'https://www.little.bz/', 'KES 180-550 avg', 'Nairobi', ['Kenyan app', 'M-Pesa payment']),
  ]),
  ct('Cairo', 'Egypt', 'EG', [
    svc('Uber', 'standard', 4.3, 'https://www.uber.com/eg/en/ride/', 'EGP 30-80 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Careem', 'standard', 4.4, 'https://www.careem.com/', 'EGP 25-70 avg', 'Excellent', ['Go', 'Go+', 'Popular locally']),
    svc('Didi', 'standard', 4.2, 'https://web.didiglobal.com/', 'EGP 20-60 avg', 'Growing coverage', ['Express', 'Competitive pricing']),
  ]),
  ct('Lagos', 'Nigeria', 'NG', [
    svc('Uber', 'standard', 4.2, 'https://www.uber.com/ng/en/ride/', 'NGN 800-3,000 avg', 'Good coverage', ['UberX', 'Comfort']),
    svc('Bolt', 'standard', 4.4, 'https://bolt.eu/en/cities/lagos/', 'NGN 600-2,500 avg', 'Wide coverage', ['Lower fares', 'Quick']),
    svc('InDriver', 'standard', 4.1, 'https://indrive.com/', 'NGN 500-2,000 avg', 'Good coverage', ['Negotiate price']),
  ]),
  ct('Casablanca', 'Morocco', 'MA', [
    svc('Careem', 'standard', 4.4, 'https://www.careem.com/', 'MAD 15-40 avg', 'Good coverage', ['Go', 'Business']),
    svc('InDriver', 'standard', 4.2, 'https://indrive.com/', 'MAD 10-30 avg', 'Growing', ['Negotiate price']),
  ]),
];

interface TaxiServicesProps {
  currentLocation?: { countryCode?: string; city?: string } | null;
}

const TaxiServices: React.FC<TaxiServicesProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');

  const countries = useMemo(() => {
    const countrySet = new Set(taxiServicesData.map(item => item.country));
    return Array.from(countrySet).sort();
  }, []);

  const sortedData = useMemo(() => {
    const userCountryCode = currentLocation?.countryCode?.toUpperCase();
    const userCity = currentLocation?.city?.toLowerCase();

    return [...taxiServicesData].sort((a, b) => {
      if (userCity) {
        if (a.city.toLowerCase() === userCity && b.city.toLowerCase() !== userCity) return -1;
        if (b.city.toLowerCase() === userCity && a.city.toLowerCase() !== userCity) return 1;
      }
      if (userCountryCode) {
        if (a.countryCode === userCountryCode && b.countryCode !== userCountryCode) return -1;
        if (b.countryCode === userCountryCode && a.countryCode !== userCountryCode) return 1;
      }
      return a.city.localeCompare(b.city);
    });
  }, [currentLocation]);

  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
      const matchesServiceType = selectedServiceType === 'all' ||
        item.services.some(s => s.type === selectedServiceType);
      return matchesSearch && matchesCountry && matchesServiceType;
    });
  }, [sortedData, searchQuery, selectedCountry, selectedServiceType]);

  const getServiceBadgeVariant = (type: string) => {
    switch (type) {
      case 'luxury': return 'default' as const;
      case 'premium': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'luxury': return <Crown className="h-3 w-3" />;
      case 'premium': return <Sparkles className="h-3 w-3" />;
      default: return <Car className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">🚕 Taxi & Ride Services</h1>
        <p className="text-muted-foreground">
          Standard, premium & VIP luxury chauffeurs — {taxiServicesData.length} cities worldwide
        </p>
      </div>

      {currentLocation?.city && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary">
              <Navigation className="h-5 w-5" />
              <p className="font-medium">
                📍 Showing {currentLocation.city} first based on your location
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search City or Country</label>
              <Input
                placeholder="e.g. New York, London, Tokyo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">🚗 Standard (Uber, Bolt, Grab)</SelectItem>
                  <SelectItem value="premium">⭐ Premium</SelectItem>
                  <SelectItem value="luxury">👑 VIP / Luxury Chauffeur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {taxiServicesData.length} cities
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((cityData) => (
          <Card key={`${cityData.city}-${cityData.countryCode}`} className="hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    {cityData.city}
                  </CardTitle>
                  <CardDescription>{cityData.country}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {cityData.services.length} services
                  </Badge>
                  {currentLocation?.city?.toLowerCase() === cityData.city.toLowerCase() && (
                    <Badge variant="default" className="gradient-trust">
                      <Navigation className="h-3 w-3 mr-1" />
                      You're Here
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cityData.services.map((service, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-accent/50 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <Badge variant={getServiceBadgeVariant(service.type)} className="capitalize">
                        {getServiceIcon(service.type)}
                        <span className="ml-1">{service.type}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {service.rating}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-24">Price Range:</span>
                      <span className="font-medium">{service.priceLevel}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-24">Coverage:</span>
                      <span className="font-medium">{service.availability}</span>
                    </div>
                    {service.appAvailable && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-24">Mobile App:</span>
                        <Badge variant="secondary" className="text-xs">✓ Available</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.features.map((feature, fi) => (
                      <Badge key={fi} variant="outline" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                  <Button
                    className={`w-full ${
                      service.type === 'luxury' ? 'gradient-trust'
                        : service.type === 'premium' ? 'gradient-success'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    size="sm"
                    onClick={() => window.open(service.bookingUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Book {service.name}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No services found matching your criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader><CardTitle>🌍 Taxi & Ride Safety Tips</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            'Always verify driver and vehicle details before entering',
            'Share your trip details with a friend or family member',
            'Use in-app payment for security and convenience',
            'Check ratings and reviews before booking premium services',
            'For luxury services, book in advance for better availability',
            'In some cities, local apps (Grab, Kakao T, Yandex Go) work better than Uber',
          ].map((tip, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-primary font-bold">{i + 1}.</div>
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxiServices;
