import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Plane, 
  Wifi, 
  Coffee, 
  Utensils, 
  Briefcase, 
  Sparkles,
  TrendingUp,
  CreditCard,
  DollarSign,
  MapPin,
  Star,
  Shield,
  CheckCircle2,
  ExternalLink,
  Calculator,
  Globe
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';

interface VIPLounge {
  name: string;
  airport: string;
  airportCode: string;
  country: string;
  region: string;
  terminal?: string;
  features: string[];
  accessMethods: string[];
  rating: number;
  pricePerVisit?: number;
  operatingHours: string;
}

const VIP_LOUNGES: VIPLounge[] = [
  // UNITED STATES
  { name: 'The Centurion Lounge', airport: 'JFK International', airportCode: 'JFK', country: 'United States', region: 'North America', terminal: 'Terminal 4', features: ['Premium dining', 'Cocktail bar', 'Spa treatments', 'Private workspaces'], accessMethods: ['Amex Platinum', 'Amex Centurion'], rating: 4.8, operatingHours: '6:00 AM - 10:00 PM' },
  { name: 'United Polaris Lounge', airport: 'Newark Liberty', airportCode: 'EWR', country: 'United States', region: 'North America', terminal: 'Terminal C', features: ['À la carte dining', 'Shower suites', 'Daybeds', 'Quiet zone'], accessMethods: ['United Polaris ticket', 'Star Alliance First'], rating: 4.7, operatingHours: '5:00 AM - 11:00 PM' },
  { name: 'The Centurion Lounge', airport: 'LAX', airportCode: 'LAX', country: 'United States', region: 'North America', terminal: 'Tom Bradley', features: ['Full dining', 'Premium bar', 'Spa', 'Business center'], accessMethods: ['Amex Platinum', 'Amex Centurion'], rating: 4.7, operatingHours: '6:00 AM - 11:00 PM' },
  { name: 'Capital One Lounge', airport: 'Dallas/Fort Worth', airportCode: 'DFW', country: 'United States', region: 'North America', terminal: 'Terminal D', features: ['Craft cocktails', 'Multi-sensory room', 'Grab-and-go market', 'Yoga room'], accessMethods: ['Capital One Venture X', 'Pay per visit $65'], rating: 4.6, pricePerVisit: 65, operatingHours: '5:30 AM - 10:30 PM' },
  { name: 'Delta Sky Club', airport: 'Atlanta Hartsfield-Jackson', airportCode: 'ATL', country: 'United States', region: 'North America', features: ['Full bar', 'Hot buffet', 'Shower facilities', 'Sky Deck'], accessMethods: ['Delta One', 'Sky Club membership', 'Amex Delta Reserve'], rating: 4.4, operatingHours: '5:00 AM - 11:00 PM' },
  { name: 'The Centurion Lounge', airport: 'Miami International', airportCode: 'MIA', country: 'United States', region: 'North America', terminal: 'Concourse D', features: ['Curated menu', 'Wine room', 'Spa treatments', 'Business center'], accessMethods: ['Amex Platinum', 'Amex Centurion'], rating: 4.6, operatingHours: '6:00 AM - 9:00 PM' },
  { name: 'The Centurion Lounge', airport: 'San Francisco', airportCode: 'SFO', country: 'United States', region: 'North America', terminal: 'Terminal 3', features: ['Chef menu', 'Cocktail program', 'Relaxation room'], accessMethods: ['Amex Platinum', 'Amex Centurion'], rating: 4.6, operatingHours: '5:00 AM - 10:00 PM' },

  // UNITED KINGDOM
  { name: 'Virgin Atlantic Clubhouse', airport: 'London Heathrow', airportCode: 'LHR', country: 'United Kingdom', region: 'Europe', terminal: 'Terminal 3', features: ['Restaurant', 'Cocktail bar', 'Spa & salon', 'Pool table', 'Jacuzzi'], accessMethods: ['Virgin Atlantic Upper Class', 'Flying Club Gold'], rating: 4.8, operatingHours: '5:30 AM - 10:00 PM' },
  { name: 'British Airways Galleries First', airport: 'London Heathrow', airportCode: 'LHR', country: 'United Kingdom', region: 'Europe', terminal: 'Terminal 5', features: ['Fine dining', 'Champagne bar', 'Shower suites', 'Work pods'], accessMethods: ['BA First Class', 'Oneworld Emerald'], rating: 4.7, operatingHours: '5:00 AM - 10:30 PM' },
  { name: 'The Concorde Room', airport: 'London Heathrow', airportCode: 'LHR', country: 'United Kingdom', region: 'Europe', terminal: 'Terminal 5', features: ['Private cabanas', 'Exclusive dining', 'Elemis spa', 'Concorde memorabilia'], accessMethods: ['BA First Class ticket', 'Invitation only'], rating: 4.9, operatingHours: '5:30 AM - 10:00 PM' },
  { name: 'No.1 Lounge', airport: 'London Gatwick', airportCode: 'LGW', country: 'United Kingdom', region: 'Europe', terminal: 'South Terminal', features: ['Hot meals', 'Bar', 'Runway views', 'Workstations'], accessMethods: ['Priority Pass', 'Pay per visit £40'], rating: 4.3, pricePerVisit: 50, operatingHours: '4:00 AM - 10:00 PM' },

  // UAE
  { name: 'Emirates First Class Lounge', airport: 'Dubai International', airportCode: 'DXB', country: 'United Arab Emirates', region: 'Middle East', terminal: 'Terminal 3', features: ['Fine dining', 'Moët & Chandon bar', 'Cigar lounge', 'Shower spa', 'Chauffeur service'], accessMethods: ['Emirates First Class'], rating: 4.9, operatingHours: '24 hours' },
  { name: 'Emirates Business Class Lounge', airport: 'Dubai International', airportCode: 'DXB', country: 'United Arab Emirates', region: 'Middle East', terminal: 'Terminal 3', features: ['Buffet dining', 'Full bar', 'Shower facilities', 'Kids area'], accessMethods: ['Emirates Business', 'Skywards Gold/Platinum'], rating: 4.6, operatingHours: '24 hours' },
  { name: 'Etihad First Class Lounge', airport: 'Abu Dhabi International', airportCode: 'AUH', country: 'United Arab Emirates', region: 'Middle East', terminal: 'Terminal 3', features: ['Six Senses spa', 'À la carte dining', 'Cigar lounge', 'Nap rooms'], accessMethods: ['Etihad First Class', 'The Residence'], rating: 4.8, operatingHours: '24 hours' },

  // QATAR
  { name: 'Qatar Airways Al Safwa First Lounge', airport: 'Hamad International', airportCode: 'DOH', country: 'Qatar', region: 'Middle East', features: ['Restaurant', 'Spa', 'Family zone', 'Business center', 'Prayer rooms', 'Nap suites'], accessMethods: ['Qatar Airways First Class'], rating: 4.9, operatingHours: '24 hours' },
  { name: 'Qatar Airways Al Mourjan Business Lounge', airport: 'Hamad International', airportCode: 'DOH', country: 'Qatar', region: 'Middle East', features: ['Dining hall', 'Quiet rooms', 'Spa', 'Gaming zone', 'Nursery'], accessMethods: ['Qatar Airways Business', 'Oneworld Sapphire+'], rating: 4.7, operatingHours: '24 hours' },

  // SINGAPORE
  { name: 'Singapore Airlines The Private Room', airport: 'Changi Airport', airportCode: 'SIN', country: 'Singapore', region: 'Asia', terminal: 'Terminal 3', features: ['À la carte dining', 'Private suites', 'Sommelier service', 'Exclusive entry'], accessMethods: ['Singapore Airlines Suites Class'], rating: 4.9, operatingHours: '24 hours' },
  { name: 'SilverKris First Class Lounge', airport: 'Changi Airport', airportCode: 'SIN', country: 'Singapore', region: 'Asia', terminal: 'Terminal 3', features: ['Fine dining', 'Champagne bar', 'Shower suites', 'Business center'], accessMethods: ['SQ First Class', 'Star Alliance Gold (First)'], rating: 4.7, operatingHours: '24 hours' },

  // HONG KONG
  { name: 'Cathay Pacific The Pier First Class', airport: 'Hong Kong International', airportCode: 'HKG', country: 'China', region: 'Asia', features: ['The Haven restaurant', 'The Retreat spa', 'Day suites', 'Shower rooms'], accessMethods: ['Cathay Pacific First Class', 'Oneworld Emerald'], rating: 4.8, operatingHours: '5:30 AM - 12:30 AM' },
  { name: 'Cathay Pacific The Wing First Class', airport: 'Hong Kong International', airportCode: 'HKG', country: 'China', region: 'Asia', features: ['The Long Bar', 'The Haven dining', 'Cabanas', 'Shower suites'], accessMethods: ['Cathay Pacific First Class', 'Oneworld Emerald'], rating: 4.7, operatingHours: '5:30 AM - 12:30 AM' },
  { name: 'Plaza Premium First', airport: 'Hong Kong International', airportCode: 'HKG', country: 'China', region: 'Asia', features: ['Hot meals', 'Shower suites', 'Private resting suites', 'Bar'], accessMethods: ['Priority Pass', 'Pay per visit $80'], rating: 4.4, pricePerVisit: 80, operatingHours: '24 hours' },

  // JAPAN
  { name: 'ANA Suite Lounge', airport: 'Tokyo Haneda', airportCode: 'HND', country: 'Japan', region: 'Asia', terminal: 'Terminal 3', features: ['Japanese fine dining', 'Sake bar', 'Shower rooms', 'Nap rooms'], accessMethods: ['ANA First Class', 'Star Alliance Gold (First)'], rating: 4.8, operatingHours: '5:00 AM - 11:30 PM' },
  { name: 'JAL First Class Lounge', airport: 'Tokyo Narita', airportCode: 'NRT', country: 'Japan', region: 'Asia', terminal: 'Terminal 2', features: ['Sushi bar', 'JAL Original cocktails', 'Shoe shine', 'Massage chairs'], accessMethods: ['JAL First Class', 'Oneworld Emerald'], rating: 4.7, operatingHours: '7:30 AM - 9:00 PM' },

  // SOUTH KOREA
  { name: 'Korean Air First Class Lounge', airport: 'Incheon International', airportCode: 'ICN', country: 'South Korea', region: 'Asia', terminal: 'Terminal 2', features: ['Korean cuisine', 'Nap rooms', 'Shower suites', 'Business center'], accessMethods: ['Korean Air First Class', 'SkyTeam Elite Plus'], rating: 4.6, operatingHours: '6:00 AM - 10:00 PM' },
  { name: 'Asiana First Class Lounge', airport: 'Incheon International', airportCode: 'ICN', country: 'South Korea', region: 'Asia', terminal: 'Terminal 1', features: ['Korean dining', 'Wine cellar', 'Shower rooms', 'Relaxation area'], accessMethods: ['Asiana First Class', 'Star Alliance Gold'], rating: 4.5, operatingHours: '6:30 AM - 10:00 PM' },

  // THAILAND
  { name: 'Thai Airways Royal First Class Lounge', airport: 'Suvarnabhumi', airportCode: 'BKK', country: 'Thailand', region: 'Asia', features: ['Thai fine dining', 'Spa treatments', 'Day rooms', 'Royal Service'], accessMethods: ['Thai First Class', 'Star Alliance Gold (First)'], rating: 4.6, operatingHours: '24 hours' },
  { name: 'Miracle First Class Lounge', airport: 'Suvarnabhumi', airportCode: 'BKK', country: 'Thailand', region: 'Asia', features: ['Hot meals', 'Spa massage', 'Shower rooms', 'Sleeping pods'], accessMethods: ['Priority Pass', 'DragonPass', 'Pay per visit $50'], rating: 4.3, pricePerVisit: 50, operatingHours: '24 hours' },

  // GERMANY
  { name: 'Lufthansa First Class Terminal', airport: 'Frankfurt', airportCode: 'FRA', country: 'Germany', region: 'Europe', features: ['Private terminal', 'Fine dining', 'Cigar lounge', 'Personal assistant', 'Porsche transfer to plane'], accessMethods: ['Lufthansa First Class', 'HON Circle'], rating: 4.9, operatingHours: '6:00 AM - 10:00 PM' },
  { name: 'Lufthansa Senator Lounge', airport: 'Munich', airportCode: 'MUC', country: 'Germany', region: 'Europe', terminal: 'Terminal 2', features: ['Hot buffet', 'Bar', 'Shower suites', 'Business center', 'Rest area'], accessMethods: ['Lufthansa Senator', 'Star Alliance Gold'], rating: 4.5, operatingHours: '5:30 AM - 10:00 PM' },

  // FRANCE
  { name: 'Air France La Première Lounge', airport: 'Paris Charles de Gaulle', airportCode: 'CDG', country: 'France', region: 'Europe', terminal: 'Terminal 2E', features: ['Alain Ducasse dining', 'Biologique Recherche spa', 'Sommelier', 'Personal assistant'], accessMethods: ['Air France La Première'], rating: 4.8, operatingHours: '6:00 AM - 11:00 PM' },
  { name: 'Star Alliance Lounge', airport: 'Paris Charles de Gaulle', airportCode: 'CDG', country: 'France', region: 'Europe', terminal: 'Terminal 1', features: ['Buffet dining', 'Bar', 'Rest area', 'Shower rooms'], accessMethods: ['Star Alliance Gold', 'Business Class ticket'], rating: 4.3, operatingHours: '5:30 AM - 11:00 PM' },

  // TURKEY
  { name: 'Turkish Airlines Lounge Istanbul', airport: 'Istanbul Airport', airportCode: 'IST', country: 'Turkey', region: 'Middle East', features: ['Turkish cuisine', 'Massage service', 'Golf simulator', 'Cinema', 'Library', 'Game room', 'Sleep pods'], accessMethods: ['Turkish Airlines Business', 'Star Alliance Gold', 'Miles&Smiles Elite'], rating: 4.8, operatingHours: '24 hours' },

  // AUSTRALIA
  { name: 'Qantas First Lounge', airport: 'Sydney Kingsford Smith', airportCode: 'SYD', country: 'Australia', region: 'Oceania', terminal: 'International', features: ['Neil Perry dining', 'Spa by Payot', 'Full bar', 'Shower suites'], accessMethods: ['Qantas First Class', 'Oneworld Emerald', 'Qantas Chairman Lounge invite'], rating: 4.7, operatingHours: '5:30 AM - 11:00 PM' },
  { name: 'Qantas Business Lounge', airport: 'Melbourne Tullamarine', airportCode: 'MEL', country: 'Australia', region: 'Oceania', terminal: 'International', features: ['Rockpool menu', 'Cocktail bar', 'Barista coffee', 'Shower suites'], accessMethods: ['Qantas Business', 'Oneworld Sapphire'], rating: 4.5, operatingHours: '5:00 AM - 11:00 PM' },

  // NEW ZEALAND
  { name: 'Air New Zealand Strata Lounge', airport: 'Auckland Airport', airportCode: 'AKL', country: 'New Zealand', region: 'Oceania', features: ['NZ cuisine', 'Cocktail bar', 'Shower suites', 'Work pods'], accessMethods: ['Air NZ Business Premier', 'Star Alliance Gold', 'Priority Pass'], rating: 4.4, operatingHours: '4:30 AM - Last departure' },

  // SOUTH AFRICA
  { name: 'SLOW Lounge', airport: 'O.R. Tambo International', airportCode: 'JNB', country: 'South Africa', region: 'Africa', terminal: 'International', features: ['South African cuisine', 'Full bar', 'Business center', 'Shower facilities'], accessMethods: ['Priority Pass', 'Bidvest membership', 'Pay per visit $35'], rating: 4.3, pricePerVisit: 35, operatingHours: '24 hours' },

  // KENYA
  { name: 'Pride Lounge', airport: 'Jomo Kenyatta International', airportCode: 'NBO', country: 'Kenya', region: 'Africa', terminal: 'Terminal 1A', features: ['African cuisine', 'Bar', 'WiFi', 'Shower rooms'], accessMethods: ['Priority Pass', 'Pay per visit $40'], rating: 4.1, pricePerVisit: 40, operatingHours: '24 hours' },

  // EGYPT
  { name: 'Star Alliance Gold Lounge', airport: 'Cairo International', airportCode: 'CAI', country: 'Egypt', region: 'Africa', terminal: 'Terminal 3', features: ['Egyptian cuisine', 'Full bar', 'Shower rooms', 'Business center'], accessMethods: ['Star Alliance Gold', 'Priority Pass'], rating: 4.2, operatingHours: '24 hours' },

  // BRAZIL
  { name: 'Star Alliance Lounge GRU', airport: 'São Paulo Guarulhos', airportCode: 'GRU', country: 'Brazil', region: 'South America', terminal: 'Terminal 3', features: ['Brazilian cuisine', 'Bar', 'Shower suites', 'Rest area'], accessMethods: ['Star Alliance Gold', 'Business Class ticket'], rating: 4.3, operatingHours: '24 hours' },
  { name: 'LATAM VIP Lounge', airport: 'São Paulo Guarulhos', airportCode: 'GRU', country: 'Brazil', region: 'South America', terminal: 'Terminal 3', features: ['Hot buffet', 'Bar', 'Shower rooms', 'Kids area'], accessMethods: ['LATAM Business', 'LATAM Pass Black'], rating: 4.2, operatingHours: '5:00 AM - 11:00 PM' },

  // ARGENTINA
  { name: 'Aerolíneas Argentinas Salón Cóndor', airport: 'Buenos Aires Ezeiza', airportCode: 'EZE', country: 'Argentina', region: 'South America', features: ['Argentine cuisine', 'Malbec wine bar', 'Shower rooms'], accessMethods: ['AA Business', 'SkyTeam Elite Plus', 'Priority Pass'], rating: 4.1, operatingHours: '24 hours' },

  // MEXICO
  { name: 'Centurion Lounge MEX', airport: 'Mexico City International', airportCode: 'MEX', country: 'Mexico', region: 'North America', terminal: 'Terminal 2', features: ['Mexican chef menu', 'Tequila bar', 'Spa', 'Business center'], accessMethods: ['Amex Platinum', 'Amex Centurion'], rating: 4.6, operatingHours: '6:00 AM - 10:00 PM' },

  // CANADA
  { name: 'Air Canada Maple Leaf Lounge', airport: 'Toronto Pearson', airportCode: 'YYZ', country: 'Canada', region: 'North America', terminal: 'Terminal 1', features: ['Hot buffet', 'Full bar', 'Shower suites', 'Business center'], accessMethods: ['Air Canada Business', 'Star Alliance Gold', 'Maple Leaf membership'], rating: 4.4, operatingHours: '5:00 AM - 10:00 PM' },
  { name: 'Plaza Premium Lounge', airport: 'Vancouver International', airportCode: 'YVR', country: 'Canada', region: 'North America', terminal: 'International', features: ['Asian & Western dining', 'Nap zone', 'Shower suites', 'Live kitchen'], accessMethods: ['Priority Pass', 'Pay per visit $55'], rating: 4.5, pricePerVisit: 55, operatingHours: '24 hours' },

  // INDIA
  { name: 'GVK Lounge', airport: 'Mumbai Chhatrapati Shivaji', airportCode: 'BOM', country: 'India', region: 'Asia', terminal: 'Terminal 2', features: ['Indian cuisine', 'Bar', 'Spa treatments', 'Nap rooms', 'Shower suites'], accessMethods: ['Priority Pass', 'Business Class ticket', 'Pay per visit $45'], rating: 4.4, pricePerVisit: 45, operatingHours: '24 hours' },
  { name: 'ITC Green Lounge', airport: 'Delhi Indira Gandhi', airportCode: 'DEL', country: 'India', region: 'Asia', terminal: 'Terminal 3', features: ['Indian & international cuisine', 'Bar', 'Business center', 'Shower rooms'], accessMethods: ['Priority Pass', 'Pay per visit $40'], rating: 4.3, pricePerVisit: 40, operatingHours: '24 hours' },

  // MALAYSIA
  { name: 'Malaysia Airlines Golden Lounge', airport: 'Kuala Lumpur International', airportCode: 'KUL', country: 'Malaysia', region: 'Asia', terminal: 'KLIA Main', features: ['Malaysian cuisine', 'Bar', 'Shower suites', 'Business center', 'Nap rooms'], accessMethods: ['Malaysia Airlines Business', 'Oneworld Sapphire+', 'Enrich Platinum'], rating: 4.5, operatingHours: '24 hours' },

  // INDONESIA
  { name: 'Garuda Indonesia First Class Lounge', airport: 'Jakarta Soekarno-Hatta', airportCode: 'CGK', country: 'Indonesia', region: 'Asia', terminal: 'Terminal 3', features: ['Indonesian cuisine', 'Spa massage', 'Shower suites', 'Private rooms'], accessMethods: ['Garuda First Class', 'SkyTeam Elite Plus'], rating: 4.4, operatingHours: '24 hours' },

  // NETHERLANDS
  { name: 'KLM Crown Lounge', airport: 'Amsterdam Schiphol', airportCode: 'AMS', country: 'Netherlands', region: 'Europe', features: ['Dutch cuisine', 'Heineken bar', 'Shower suites', 'Business pods', 'Panoramic views'], accessMethods: ['KLM Business', 'SkyTeam Elite Plus', 'Flying Blue Platinum'], rating: 4.5, operatingHours: '5:00 AM - 11:00 PM' },

  // SWITZERLAND
  { name: 'SWISS First Class Lounge', airport: 'Zürich Airport', airportCode: 'ZRH', country: 'Switzerland', region: 'Europe', features: ['Swiss fine dining', 'Swiss wines', 'Day rooms', 'Shower suites'], accessMethods: ['SWISS First Class', 'Lufthansa HON Circle'], rating: 4.7, operatingHours: '5:30 AM - 10:00 PM' },

  // FINLAND
  { name: 'Finnair Premium Lounge', airport: 'Helsinki-Vantaa', airportCode: 'HEL', country: 'Finland', region: 'Europe', features: ['Nordic cuisine', 'Sauna', 'Shower suites', 'Quiet zone'], accessMethods: ['Finnair Business', 'Oneworld Sapphire+', 'Finnair Plus Platinum'], rating: 4.5, operatingHours: '5:00 AM - 11:00 PM' },

  // SPAIN
  { name: 'Iberia Velázquez Premium Lounge', airport: 'Madrid Barajas', airportCode: 'MAD', country: 'Spain', region: 'Europe', terminal: 'Terminal 4S', features: ['Spanish tapas', 'Full bar', 'Shower suites', 'Relaxation zone'], accessMethods: ['Iberia Business Plus', 'Oneworld Emerald'], rating: 4.5, operatingHours: '5:30 AM - 11:00 PM' },

  // PORTUGAL
  { name: 'ANA Star Alliance Lounge', airport: 'Lisbon Humberto Delgado', airportCode: 'LIS', country: 'Portugal', region: 'Europe', terminal: 'Terminal 1', features: ['Portuguese cuisine', 'Port wine', 'Shower rooms', 'Business center'], accessMethods: ['Star Alliance Gold', 'TAP Business'], rating: 4.3, operatingHours: '6:00 AM - 10:00 PM' },

  // ITALY
  { name: 'Sala Montale VIP Lounge', airport: 'Milan Malpensa', airportCode: 'MXP', country: 'Italy', region: 'Europe', terminal: 'Terminal 1', features: ['Italian dining', 'Full bar', 'Shower suites', 'Rest zone'], accessMethods: ['Priority Pass', 'Pay per visit €40'], rating: 4.3, pricePerVisit: 45, operatingHours: '6:00 AM - 10:00 PM' },

  // SAUDI ARABIA
  { name: 'Al Fursan Golden Lounge', airport: 'King Abdulaziz International', airportCode: 'JED', country: 'Saudi Arabia', region: 'Middle East', features: ['Arabian cuisine', 'Prayer rooms', 'Business center', 'Shower suites'], accessMethods: ['Saudia First Class', 'SkyTeam Elite Plus'], rating: 4.4, operatingHours: '24 hours' },

  // OMAN
  { name: 'Oman Air First & Business Class Lounge', airport: 'Muscat International', airportCode: 'MCT', country: 'Oman', region: 'Middle East', features: ['Omani cuisine', 'Full bar', 'Spa', 'Nap rooms', 'Kids play area'], accessMethods: ['Oman Air First/Business', 'Priority Pass'], rating: 4.5, operatingHours: '24 hours' },

  // BAHRAIN
  { name: 'Gulf Air Falcon Gold Lounge', airport: 'Bahrain International', airportCode: 'BAH', country: 'Bahrain', region: 'Middle East', features: ['Arabic cuisine', 'Full bar', 'Spa treatments', 'Gaming area'], accessMethods: ['Gulf Air Business', 'FalconFlyer Gold'], rating: 4.3, operatingHours: '24 hours' },

  // MOROCCO
  { name: 'Pearl Lounge', airport: 'Marrakech Menara', airportCode: 'RAK', country: 'Morocco', region: 'Africa', features: ['Moroccan cuisine', 'Tea service', 'Shower rooms', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $35'], rating: 4.1, pricePerVisit: 35, operatingHours: '6:00 AM - Last flight' },

  // ETHIOPIA
  { name: 'Ethiopian Airlines Cloud 9 Lounge', airport: 'Addis Ababa Bole', airportCode: 'ADD', country: 'Ethiopia', region: 'Africa', features: ['Ethiopian cuisine', 'Full bar', 'Shower rooms', 'Business center'], accessMethods: ['Ethiopian Business', 'Star Alliance Gold', 'Priority Pass'], rating: 4.3, operatingHours: '24 hours' },

  // COLOMBIA
  { name: 'Avianca Sala VIP', airport: 'Bogotá El Dorado', airportCode: 'BOG', country: 'Colombia', region: 'South America', features: ['Colombian cuisine', 'Bar', 'Shower rooms', 'Rest area'], accessMethods: ['Avianca Business', 'Star Alliance Gold', 'LifeMiles Diamond'], rating: 4.2, operatingHours: '24 hours' },

  // CHILE
  { name: 'LATAM VIP Lounge SCL', airport: 'Santiago Arturo Merino Benítez', airportCode: 'SCL', country: 'Chile', region: 'South America', features: ['Chilean cuisine', 'Wine tasting', 'Shower suites', 'Business center'], accessMethods: ['LATAM Business', 'LATAM Pass Black', 'Oneworld Emerald'], rating: 4.3, operatingHours: '24 hours' },

  // PANAMA
  { name: 'Copa Club', airport: 'Panama City Tocumen', airportCode: 'PTY', country: 'Panama', region: 'South America', terminal: 'Terminal 2', features: ['Latin cuisine', 'Full bar', 'Shower rooms', 'Rest area'], accessMethods: ['Copa Business', 'Star Alliance Gold', 'ConnectMiles Platinum'], rating: 4.2, operatingHours: '24 hours' },

  // TAIWAN
  { name: 'EVA Air The Infinity', airport: 'Taipei Taoyuan', airportCode: 'TPE', country: 'Taiwan', region: 'Asia', terminal: 'Terminal 2', features: ['Taiwanese cuisine', 'Bar', 'Shower suites', 'Nap rooms', 'Business pods'], accessMethods: ['EVA Air Royal Laurel', 'Star Alliance Gold'], rating: 4.5, operatingHours: '24 hours' },

  // PHILIPPINES
  { name: 'PAGSS Premium Lounge', airport: 'Manila Ninoy Aquino', airportCode: 'MNL', country: 'Philippines', region: 'Asia', terminal: 'Terminal 3', features: ['Filipino cuisine', 'Bar', 'Massage chairs', 'Shower rooms'], accessMethods: ['Priority Pass', 'Pay per visit $35'], rating: 4.1, pricePerVisit: 35, operatingHours: '24 hours' },

  // VIETNAM
  { name: 'Vietnam Airlines Lotus Lounge', airport: 'Ho Chi Minh City Tan Son Nhat', airportCode: 'SGN', country: 'Vietnam', region: 'Asia', terminal: 'International', features: ['Vietnamese cuisine', 'Bar', 'Shower rooms', 'WiFi'], accessMethods: ['Vietnam Airlines Business', 'SkyTeam Elite Plus', 'Lotus Miles Titanium'], rating: 4.2, operatingHours: '24 hours' },

  // IRELAND
  { name: 'US Preclearance Lounge', airport: 'Dublin Airport', airportCode: 'DUB', country: 'Ireland', region: 'Europe', terminal: 'Terminal 2', features: ['Irish cuisine', 'Bar', 'Business center', 'Shower rooms'], accessMethods: ['Priority Pass', 'Aer Lingus Business', 'Pay per visit €35'], rating: 4.3, pricePerVisit: 40, operatingHours: '5:00 AM - 10:00 PM' },

  // GREECE
  { name: 'Goldair Handling CIP Lounge', airport: 'Athens Eleftherios Venizelos', airportCode: 'ATH', country: 'Greece', region: 'Europe', features: ['Greek cuisine', 'Full bar', 'Shower rooms', 'Business center'], accessMethods: ['Priority Pass', 'Pay per visit €40'], rating: 4.2, pricePerVisit: 45, operatingHours: '24 hours' },

  // NORWAY
  { name: 'OSL Lounge', airport: 'Oslo Gardermoen', airportCode: 'OSL', country: 'Norway', region: 'Europe', features: ['Scandinavian cuisine', 'Full bar', 'Shower rooms', 'Quiet zone'], accessMethods: ['Priority Pass', 'SAS Business', 'Star Alliance Gold'], rating: 4.3, operatingHours: '5:00 AM - 10:00 PM' },

  // DENMARK
  { name: 'SAS Lounge', airport: 'Copenhagen Kastrup', airportCode: 'CPH', country: 'Denmark', region: 'Europe', features: ['Danish cuisine', 'Bar', 'Shower rooms', 'Work pods', 'Kids area'], accessMethods: ['SAS Business', 'Star Alliance Gold', 'EuroBonus Gold'], rating: 4.4, operatingHours: '5:00 AM - 10:00 PM' },

  // CZECH REPUBLIC
  { name: 'Erste Premier Lounge', airport: 'Prague Václav Havel', airportCode: 'PRG', country: 'Czech Republic', region: 'Europe', features: ['Czech cuisine', 'Czech beer', 'Shower rooms', 'Business center'], accessMethods: ['Priority Pass', 'Pay per visit €35'], rating: 4.2, pricePerVisit: 40, operatingHours: '5:00 AM - 10:00 PM' },

  // POLAND
  { name: 'Polonez Lounge', airport: 'Warsaw Chopin', airportCode: 'WAW', country: 'Poland', region: 'Europe', features: ['Polish cuisine', 'Full bar', 'Shower rooms', 'Rest area'], accessMethods: ['LOT Business', 'Star Alliance Gold', 'Priority Pass'], rating: 4.2, operatingHours: '24 hours' },

  // RUSSIA
  { name: 'Aeroflot Jazz Lounge', airport: 'Moscow Sheremetyevo', airportCode: 'SVO', country: 'Russia', region: 'Europe', terminal: 'Terminal D', features: ['Russian cuisine', 'Bar', 'Shower rooms', 'Business center'], accessMethods: ['Aeroflot Business', 'SkyTeam Elite Plus', 'Priority Pass'], rating: 4.3, operatingHours: '24 hours' },

  // ISRAEL
  { name: 'Dan Lounge', airport: 'Tel Aviv Ben Gurion', airportCode: 'TLV', country: 'Israel', region: 'Middle East', terminal: 'Terminal 3', features: ['Israeli cuisine', 'Full bar', 'Shower rooms', 'Business center'], accessMethods: ['Priority Pass', 'El Al Business', 'Pay per visit $45'], rating: 4.4, pricePerVisit: 45, operatingHours: '24 hours' },

  // JORDAN
  { name: 'Royal Jordanian Crown Lounge', airport: 'Amman Queen Alia', airportCode: 'AMM', country: 'Jordan', region: 'Middle East', features: ['Arabic cuisine', 'Full bar', 'Shower rooms', 'Prayer rooms'], accessMethods: ['Royal Jordanian Business', 'Oneworld Emerald', 'Priority Pass'], rating: 4.2, operatingHours: '24 hours' },

  // MALDIVES
  { name: 'Moonimaa Lounge', airport: 'Velana International', airportCode: 'MLE', country: 'Maldives', region: 'Asia', features: ['Maldivian cuisine', 'Cocktail bar', 'Shower rooms', 'Terrace'], accessMethods: ['Priority Pass', 'Pay per visit $40'], rating: 4.1, pricePerVisit: 40, operatingHours: '24 hours' },

  // SRI LANKA
  { name: 'SriLankan Airlines Serenity Lounge', airport: 'Bandaranaike International', airportCode: 'CMB', country: 'Sri Lanka', region: 'Asia', features: ['Sri Lankan cuisine', 'Full bar', 'Shower rooms', 'Nap area'], accessMethods: ['SriLankan Business', 'Oneworld Sapphire+', 'Priority Pass'], rating: 4.2, operatingHours: '24 hours' },

  // NEPAL
  { name: 'TIA VIP Lounge', airport: 'Tribhuvan International', airportCode: 'KTM', country: 'Nepal', region: 'Asia', features: ['Nepali cuisine', 'Bar', 'WiFi', 'Mountain views'], accessMethods: ['Priority Pass', 'Pay per visit $25'], rating: 3.8, pricePerVisit: 25, operatingHours: '6:00 AM - 10:00 PM' },

  // GEORGIA
  { name: 'Business Lounge TBS', airport: 'Tbilisi International', airportCode: 'TBS', country: 'Georgia', region: 'Europe', features: ['Georgian cuisine', 'Wine bar', 'Shower rooms', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $30'], rating: 4.2, pricePerVisit: 30, operatingHours: '24 hours' },

  // COSTA RICA
  { name: 'VIP Lounge SJO', airport: 'Juan Santamaría International', airportCode: 'SJO', country: 'Costa Rica', region: 'North America', features: ['Costa Rican cuisine', 'Full bar', 'Shower rooms', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $40'], rating: 4.0, pricePerVisit: 40, operatingHours: '5:00 AM - 10:00 PM' },

  // PERU
  { name: 'Sumaq VIP Lounge', airport: 'Lima Jorge Chávez', airportCode: 'LIM', country: 'Peru', region: 'South America', features: ['Peruvian cuisine', 'Pisco bar', 'Shower rooms', 'Business center'], accessMethods: ['Priority Pass', 'Pay per visit $45'], rating: 4.2, pricePerVisit: 45, operatingHours: '24 hours' },

  // NIGERIA
  { name: 'GAT VIP Lounge', airport: 'Lagos Murtala Muhammed', airportCode: 'LOS', country: 'Nigeria', region: 'Africa', terminal: 'International', features: ['Nigerian cuisine', 'Full bar', 'Business center', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $40'], rating: 3.9, pricePerVisit: 40, operatingHours: '24 hours' },

  // GHANA
  { name: 'Aviance Ghana VIP Lounge', airport: 'Kotoka International', airportCode: 'ACC', country: 'Ghana', region: 'Africa', terminal: 'Terminal 3', features: ['Ghanaian cuisine', 'Bar', 'Shower rooms', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $35'], rating: 4.0, pricePerVisit: 35, operatingHours: '24 hours' },

  // TANZANIA
  { name: 'CIP Lounge', airport: 'Julius Nyerere International', airportCode: 'DAR', country: 'Tanzania', region: 'Africa', features: ['East African cuisine', 'Bar', 'WiFi', 'Rest area'], accessMethods: ['Priority Pass', 'Pay per visit $30'], rating: 3.8, pricePerVisit: 30, operatingHours: '24 hours' },

  // URUGUAY
  { name: 'VIP Lounge Carrasco', airport: 'Montevideo Carrasco', airportCode: 'MVD', country: 'Uruguay', region: 'South America', features: ['Uruguayan cuisine', 'Wine bar', 'Shower rooms', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $35'], rating: 4.1, pricePerVisit: 35, operatingHours: '24 hours' },

  // ECUADOR
  { name: 'VIP Lounge UIO', airport: 'Quito Mariscal Sucre', airportCode: 'UIO', country: 'Ecuador', region: 'South America', features: ['Ecuadorian cuisine', 'Bar', 'Shower rooms', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $35'], rating: 4.0, pricePerVisit: 35, operatingHours: '24 hours' },

  // MONGOLIA
  { name: 'Best VIP Lounge', airport: 'Chinggis Khaan International', airportCode: 'UBN', country: 'Mongolia', region: 'Asia', features: ['Mongolian cuisine', 'Bar', 'Rest area', 'WiFi'], accessMethods: ['Priority Pass', 'Pay per visit $25'], rating: 3.7, pricePerVisit: 25, operatingHours: '6:00 AM - 10:00 PM' },

  // ICELAND
  { name: 'Saga Lounge', airport: 'Keflavík International', airportCode: 'KEF', country: 'Iceland', region: 'Europe', features: ['Icelandic cuisine', 'Bar', 'Shower rooms', 'Northern lights view room'], accessMethods: ['Icelandair Saga Class', 'Priority Pass', 'Pay per visit $50'], rating: 4.4, pricePerVisit: 50, operatingHours: '4:00 AM - Last departure' },

  // FIJI
  { name: 'Fiji Airways Tabua Club', airport: 'Nadi International', airportCode: 'NAN', country: 'Fiji', region: 'Oceania', features: ['Fijian cuisine', 'Bar', 'Shower rooms', 'Garden views'], accessMethods: ['Fiji Airways Business', 'Priority Pass', 'Pay per visit $35'], rating: 4.0, pricePerVisit: 35, operatingHours: '24 hours' },

  // MAURITIUS
  { name: 'Amédée Maingard Lounge', airport: 'Sir Seewoosagur Ramgoolam', airportCode: 'MRU', country: 'Mauritius', region: 'Africa', features: ['Mauritian cuisine', 'Bar', 'Shower rooms', 'WiFi'], accessMethods: ['Air Mauritius Business', 'Priority Pass'], rating: 4.1, operatingHours: '24 hours' },

  // JAMAICA
  { name: 'Club Kingston', airport: 'Norman Manley International', airportCode: 'KIN', country: 'Jamaica', region: 'North America', features: ['Jamaican cuisine', 'Cocktail bar', 'Shower rooms', 'Business center'], accessMethods: ['Priority Pass', 'Pay per visit $45'], rating: 4.2, pricePerVisit: 45, operatingHours: '24 hours' },

  // PHILIPPINES (Manila addition - Clark)
  { name: 'Aerotel Transit Hotel & Lounge', airport: 'Clark International', airportCode: 'CRK', country: 'Philippines', region: 'Asia', features: ['Filipino cuisine', 'Nap rooms', 'Shower suites', 'WiFi'], accessMethods: ['Pay per visit $30'], rating: 3.9, pricePerVisit: 30, operatingHours: '24 hours' },
];

const LOUNGE_REGIONS = ['All', 'North America', 'Europe', 'Asia', 'Middle East', 'Oceania', 'Africa', 'South America'];

interface AirportLoungeAccessProps {
  currentLocation: LocationData | null;
}

interface LoungeNetwork {
  id: string;
  name: string;
  lounges: number;
  coverage: string;
  standardPrice: number;
  premiumPrice?: number;
  description: string;
  features: string[];
  type: 'network' | 'airline' | 'credit-card';
  rating: number;
}

interface PayPerVisitOption {
  name: string;
  price: string;
  description: string;
  icon: any;
  link: string;
}

const AirportLoungeAccess: React.FC<AirportLoungeAccessProps> = ({ currentLocation }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [flightsPerYear, setFlightsPerYear] = useState<number>(8);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Major lounge networks data
  const loungeNetworks: LoungeNetwork[] = [
    {
      id: 'priority-pass',
      name: 'Priority Pass',
      lounges: 1300,
      coverage: 'Global - Largest Network',
      standardPrice: 99,
      premiumPrice: 469,
      description: 'Access to 1,300+ lounges worldwide with flexible membership options',
      features: ['1,300+ lounges', '100+ airport restaurants', 'Global coverage', 'Spa services at select locations'],
      type: 'network',
      rating: 4.5
    },
    {
      id: 'amex-centurion',
      name: 'American Express Centurion',
      lounges: 40,
      coverage: 'Premium - Highest Quality',
      standardPrice: 695,
      description: 'Luxury lounges with premium dining, spas, and exclusive amenities',
      features: ['Premium dining', 'Spa services', 'Private workspaces', 'Complimentary guests'],
      type: 'credit-card',
      rating: 4.9
    },
    {
      id: 'delta-sky',
      name: 'Delta Sky Club',
      lounges: 50,
      coverage: 'US Focus + International',
      standardPrice: 650,
      description: 'Premium lounges for Delta passengers with excellent amenities',
      features: ['50+ locations', 'Premium food & drinks', 'Shower facilities', 'Business centers'],
      type: 'airline',
      rating: 4.4
    },
    {
      id: 'united-club',
      name: 'United Club',
      lounges: 45,
      coverage: 'Global Network',
      standardPrice: 525,
      description: 'Access to United and Star Alliance partner lounges worldwide',
      features: ['45+ lounges', 'International partners', 'Complimentary snacks', 'Premium beverages'],
      type: 'airline',
      rating: 4.3
    },
    {
      id: 'lounge-key',
      name: 'LoungeKey',
      lounges: 1100,
      coverage: 'Global Network',
      standardPrice: 32,
      description: 'Pay-per-use access to over 1,100 airport lounges worldwide',
      features: ['1,100+ lounges', 'No membership required', 'Instant booking', 'Mobile app access'],
      type: 'network',
      rating: 4.2
    }
  ];

  // Pay-per-visit options
  const payPerVisitOptions: PayPerVisitOption[] = [
    {
      name: 'LoungeBuddy',
      price: '$25-60',
      description: 'App-based booking with instant confirmation',
      icon: Plane,
      link: 'https://www.loungebuddy.com'
    },
    {
      name: 'DragonPass',
      price: '$32/visit',
      description: 'Access to 1,000+ lounges with no membership',
      icon: Globe,
      link: 'https://www.dragonpass.com'
    },
    {
      name: 'LoungeKey',
      price: '$32/visit',
      description: 'Visa/Mastercard lounge access program',
      icon: CreditCard,
      link: 'https://www.loungekey.com'
    }
  ];

  // Premium credit cards with lounge access
  const premiumCards = [
    {
      name: 'Amex Platinum',
      fee: 695,
      access: 'Centurion + Priority Pass + Delta',
      value: '1,400+ lounges',
      link: 'https://www.americanexpress.com/us/credit-cards/card/platinum/'
    },
    {
      name: 'Chase Sapphire Reserve',
      fee: 550,
      access: 'Priority Pass + LoungeKey',
      value: '1,300+ lounges',
      link: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve'
    },
    {
      name: 'Capital One Venture X',
      fee: 395,
      access: 'Priority Pass + Capital One Lounges',
      value: '1,300+ lounges',
      link: 'https://www.capitalone.com/credit-cards/venture-x/'
    }
  ];

  // Calculate ROI and recommendations
  const calculateRecommendation = useMemo(() => {
    const avgPayPerVisit = 45;
    const estimatedVisits = flightsPerYear * 1.5; // Account for connections
    const totalPayPerViseCost = estimatedVisits * avgPayPerVisit;

    let recommendation = {
      type: '',
      name: '',
      cost: 0,
      value: 0,
      savings: 0,
      roi: 0,
      reason: ''
    };

    if (estimatedVisits >= 10) {
      recommendation = {
        type: 'Premium Card',
        name: 'Amex Platinum Card',
        cost: 695,
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - 695,
        roi: ((estimatedVisits * avgPayPerVisit) - 695) / 695 * 100,
        reason: `With ${Math.round(estimatedVisits)} lounge visits per year, a premium card offers the best value`
      };
    } else if (estimatedVisits >= 6) {
      recommendation = {
        type: 'Annual Membership',
        name: 'Priority Pass Prestige',
        cost: 469,
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - 469,
        roi: ((estimatedVisits * avgPayPerVisit) - 469) / 469 * 100,
        reason: `Perfect for ${Math.round(estimatedVisits)} visits - unlimited access with great coverage`
      };
    } else if (estimatedVisits >= 3) {
      recommendation = {
        type: 'Hybrid',
        name: 'Priority Pass Standard',
        cost: 99 + (estimatedVisits * 32),
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - (99 + (estimatedVisits * 32)),
        roi: ((estimatedVisits * avgPayPerVisit) - (99 + (estimatedVisits * 32))) / (99 + (estimatedVisits * 32)) * 100,
        reason: `Lower annual fee with per-visit charges for ${Math.round(estimatedVisits)} visits`
      };
    } else {
      recommendation = {
        type: 'Pay-Per-Use',
        name: 'LoungeBuddy / DragonPass',
        cost: estimatedVisits * 35,
        value: estimatedVisits * avgPayPerVisit,
        savings: (estimatedVisits * avgPayPerVisit) - (estimatedVisits * 35),
        roi: ((estimatedVisits * avgPayPerVisit) - (estimatedVisits * 35)) / (estimatedVisits * 35) * 100,
        reason: `Most cost-effective for ${Math.round(estimatedVisits)} occasional visits`
      };
    }

    return recommendation;
  }, [flightsPerYear]);

  const handleFindNearbyLounges = () => {
    const searchQuery = currentLocation 
      ? `airport lounges near ${currentLocation.city}, ${currentLocation.country}`
      : 'airport lounges near me';
    
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, '_blank');
    
    toast({
      title: "Finding Nearby Lounges",
      description: `Searching for airport lounges in your area...`,
    });
  };

  const handlePurchase = (network: string, type: string) => {
    toast({
      title: "Opening Purchase Page",
      description: `Redirecting to ${network} ${type}...`,
    });
    // In production, these would be affiliate links
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-purple-900">
                  ✨ Airport Lounge Access
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Transform layovers into productive, comfortable experiences
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleFindNearbyLounges}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Find Nearby Lounges
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Wifi className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Free WiFi</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Utensils className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Premium Food</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Briefcase className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Workspaces</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">VIP Service</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendation Calculator */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Calculator className="w-5 h-5" />
            Your Personalized Recommendation
          </CardTitle>
          <CardDescription>
            Based on your travel patterns, we'll find the best option for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              How many flights do you take per year?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={flightsPerYear}
                onChange={(e) => setFlightsPerYear(parseInt(e.target.value))}
                className="flex-1"
              />
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {flightsPerYear} flights
              </Badge>
            </div>
          </div>

          <Alert className="bg-white border-green-300">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900 font-bold">
              💡 Best Option: {calculateRecommendation.name}
            </AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <p className="text-gray-700">{calculateRecommendation.reason}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Annual Cost</p>
                  <p className="text-lg font-bold text-green-700">${calculateRecommendation.cost}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Estimated Value</p>
                  <p className="text-lg font-bold text-green-700">${Math.round(calculateRecommendation.value)}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Annual Savings</p>
                  <p className="text-lg font-bold text-green-700">${Math.round(calculateRecommendation.savings)}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">ROI</p>
                  <p className="text-lg font-bold text-green-700">{Math.round(calculateRecommendation.roi)}%</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Main Options Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lounges">VIP Lounges</TabsTrigger>
          <TabsTrigger value="overview">Networks</TabsTrigger>
          <TabsTrigger value="single">Single Visit</TabsTrigger>
          <TabsTrigger value="cards">Credit Cards</TabsTrigger>
        </TabsList>

        {/* VIP Lounges Directory */}
        <TabsContent value="lounges" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search lounges by name, airport, country..." value={loungeSearch} onChange={e => setLoungeSearch(e.target.value)} className="max-w-md" />
            </div>
            <div className="flex flex-wrap gap-2">
              {LOUNGE_REGIONS.map(r => (
                <Badge key={r} variant={loungeRegion === r ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setLoungeRegion(r)}>
                  {r} {r === 'All' ? `(${VIP_LOUNGES.length})` : `(${VIP_LOUNGES.filter(l => l.region === r).length})`}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIP_LOUNGES.filter(l => {
              if (loungeRegion !== 'All' && l.region !== loungeRegion) return false;
              if (loungeSearch) {
                const q = loungeSearch.toLowerCase();
                return l.name.toLowerCase().includes(q) || l.airport.toLowerCase().includes(q) || l.country.toLowerCase().includes(q) || l.airportCode.toLowerCase().includes(q);
              }
              return true;
            }).map((lounge, idx) => (
              <Card key={idx} className={`${lounge.rating >= 4.7 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : 'border-border'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {lounge.name}
                        {lounge.rating >= 4.7 && <Badge className="bg-yellow-400 text-yellow-900 text-xs"><Star className="w-3 h-3 mr-0.5" />Top</Badge>}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        ✈️ {lounge.airport} ({lounge.airportCode}) {lounge.terminal && `• ${lounge.terminal}`}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">📍 {lounge.country} • ⏰ {lounge.operatingHours}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-semibold">{lounge.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {lounge.features.slice(0, 4).map((f, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {lounge.accessMethods.map((m, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs"><CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" /><span>{m}</span></div>
                    ))}
                  </div>
                  {lounge.pricePerVisit && (
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <p className="text-lg font-bold text-blue-600">${lounge.pricePerVisit}</p>
                      <p className="text-xs text-gray-600">per visit</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Networks & Annual Memberships */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loungeNetworks.map((network) => (
              <Card key={network.id} className={`${
                network.rating >= 4.5 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' : 'border-border'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {network.name}
                        {network.rating >= 4.5 && (
                          <Badge className="bg-yellow-400 text-yellow-900">
                            <Star className="w-3 h-3 mr-1" />
                            Top Rated
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {network.lounges}+ lounges • {network.coverage}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(network.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{network.description}</p>
                  
                  <div className="space-y-2">
                    {network.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Standard Membership</p>
                        <p className="text-2xl font-bold text-purple-600">${network.standardPrice}/year</p>
                      </div>
                      <Button 
                        onClick={() => handlePurchase(network.name, 'Standard')}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Purchase
                      </Button>
                    </div>
                    
                    {network.premiumPrice && (
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                        <div>
                          <p className="text-xs text-gray-600">Premium (Unlimited)</p>
                          <p className="text-xl font-bold text-purple-600">${network.premiumPrice}/year</p>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(network.name, 'Premium')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Get Premium
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pay-Per-Visit Options */}
        <TabsContent value="single" className="space-y-4">
          <Alert className="bg-blue-50 border-blue-300">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Single Visit Passes</AlertTitle>
            <AlertDescription className="text-blue-700">
              Perfect for occasional travelers - no membership required, instant booking
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {payPerVisitOptions.map((option, idx) => {
              const Icon = option.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{option.price}</p>
                      <p className="text-sm text-gray-600 mt-1">per visit</p>
                    </div>
                    <Button 
                      onClick={() => window.open(option.link, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Airport Lounge Direct Purchase Info */}
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="text-orange-900">Direct Lounge Purchase</CardTitle>
              <CardDescription>Walk up or pre-book directly at airport lounges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-orange-900 mb-2">Walk-Up Purchase</p>
                  <p className="text-2xl font-bold text-orange-600">$50-75</p>
                  <p className="text-sm text-gray-600 mt-1">Subject to availability</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-orange-900 mb-2">Pre-Book Online</p>
                  <p className="text-2xl font-bold text-orange-600">$35-60</p>
                  <p className="text-sm text-gray-600 mt-1">Save 20-30% booking ahead</p>
                </div>
              </div>
              <Alert className="bg-white border-orange-300">
                <Shield className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  💡 Pro Tip: Pre-booking guarantees access during peak travel times and saves money!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium Credit Cards */}
        <TabsContent value="cards" className="space-y-4">
          <Alert className="bg-gradient-to-r from-amber-50 to-yellow-50 border-yellow-300">
            <CreditCard className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900 font-bold">Premium Credit Cards</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Best value for frequent travelers - includes lounge access PLUS travel rewards, insurance, and more
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumCards.map((card, idx) => (
              <Card key={idx} className="border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge className="w-fit bg-amber-100 text-amber-800 mb-2">
                    <Star className="w-3 h-3 mr-1" />
                    Premium Card
                  </Badge>
                  <CardTitle className="text-lg">{card.name}</CardTitle>
                  <CardDescription>{card.access}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600">Annual Fee</p>
                    <p className="text-3xl font-bold text-amber-700">${card.fee}</p>
                    <p className="text-xs text-gray-500 mt-2">Lounge Access Value: ${card.fee * 2}+</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{card.value} lounge access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Travel rewards & benefits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Travel insurance included</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Guest access privileges</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.open(card.link, '_blank')}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ROI Comparison */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-green-900">💰 Value Comparison</CardTitle>
              <CardDescription>Why premium cards offer the best overall value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-green-900 mb-2">Lounge Access Only</p>
                  <p className="text-xs text-gray-600 mb-3">Priority Pass Prestige</p>
                  <p className="text-2xl font-bold text-green-600">$469/year</p>
                  <ul className="text-xs text-gray-600 mt-3 space-y-1">
                    <li>✓ Unlimited lounge visits</li>
                    <li>✓ 1,300+ lounges</li>
                  </ul>
                </div>
                <div className="bg-white/60 rounded-lg p-4 border-2 border-amber-400">
                  <p className="font-semibold text-amber-900 mb-2">Premium Card</p>
                  <p className="text-xs text-gray-600 mb-3">Amex Platinum</p>
                  <p className="text-2xl font-bold text-amber-600">$695/year</p>
                  <Badge className="bg-amber-100 text-amber-800 text-xs mt-2">Best Value</Badge>
                  <ul className="text-xs text-gray-600 mt-3 space-y-1">
                    <li>✓ 1,400+ lounges (3 networks)</li>
                    <li>✓ Travel rewards points</li>
                    <li>✓ $200 travel credit</li>
                    <li>✓ Travel insurance</li>
                    <li>✓ Hotel status benefits</li>
                  </ul>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-semibold text-green-900 mb-2">Pay Per Visit</p>
                  <p className="text-xs text-gray-600 mb-3">10 visits/year</p>
                  <p className="text-2xl font-bold text-green-600">$450/year</p>
                  <ul className="text-xs text-gray-600 mt-3 space-y-1">
                    <li>✓ No commitment</li>
                    <li>✓ Flexible usage</li>
                    <li>⚠️ No extra benefits</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-purple-900">
              ✈️ Ready to Upgrade Your Travel Experience?
            </h3>
            <p className="text-purple-700 max-w-2xl mx-auto">
              Join thousands of smart travelers who save money and time with airport lounge access. 
              No more crowded gates, expensive airport food, or uncomfortable waiting areas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                size="lg"
                onClick={handleFindNearbyLounges}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Lounges Near You
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setSelectedTab('overview')}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Your Savings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirportLoungeAccess;
