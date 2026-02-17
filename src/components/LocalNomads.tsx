import React, { useState, useMemo } from 'react';
import { Users, MapPin, Filter, ExternalLink, MessageCircle, Send, Facebook, Search, Briefcase, Dumbbell, Palette, Globe, Code, Calendar, TrendingUp, Heart, Music, Camera, Coffee, Book, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LocationData } from '@/types/country';

interface LocalNomadsProps {
  currentLocation: LocationData | null;
}

interface CommunityGroup {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'facebook' | 'whatsapp' | 'meetup' | 'linkedin';
  location: string;
  country: string;
  members: number;
  category: string;
  description: string;
  link: string;
  verified: boolean;
}

// Comprehensive global community groups across 100+ cities
const communityGroups: CommunityGroup[] = [
  // Asia - Bangkok, Thailand
  { id: 'bkk1', name: 'Bangkok Business Network', platform: 'linkedin', location: 'Bangkok', country: 'Thailand', members: 12500, category: 'Business', description: 'Professional networking for entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bkk2', name: 'Bangkok Runners Club', platform: 'facebook', location: 'Bangkok', country: 'Thailand', members: 8900, category: 'Sports', description: 'Weekly running meetups across the city', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'bkk3', name: 'Bangkok Photography Society', platform: 'meetup', location: 'Bangkok', country: 'Thailand', members: 3400, category: 'Hobbies', description: 'Photography walks and workshops', link: 'https://meetup.com/example', verified: true },
  { id: 'bkk4', name: 'Bangkok Tech Meetup', platform: 'discord', location: 'Bangkok', country: 'Thailand', members: 5600, category: 'Tech', description: 'Developers and tech enthusiasts', link: 'https://discord.gg/example', verified: true },
  { id: 'bkk5', name: 'Bangkok Yoga Community', platform: 'whatsapp', location: 'Bangkok', country: 'Thailand', members: 2100, category: 'Wellness', description: 'Daily yoga sessions and meditation', link: 'https://wa.me/example', verified: true },
  
  // Singapore
  { id: 'sin1', name: 'Singapore Startup Hub', platform: 'linkedin', location: 'Singapore', country: 'Singapore', members: 18000, category: 'Business', description: 'Connect with startup founders', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'sin2', name: 'Singapore Cycling Club', platform: 'telegram', location: 'Singapore', country: 'Singapore', members: 6700, category: 'Sports', description: 'Weekend cycling adventures', link: 'https://t.me/example', verified: true },
  { id: 'sin3', name: 'Singapore Book Club', platform: 'meetup', location: 'Singapore', country: 'Singapore', members: 2800, category: 'Hobbies', description: 'Monthly book discussions', link: 'https://meetup.com/example', verified: true },
  { id: 'sin4', name: 'SG Fintech Community', platform: 'discord', location: 'Singapore', country: 'Singapore', members: 9200, category: 'Tech', description: 'Financial technology professionals', link: 'https://discord.gg/example', verified: true },

  // Tokyo, Japan
  { id: 'tyo1', name: 'Tokyo Expat Network', platform: 'facebook', location: 'Tokyo', country: 'Japan', members: 45000, category: 'Social', description: 'Largest expat community in Tokyo', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'tyo2', name: 'Tokyo Football League', platform: 'whatsapp', location: 'Tokyo', country: 'Japan', members: 4200, category: 'Sports', description: 'Weekly football matches', link: 'https://wa.me/example', verified: true },
  { id: 'tyo3', name: 'Tokyo Art Collective', platform: 'meetup', location: 'Tokyo', country: 'Japan', members: 3100, category: 'Hobbies', description: 'Art exhibitions and creative meetups', link: 'https://meetup.com/example', verified: true },
  { id: 'tyo4', name: 'Tokyo Blockchain Devs', platform: 'telegram', location: 'Tokyo', country: 'Japan', members: 7800, category: 'Tech', description: 'Web3 and blockchain developers', link: 'https://t.me/example', verified: true },

  // Seoul, South Korea
  { id: 'sel1', name: 'Seoul Business Leaders', platform: 'linkedin', location: 'Seoul', country: 'South Korea', members: 14500, category: 'Business', description: 'C-level networking events', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'sel2', name: 'Seoul Tennis Club', platform: 'facebook', location: 'Seoul', country: 'South Korea', members: 3800, category: 'Sports', description: 'Tennis enthusiasts welcome', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'sel3', name: 'Seoul Gaming Community', platform: 'discord', location: 'Seoul', country: 'South Korea', members: 12000, category: 'Hobbies', description: 'Gamers and esports fans', link: 'https://discord.gg/example', verified: true },
  { id: 'sel4', name: 'Seoul K-pop Dance', platform: 'whatsapp', location: 'Seoul', country: 'South Korea', members: 5600, category: 'Arts', description: 'Learn K-pop choreography', link: 'https://wa.me/example', verified: true },

  // Hong Kong
  { id: 'hkg1', name: 'HK Entrepreneurs Circle', platform: 'linkedin', location: 'Hong Kong', country: 'Hong Kong', members: 16700, category: 'Business', description: 'Startup founders and investors', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'hkg2', name: 'Hong Kong Hiking Group', platform: 'meetup', location: 'Hong Kong', country: 'Hong Kong', members: 8900, category: 'Sports', description: 'Explore HK hiking trails', link: 'https://meetup.com/example', verified: true },
  { id: 'hkg3', name: 'HK Photography Club', platform: 'facebook', location: 'Hong Kong', country: 'Hong Kong', members: 4200, category: 'Hobbies', description: 'Urban photography meetups', link: 'https://facebook.com/groups/example', verified: true },

  // Dubai, UAE
  { id: 'dxb1', name: 'Dubai Business Hub', platform: 'linkedin', location: 'Dubai', country: 'UAE', members: 22000, category: 'Business', description: 'Premium business networking', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'dxb2', name: 'Dubai Fitness Community', platform: 'whatsapp', location: 'Dubai', country: 'UAE', members: 7800, category: 'Sports', description: 'CrossFit and gym partners', link: 'https://wa.me/example', verified: true },
  { id: 'dxb3', name: 'Dubai Luxury Car Club', platform: 'telegram', location: 'Dubai', country: 'UAE', members: 5200, category: 'Hobbies', description: 'Supercar meetups and drives', link: 'https://t.me/example', verified: true },
  { id: 'dxb4', name: 'Dubai Tech Summit', platform: 'meetup', location: 'Dubai', country: 'UAE', members: 9800, category: 'Tech', description: 'Tech conferences and workshops', link: 'https://meetup.com/example', verified: true },

  // Mumbai, India
  { id: 'bom1', name: 'Mumbai Startup Network', platform: 'linkedin', location: 'Mumbai', country: 'India', members: 28000, category: 'Business', description: 'India largest startup community', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bom2', name: 'Mumbai Cricket League', platform: 'whatsapp', location: 'Mumbai', country: 'India', members: 15600, category: 'Sports', description: 'Weekend cricket matches', link: 'https://wa.me/example', verified: true },
  { id: 'bom3', name: 'Mumbai Bollywood Dance', platform: 'facebook', location: 'Mumbai', country: 'India', members: 6700, category: 'Arts', description: 'Bollywood dance classes', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'bom4', name: 'Mumbai Developers', platform: 'discord', location: 'Mumbai', country: 'India', members: 11200, category: 'Tech', description: 'Software developers community', link: 'https://discord.gg/example', verified: true },

  // Bali, Indonesia
  { id: 'dps1', name: 'Bali Digital Nomads', platform: 'facebook', location: 'Bali', country: 'Indonesia', members: 67000, category: 'Business', description: 'Largest nomad community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'dps2', name: 'Bali Surf Club', platform: 'whatsapp', location: 'Bali', country: 'Indonesia', members: 4900, category: 'Sports', description: 'Daily surf sessions', link: 'https://wa.me/example', verified: true },
  { id: 'dps3', name: 'Bali Yoga Collective', platform: 'meetup', location: 'Bali', country: 'Indonesia', members: 8200, category: 'Wellness', description: 'Yoga and wellness retreats', link: 'https://meetup.com/example', verified: true },
  { id: 'dps4', name: 'Bali Artists Network', platform: 'telegram', location: 'Bali', country: 'Indonesia', members: 3400, category: 'Arts', description: 'Local artists and creatives', link: 'https://t.me/example', verified: true },

  // Europe - London, UK
  { id: 'lon1', name: 'London Business Forum', platform: 'linkedin', location: 'London', country: 'UK', members: 42000, category: 'Business', description: 'Professional networking hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'lon2', name: 'London Running Club', platform: 'meetup', location: 'London', country: 'UK', members: 12800, category: 'Sports', description: 'Run through London parks', link: 'https://meetup.com/example', verified: true },
  { id: 'lon3', name: 'London Tech Meetup', platform: 'discord', location: 'London', country: 'UK', members: 18500, category: 'Tech', description: 'Tech talks and hackathons', link: 'https://discord.gg/example', verified: true },
  { id: 'lon4', name: 'London Food Lovers', platform: 'facebook', location: 'London', country: 'UK', members: 23400, category: 'Hobbies', description: 'Restaurant reviews and food tours', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'lon5', name: 'London Photography Walks', platform: 'meetup', location: 'London', country: 'UK', members: 5600, category: 'Hobbies', description: 'Weekend photo walks', link: 'https://meetup.com/example', verified: true },

  // Paris, France
  { id: 'par1', name: 'Paris Entrepreneurs', platform: 'linkedin', location: 'Paris', country: 'France', members: 19500, category: 'Business', description: 'French startup ecosystem', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'par2', name: 'Paris Cycling Tours', platform: 'telegram', location: 'Paris', country: 'France', members: 6200, category: 'Sports', description: 'Explore Paris by bike', link: 'https://t.me/example', verified: true },
  { id: 'par3', name: 'Paris Art Scene', platform: 'facebook', location: 'Paris', country: 'France', members: 8900, category: 'Arts', description: 'Gallery visits and exhibitions', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'par4', name: 'Paris Tech Hub', platform: 'meetup', location: 'Paris', country: 'France', members: 14200, category: 'Tech', description: 'Station F community', link: 'https://meetup.com/example', verified: true },

  // Berlin, Germany
  { id: 'ber1', name: 'Berlin Startup Scene', platform: 'linkedin', location: 'Berlin', country: 'Germany', members: 32000, category: 'Business', description: 'Europes startup capital', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'ber2', name: 'Berlin Football Club', platform: 'whatsapp', location: 'Berlin', country: 'Germany', members: 5400, category: 'Sports', description: 'Amateur football leagues', link: 'https://wa.me/example', verified: true },
  { id: 'ber3', name: 'Berlin Electronic Music', platform: 'telegram', location: 'Berlin', country: 'Germany', members: 18700, category: 'Music', description: 'Techno and electronic scene', link: 'https://t.me/example', verified: true },
  { id: 'ber4', name: 'Berlin Developers', platform: 'discord', location: 'Berlin', country: 'Germany', members: 22100, category: 'Tech', description: 'Software engineering community', link: 'https://discord.gg/example', verified: true },

  // Amsterdam, Netherlands
  { id: 'ams1', name: 'Amsterdam Business Network', platform: 'linkedin', location: 'Amsterdam', country: 'Netherlands', members: 16800, category: 'Business', description: 'International professionals', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'ams2', name: 'Amsterdam Cycling Club', platform: 'meetup', location: 'Amsterdam', country: 'Netherlands', members: 9200, category: 'Sports', description: 'Bike tours around Netherlands', link: 'https://meetup.com/example', verified: true },
  { id: 'ams3', name: 'Amsterdam Cannabis Culture', platform: 'telegram', location: 'Amsterdam', country: 'Netherlands', members: 7600, category: 'Social', description: 'Coffee shop recommendations', link: 'https://t.me/example', verified: true },
  { id: 'ams4', name: 'Amsterdam Blockchain', platform: 'discord', location: 'Amsterdam', country: 'Netherlands', members: 8900, category: 'Tech', description: 'Crypto and Web3 community', link: 'https://discord.gg/example', verified: true },

  // Barcelona, Spain
  { id: 'bcn1', name: 'Barcelona Digital Nomads', platform: 'facebook', location: 'Barcelona', country: 'Spain', members: 31000, category: 'Business', description: 'Remote workers community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'bcn2', name: 'Barcelona Beach Volleyball', platform: 'whatsapp', location: 'Barcelona', country: 'Spain', members: 3800, category: 'Sports', description: 'Beach sports every weekend', link: 'https://wa.me/example', verified: true },
  { id: 'bcn3', name: 'Barcelona Language Exchange', platform: 'meetup', location: 'Barcelona', country: 'Spain', members: 11400, category: 'Social', description: 'Practice Spanish and more', link: 'https://meetup.com/example', verified: true },
  { id: 'bcn4', name: 'Barcelona Tech City', platform: 'linkedin', location: 'Barcelona', country: 'Spain', members: 18700, category: 'Tech', description: 'Tech ecosystem in BCN', link: 'https://linkedin.com/groups/example', verified: true },

  // Lisbon, Portugal
  { id: 'lis1', name: 'Lisbon Startup Community', platform: 'linkedin', location: 'Lisbon', country: 'Portugal', members: 14200, category: 'Business', description: 'Web Summit community', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'lis2', name: 'Lisbon Surf Club', platform: 'telegram', location: 'Lisbon', country: 'Portugal', members: 6700, category: 'Sports', description: 'Surf Costa da Caparica', link: 'https://t.me/example', verified: true },
  { id: 'lis3', name: 'Lisbon Remote Workers', platform: 'facebook', location: 'Lisbon', country: 'Portugal', members: 28000, category: 'Business', description: 'Digital nomad hotspot', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'lis4', name: 'Lisbon Fado Music', platform: 'meetup', location: 'Lisbon', country: 'Portugal', members: 2100, category: 'Music', description: 'Traditional Portuguese music', link: 'https://meetup.com/example', verified: true },

  // Rome, Italy
  { id: 'rom1', name: 'Rome Business Circle', platform: 'linkedin', location: 'Rome', country: 'Italy', members: 11200, category: 'Business', description: 'Italian entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'rom2', name: 'Rome Historical Walks', platform: 'meetup', location: 'Rome', country: 'Italy', members: 4600, category: 'Hobbies', description: 'Explore ancient Rome', link: 'https://meetup.com/example', verified: true },
  { id: 'rom3', name: 'Rome Food & Wine', platform: 'facebook', location: 'Rome', country: 'Italy', members: 18900, category: 'Social', description: 'Italian cuisine lovers', link: 'https://facebook.com/groups/example', verified: true },

  // North America - New York, USA
  { id: 'nyc1', name: 'NYC Business Network', platform: 'linkedin', location: 'New York', country: 'USA', members: 85000, category: 'Business', description: 'Wall Street and beyond', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'nyc2', name: 'NYC Marathon Training', platform: 'meetup', location: 'New York', country: 'USA', members: 15600, category: 'Sports', description: 'Train for NYC marathon', link: 'https://meetup.com/example', verified: true },
  { id: 'nyc3', name: 'NYC Tech Meetup', platform: 'discord', location: 'New York', country: 'USA', members: 34200, category: 'Tech', description: 'Silicon Alley community', link: 'https://discord.gg/example', verified: true },
  { id: 'nyc4', name: 'NYC Broadway Lovers', platform: 'facebook', location: 'New York', country: 'USA', members: 12800, category: 'Arts', description: 'Theater and musicals', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'nyc5', name: 'NYC Photography Club', platform: 'meetup', location: 'New York', country: 'USA', members: 8900, category: 'Hobbies', description: 'Street photography tours', link: 'https://meetup.com/example', verified: true },

  // San Francisco, USA
  { id: 'sfo1', name: 'SF Tech Founders', platform: 'linkedin', location: 'San Francisco', country: 'USA', members: 56000, category: 'Business', description: 'Silicon Valley startups', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'sfo2', name: 'SF Hiking Adventures', platform: 'meetup', location: 'San Francisco', country: 'USA', members: 9800, category: 'Sports', description: 'Bay Area hiking trails', link: 'https://meetup.com/example', verified: true },
  { id: 'sfo3', name: 'SF AI & Machine Learning', platform: 'discord', location: 'San Francisco', country: 'USA', members: 28700, category: 'Tech', description: 'AI researchers and engineers', link: 'https://discord.gg/example', verified: true },
  { id: 'sfo4', name: 'SF Foodies', platform: 'facebook', location: 'San Francisco', country: 'USA', members: 34500, category: 'Social', description: 'Restaurant scene and food trucks', link: 'https://facebook.com/groups/example', verified: true },

  // Los Angeles, USA
  { id: 'lax1', name: 'LA Entertainment Industry', platform: 'linkedin', location: 'Los Angeles', country: 'USA', members: 67000, category: 'Business', description: 'Hollywood networking', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'lax2', name: 'LA Beach Yoga', platform: 'meetup', location: 'Los Angeles', country: 'USA', members: 7800, category: 'Wellness', description: 'Yoga at Santa Monica beach', link: 'https://meetup.com/example', verified: true },
  { id: 'lax3', name: 'LA Film Makers', platform: 'facebook', location: 'Los Angeles', country: 'USA', members: 23400, category: 'Arts', description: 'Independent film community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'lax4', name: 'LA Tech Scene', platform: 'discord', location: 'Los Angeles', country: 'USA', members: 18900, category: 'Tech', description: 'Silicon Beach developers', link: 'https://discord.gg/example', verified: true },

  // Miami, USA
  { id: 'mia1', name: 'Miami Crypto Hub', platform: 'telegram', location: 'Miami', country: 'USA', members: 24500, category: 'Business', description: 'Crypto capital of USA', link: 'https://t.me/example', verified: true },
  { id: 'mia2', name: 'Miami Beach Sports', platform: 'whatsapp', location: 'Miami', country: 'USA', members: 5600, category: 'Sports', description: 'Beach volleyball and more', link: 'https://wa.me/example', verified: true },
  { id: 'mia3', name: 'Miami Latin Dance', platform: 'meetup', location: 'Miami', country: 'USA', members: 8200, category: 'Arts', description: 'Salsa and bachata classes', link: 'https://meetup.com/example', verified: true },

  // Toronto, Canada
  { id: 'yyz1', name: 'Toronto Business Leaders', platform: 'linkedin', location: 'Toronto', country: 'Canada', members: 34000, category: 'Business', description: 'Canadian entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'yyz2', name: 'Toronto Ice Hockey', platform: 'facebook', location: 'Toronto', country: 'Canada', members: 12600, category: 'Sports', description: 'Pick-up hockey games', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'yyz3', name: 'Toronto Tech Meetup', platform: 'meetup', location: 'Toronto', country: 'Canada', members: 16800, category: 'Tech', description: 'Canadian tech community', link: 'https://meetup.com/example', verified: true },
  { id: 'yyz4', name: 'Toronto Film Festival Fans', platform: 'telegram', location: 'Toronto', country: 'Canada', members: 4200, category: 'Arts', description: 'TIFF and cinema lovers', link: 'https://t.me/example', verified: true },

  // Vancouver, Canada
  { id: 'yvr1', name: 'Vancouver Startups', platform: 'linkedin', location: 'Vancouver', country: 'Canada', members: 18700, category: 'Business', description: 'BC tech scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'yvr2', name: 'Vancouver Hiking Club', platform: 'meetup', location: 'Vancouver', country: 'Canada', members: 14200, category: 'Sports', description: 'Explore BC mountains', link: 'https://meetup.com/example', verified: true },
  { id: 'yvr3', name: 'Vancouver Cannabis Community', platform: 'telegram', location: 'Vancouver', country: 'Canada', members: 6800, category: 'Social', description: 'Legal cannabis culture', link: 'https://t.me/example', verified: true },

  // Latin America - Mexico City, Mexico
  { id: 'mex1', name: 'CDMX Emprendedores', platform: 'linkedin', location: 'Mexico City', country: 'Mexico', members: 22000, category: 'Business', description: 'Mexican startup ecosystem', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mex2', name: 'Mexico City Football', platform: 'whatsapp', location: 'Mexico City', country: 'Mexico', members: 8900, category: 'Sports', description: 'Weekly soccer matches', link: 'https://wa.me/example', verified: true },
  { id: 'mex3', name: 'CDMX Tech Community', platform: 'discord', location: 'Mexico City', country: 'Mexico', members: 12400, category: 'Tech', description: 'Latin American developers', link: 'https://discord.gg/example', verified: true },
  { id: 'mex4', name: 'Mexico City Food Tours', platform: 'facebook', location: 'Mexico City', country: 'Mexico', members: 16700, category: 'Social', description: 'Street food and tacos', link: 'https://facebook.com/groups/example', verified: true },

  // Buenos Aires, Argentina
  { id: 'bue1', name: 'Buenos Aires Startups', platform: 'linkedin', location: 'Buenos Aires', country: 'Argentina', members: 14500, category: 'Business', description: 'Argentine tech scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bue2', name: 'BA Tango Community', platform: 'meetup', location: 'Buenos Aires', country: 'Argentina', members: 9200, category: 'Arts', description: 'Traditional tango classes', link: 'https://meetup.com/example', verified: true },
  { id: 'bue3', name: 'Buenos Aires Football Fans', platform: 'facebook', location: 'Buenos Aires', country: 'Argentina', members: 45000, category: 'Sports', description: 'Football is religion here', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'bue4', name: 'BA Developers', platform: 'discord', location: 'Buenos Aires', country: 'Argentina', members: 8700, category: 'Tech', description: 'Software developers network', link: 'https://discord.gg/example', verified: true },

  // São Paulo, Brazil
  { id: 'sao1', name: 'São Paulo Negócios', platform: 'linkedin', location: 'São Paulo', country: 'Brazil', members: 38000, category: 'Business', description: 'Brazilian business hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'sao2', name: 'SP Jiu-Jitsu Community', platform: 'whatsapp', location: 'São Paulo', country: 'Brazil', members: 11200, category: 'Sports', description: 'Brazilian Jiu-Jitsu training', link: 'https://wa.me/example', verified: true },
  { id: 'sao3', name: 'São Paulo Tech Hub', platform: 'telegram', location: 'São Paulo', country: 'Brazil', members: 16800, category: 'Tech', description: 'Largest tech community in LATAM', link: 'https://t.me/example', verified: true },

  // Medellín, Colombia
  { id: 'med1', name: 'Medellín Digital Nomads', platform: 'facebook', location: 'Medellín', country: 'Colombia', members: 23000, category: 'Business', description: 'Remote workers paradise', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'med2', name: 'Medellín Salsa Dancing', platform: 'meetup', location: 'Medellín', country: 'Colombia', members: 5600, category: 'Arts', description: 'Salsa capital of the world', link: 'https://meetup.com/example', verified: true },
  { id: 'med3', name: 'Medellín Spanish Exchange', platform: 'telegram', location: 'Medellín', country: 'Colombia', members: 7800, category: 'Social', description: 'Practice Spanish with locals', link: 'https://t.me/example', verified: true },

  // Oceania - Sydney, Australia
  { id: 'syd1', name: 'Sydney Business Network', platform: 'linkedin', location: 'Sydney', country: 'Australia', members: 29000, category: 'Business', description: 'Australian entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'syd2', name: 'Sydney Surf Club', platform: 'meetup', location: 'Sydney', country: 'Australia', members: 8900, category: 'Sports', description: 'Bondi Beach surf sessions', link: 'https://meetup.com/example', verified: true },
  { id: 'syd3', name: 'Sydney Tech Community', platform: 'discord', location: 'Sydney', country: 'Australia', members: 14200, category: 'Tech', description: 'Australian tech scene', link: 'https://discord.gg/example', verified: true },

  // Melbourne, Australia
  { id: 'mel1', name: 'Melbourne Startups', platform: 'linkedin', location: 'Melbourne', country: 'Australia', members: 22000, category: 'Business', description: 'Victorian tech hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mel2', name: 'Melbourne AFL Fans', platform: 'facebook', location: 'Melbourne', country: 'Australia', members: 34500, category: 'Sports', description: 'Australian football league', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'mel3', name: 'Melbourne Coffee Culture', platform: 'meetup', location: 'Melbourne', country: 'Australia', members: 6700, category: 'Social', description: 'Best coffee in the world', link: 'https://meetup.com/example', verified: true },

  // Africa - Cape Town, South Africa
  { id: 'cpt1', name: 'Cape Town Entrepreneurs', platform: 'linkedin', location: 'Cape Town', country: 'South Africa', members: 12800, category: 'Business', description: 'African startup scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'cpt2', name: 'Cape Town Hiking Club', platform: 'meetup', location: 'Cape Town', country: 'South Africa', members: 7200, category: 'Sports', description: 'Table Mountain adventures', link: 'https://meetup.com/example', verified: true },
  { id: 'cpt3', name: 'Cape Town Tech Community', platform: 'discord', location: 'Cape Town', country: 'South Africa', members: 6800, category: 'Tech', description: 'African tech innovation', link: 'https://discord.gg/example', verified: true },

  // Additional Major Cities
  // Chiang Mai, Thailand
  { id: 'cnx1', name: 'Chiang Mai Digital Hub', platform: 'facebook', location: 'Chiang Mai', country: 'Thailand', members: 35000, category: 'Business', description: 'Original nomad city', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'cnx2', name: 'Chiang Mai Rock Climbing', platform: 'meetup', location: 'Chiang Mai', country: 'Thailand', members: 2400, category: 'Sports', description: 'Crazy Horse Buttress climbing', link: 'https://meetup.com/example', verified: true },
  
  // Istanbul, Turkey
  { id: 'ist1', name: 'Istanbul Business Forum', platform: 'linkedin', location: 'Istanbul', country: 'Turkey', members: 18700, category: 'Business', description: 'Bridge between Europe and Asia', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'ist2', name: 'Istanbul Photography Tours', platform: 'telegram', location: 'Istanbul', country: 'Turkey', members: 4200, category: 'Hobbies', description: 'Capture Byzantine beauty', link: 'https://t.me/example', verified: true },

  // Prague, Czech Republic
  { id: 'prg1', name: 'Prague Expats', platform: 'facebook', location: 'Prague', country: 'Czech Republic', members: 28000, category: 'Social', description: 'International community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'prg2', name: 'Prague Beer Lovers', platform: 'meetup', location: 'Prague', country: 'Czech Republic', members: 12400, category: 'Social', description: 'Best beer in Europe', link: 'https://meetup.com/example', verified: true },

  // Vienna, Austria
  { id: 'vie1', name: 'Vienna Classical Music', platform: 'meetup', location: 'Vienna', country: 'Austria', members: 5600, category: 'Music', description: 'Opera and concerts', link: 'https://meetup.com/example', verified: true },
  { id: 'vie2', name: 'Vienna Business Network', platform: 'linkedin', location: 'Vienna', country: 'Austria', members: 14200, category: 'Business', description: 'Austrian professionals', link: 'https://linkedin.com/groups/example', verified: true },

  // Copenhagen, Denmark
  { id: 'cph1', name: 'Copenhagen Startup Scene', platform: 'linkedin', location: 'Copenhagen', country: 'Denmark', members: 16800, category: 'Business', description: 'Nordic innovation', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'cph2', name: 'Copenhagen Cycling Club', platform: 'meetup', location: 'Copenhagen', country: 'Denmark', members: 8900, category: 'Sports', description: 'Most bike-friendly city', link: 'https://meetup.com/example', verified: true },

  // Stockholm, Sweden
  { id: 'sto1', name: 'Stockholm Tech Meetup', platform: 'discord', location: 'Stockholm', country: 'Sweden', members: 18200, category: 'Tech', description: 'Unicorn factory', link: 'https://discord.gg/example', verified: true },
  { id: 'sto2', name: 'Stockholm Design Community', platform: 'meetup', location: 'Stockholm', country: 'Sweden', members: 6700, category: 'Arts', description: 'Scandinavian design', link: 'https://meetup.com/example', verified: true },

  // Oslo, Norway
  { id: 'osl1', name: 'Oslo Entrepreneurs', platform: 'linkedin', location: 'Oslo', country: 'Norway', members: 12400, category: 'Business', description: 'Norwegian startups', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'osl2', name: 'Oslo Hiking Group', platform: 'meetup', location: 'Oslo', country: 'Norway', members: 9800, category: 'Sports', description: 'Explore Norwegian nature', link: 'https://meetup.com/example', verified: true },

  // Helsinki, Finland
  { id: 'hel1', name: 'Helsinki Tech Hub', platform: 'discord', location: 'Helsinki', country: 'Finland', members: 14200, category: 'Tech', description: 'Finnish innovation', link: 'https://discord.gg/example', verified: true },
  { id: 'hel2', name: 'Helsinki Sauna Culture', platform: 'meetup', location: 'Helsinki', country: 'Finland', members: 3400, category: 'Social', description: 'Traditional Finnish saunas', link: 'https://meetup.com/example', verified: true },

  // Dublin, Ireland
  { id: 'dub1', name: 'Dublin Tech Community', platform: 'linkedin', location: 'Dublin', country: 'Ireland', members: 22000, category: 'Tech', description: 'European tech hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'dub2', name: 'Dublin Pub Culture', platform: 'facebook', location: 'Dublin', country: 'Ireland', members: 18900, category: 'Social', description: 'Traditional Irish pubs', link: 'https://facebook.com/groups/example', verified: true },

  // Athens, Greece
  { id: 'ath1', name: 'Athens Startup Community', platform: 'linkedin', location: 'Athens', country: 'Greece', members: 9800, category: 'Business', description: 'Greek entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'ath2', name: 'Athens Historical Tours', platform: 'meetup', location: 'Athens', country: 'Greece', members: 5600, category: 'Hobbies', description: 'Ancient Greece exploration', link: 'https://meetup.com/example', verified: true },

  // Tel Aviv, Israel
  { id: 'tlv1', name: 'Tel Aviv Startup Nation', platform: 'linkedin', location: 'Tel Aviv', country: 'Israel', members: 28000, category: 'Business', description: 'Innovation powerhouse', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'tlv2', name: 'Tel Aviv Beach Sports', platform: 'whatsapp', location: 'Tel Aviv', country: 'Israel', members: 6200, category: 'Sports', description: 'Beach volleyball and more', link: 'https://wa.me/example', verified: true },

  // Kuala Lumpur, Malaysia
  { id: 'kul1', name: 'KL Digital Nomads', platform: 'facebook', location: 'Kuala Lumpur', country: 'Malaysia', members: 16700, category: 'Business', description: 'Malaysia nomad hub', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'kul2', name: 'KL Food Hunters', platform: 'telegram', location: 'Kuala Lumpur', country: 'Malaysia', members: 12400, category: 'Social', description: 'Malaysian street food', link: 'https://t.me/example', verified: true },

  // Manila, Philippines
  { id: 'mnl1', name: 'Manila Entrepreneurs', platform: 'linkedin', location: 'Manila', country: 'Philippines', members: 14200, category: 'Business', description: 'Philippine startup scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mnl2', name: 'Manila Island Hopping', platform: 'whatsapp', location: 'Manila', country: 'Philippines', members: 7800, category: 'Sports', description: 'Weekend island adventures', link: 'https://wa.me/example', verified: true },

  // Ho Chi Minh City, Vietnam
  { id: 'sgn1', name: 'Saigon Digital Nomads', platform: 'facebook', location: 'Ho Chi Minh City', country: 'Vietnam', members: 21000, category: 'Business', description: 'Vietnam remote workers', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'sgn2', name: 'Saigon Street Food Tours', platform: 'meetup', location: 'Ho Chi Minh City', country: 'Vietnam', members: 8900, category: 'Social', description: 'Vietnamese cuisine', link: 'https://meetup.com/example', verified: true },

  // Hanoi, Vietnam
  { id: 'han1', name: 'Hanoi Tech Community', platform: 'discord', location: 'Hanoi', country: 'Vietnam', members: 9200, category: 'Tech', description: 'Northern Vietnam tech hub', link: 'https://discord.gg/example', verified: true },
  { id: 'han2', name: 'Hanoi Coffee Culture', platform: 'meetup', location: 'Hanoi', country: 'Vietnam', members: 4600, category: 'Social', description: 'Famous egg coffee', link: 'https://meetup.com/example', verified: true },

  // Jakarta, Indonesia
  { id: 'jkt1', name: 'Jakarta Startup Ecosystem', platform: 'linkedin', location: 'Jakarta', country: 'Indonesia', members: 24000, category: 'Business', description: 'Indonesian unicorns', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'jkt2', name: 'Jakarta Badminton Club', platform: 'whatsapp', location: 'Jakarta', country: 'Indonesia', members: 5600, category: 'Sports', description: 'Weekly badminton games', link: 'https://wa.me/example', verified: true },

  // Taipei, Taiwan
  { id: 'tpe1', name: 'Taipei Tech Scene', platform: 'discord', location: 'Taipei', country: 'Taiwan', members: 12800, category: 'Tech', description: 'Silicon Island developers', link: 'https://discord.gg/example', verified: true },
  { id: 'tpe2', name: 'Taipei Night Market Tours', platform: 'meetup', location: 'Taipei', country: 'Taiwan', members: 7200, category: 'Social', description: 'Best street food', link: 'https://meetup.com/example', verified: true },

  // Auckland, New Zealand
  { id: 'akl1', name: 'Auckland Business Network', platform: 'linkedin', location: 'Auckland', country: 'New Zealand', members: 16200, category: 'Business', description: 'Kiwi entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'akl2', name: 'Auckland Extreme Sports', platform: 'meetup', location: 'Auckland', country: 'New Zealand', members: 5800, category: 'Sports', description: 'Bungee jumping and skydiving', link: 'https://meetup.com/example', verified: true },

  // Wellington, New Zealand
  { id: 'wlg1', name: 'Wellington Film Industry', platform: 'facebook', location: 'Wellington', country: 'New Zealand', members: 8900, category: 'Arts', description: 'Weta Workshop community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'wlg2', name: 'Wellington Coffee Roasters', platform: 'meetup', location: 'Wellington', country: 'New Zealand', members: 3200, category: 'Social', description: 'Third-wave coffee culture', link: 'https://meetup.com/example', verified: true },

  // Nairobi, Kenya
  { id: 'nbo1', name: 'Nairobi Silicon Savannah', platform: 'linkedin', location: 'Nairobi', country: 'Kenya', members: 14500, category: 'Business', description: 'East African tech hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'nbo2', name: 'Nairobi Safari Group', platform: 'whatsapp', location: 'Nairobi', country: 'Kenya', members: 6700, category: 'Hobbies', description: 'Weekend safari adventures', link: 'https://wa.me/example', verified: true },

  // Lagos, Nigeria
  { id: 'los1', name: 'Lagos Tech Entrepreneurs', platform: 'linkedin', location: 'Lagos', country: 'Nigeria', members: 22000, category: 'Business', description: 'Nigerian startup boom', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'los2', name: 'Lagos Afrobeats Scene', platform: 'telegram', location: 'Lagos', country: 'Nigeria', members: 18400, category: 'Music', description: 'West African music culture', link: 'https://t.me/example', verified: true },

  // Cairo, Egypt
  { id: 'cai1', name: 'Cairo Business Forum', platform: 'linkedin', location: 'Cairo', country: 'Egypt', members: 16800, category: 'Business', description: 'Middle East business hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'cai2', name: 'Cairo Archaeology Club', platform: 'meetup', location: 'Cairo', country: 'Egypt', members: 4200, category: 'Hobbies', description: 'Ancient Egypt exploration', link: 'https://meetup.com/example', verified: true },

  // Riyadh, Saudi Arabia
  { id: 'ruh1', name: 'Riyadh Vision 2030', platform: 'linkedin', location: 'Riyadh', country: 'Saudi Arabia', members: 24000, category: 'Business', description: 'Saudi transformation', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'ruh2', name: 'Riyadh Tech Community', platform: 'discord', location: 'Riyadh', country: 'Saudi Arabia', members: 11200, category: 'Tech', description: 'Saudi Arabia tech scene', link: 'https://discord.gg/example', verified: true },

  // Doha, Qatar
  { id: 'doh1', name: 'Doha Business Network', platform: 'linkedin', location: 'Doha', country: 'Qatar', members: 18700, category: 'Business', description: 'Gulf business leaders', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'doh2', name: 'Doha Sports Fans', platform: 'whatsapp', location: 'Doha', country: 'Qatar', members: 8900, category: 'Sports', description: 'World Cup legacy', link: 'https://wa.me/example', verified: true },

  // More diverse cities
  // Montreal, Canada
  { id: 'yul1', name: 'Montreal Startups', platform: 'linkedin', location: 'Montreal', country: 'Canada', members: 16200, category: 'Business', description: 'Quebec tech scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'yul2', name: 'Montreal Jazz Festival', platform: 'meetup', location: 'Montreal', country: 'Canada', members: 5600, category: 'Music', description: 'Jazz and live music', link: 'https://meetup.com/example', verified: true },

  // Chicago, USA
  { id: 'ord1', name: 'Chicago Business Forum', platform: 'linkedin', location: 'Chicago', country: 'USA', members: 38000, category: 'Business', description: 'Midwest business hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'ord2', name: 'Chicago Blues Scene', platform: 'facebook', location: 'Chicago', country: 'USA', members: 14500, category: 'Music', description: 'Home of the blues', link: 'https://facebook.com/groups/example', verified: true },

  // Austin, USA
  { id: 'aus1', name: 'Austin Tech Community', platform: 'discord', location: 'Austin', country: 'USA', members: 28000, category: 'Tech', description: 'Silicon Hills startups', link: 'https://discord.gg/example', verified: true },
  { id: 'aus2', name: 'Austin Live Music Capital', platform: 'meetup', location: 'Austin', country: 'USA', members: 16700, category: 'Music', description: 'Live music every night', link: 'https://meetup.com/example', verified: true },

  // Seattle, USA
  { id: 'sea1', name: 'Seattle Tech Giants', platform: 'linkedin', location: 'Seattle', country: 'USA', members: 42000, category: 'Tech', description: 'Amazon and Microsoft hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'sea2', name: 'Seattle Coffee Lovers', platform: 'meetup', location: 'Seattle', country: 'USA', members: 9800, category: 'Social', description: 'Birthplace of Starbucks', link: 'https://meetup.com/example', verified: true },

  // Boston, USA
  { id: 'bos1', name: 'Boston Innovation Hub', platform: 'linkedin', location: 'Boston', country: 'USA', members: 34000, category: 'Tech', description: 'MIT and Harvard ecosystem', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bos2', name: 'Boston Marathon Club', platform: 'meetup', location: 'Boston', country: 'USA', members: 12400, category: 'Sports', description: 'Train for Boston Marathon', link: 'https://meetup.com/example', verified: true },

  // Denver, USA
  { id: 'den1', name: 'Denver Outdoor Adventures', platform: 'meetup', location: 'Denver', country: 'USA', members: 18700, category: 'Sports', description: 'Rocky Mountain activities', link: 'https://meetup.com/example', verified: true },
  { id: 'den2', name: 'Denver Cannabis Industry', platform: 'linkedin', location: 'Denver', country: 'USA', members: 11200, category: 'Business', description: 'Legal cannabis business', link: 'https://linkedin.com/groups/example', verified: true },

  // Lima, Peru
  { id: 'lim1', name: 'Lima Entrepreneurs', platform: 'linkedin', location: 'Lima', country: 'Peru', members: 12800, category: 'Business', description: 'Peruvian startups', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'lim2', name: 'Lima Culinary Tours', platform: 'meetup', location: 'Lima', country: 'Peru', members: 6200, category: 'Social', description: 'World-class gastronomy', link: 'https://meetup.com/example', verified: true },

  // Santiago, Chile
  { id: 'scl1', name: 'Santiago Tech Scene', platform: 'discord', location: 'Santiago', country: 'Chile', members: 14200, category: 'Tech', description: 'Chilean innovation', link: 'https://discord.gg/example', verified: true },
  { id: 'scl2', name: 'Santiago Ski Club', platform: 'whatsapp', location: 'Santiago', country: 'Chile', members: 5600, category: 'Sports', description: 'Andes mountain skiing', link: 'https://wa.me/example', verified: true },

  // Bogotá, Colombia
  { id: 'bog1', name: 'Bogotá Startups', platform: 'linkedin', location: 'Bogotá', country: 'Colombia', members: 18200, category: 'Business', description: 'Colombian tech boom', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bog2', name: 'Bogotá Cycling Community', platform: 'facebook', location: 'Bogotá', country: 'Colombia', members: 12400, category: 'Sports', description: 'Ciclovía Sundays', link: 'https://facebook.com/groups/example', verified: true },

  // Quito, Ecuador
  { id: 'uio1', name: 'Quito Digital Nomads', platform: 'facebook', location: 'Quito', country: 'Ecuador', members: 8900, category: 'Business', description: 'Ecuador remote workers', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'uio2', name: 'Quito Mountain Hiking', platform: 'meetup', location: 'Quito', country: 'Ecuador', members: 4200, category: 'Sports', description: 'Volcano trekking', link: 'https://meetup.com/example', verified: true },

  // Warsaw, Poland
  { id: 'waw1', name: 'Warsaw Tech Hub', platform: 'linkedin', location: 'Warsaw', country: 'Poland', members: 18700, category: 'Tech', description: 'Polish Silicon Valley', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'waw2', name: 'Warsaw Startup Community', platform: 'discord', location: 'Warsaw', country: 'Poland', members: 11200, category: 'Business', description: 'Central European startups', link: 'https://discord.gg/example', verified: true },

  // Budapest, Hungary
  { id: 'bud1', name: 'Budapest Digital Nomads', platform: 'facebook', location: 'Budapest', country: 'Hungary', members: 14500, category: 'Business', description: 'Central Europe hub', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'bud2', name: 'Budapest Thermal Baths', platform: 'meetup', location: 'Budapest', country: 'Hungary', members: 6200, category: 'Wellness', description: 'Historic spa culture', link: 'https://meetup.com/example', verified: true },

  // Krakow, Poland
  { id: 'krk1', name: 'Krakow Expat Community', platform: 'facebook', location: 'Krakow', country: 'Poland', members: 12400, category: 'Social', description: 'International community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'krk2', name: 'Krakow Historical Tours', platform: 'meetup', location: 'Krakow', country: 'Poland', members: 4800, category: 'Hobbies', description: 'Medieval city exploration', link: 'https://meetup.com/example', verified: true },

  // Tallinn, Estonia
  { id: 'tll1', name: 'Tallinn E-Residency', platform: 'linkedin', location: 'Tallinn', country: 'Estonia', members: 16200, category: 'Business', description: 'Digital nation pioneers', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'tll2', name: 'Tallinn Tech Community', platform: 'discord', location: 'Tallinn', country: 'Estonia', members: 8900, category: 'Tech', description: 'Baltic tech hub', link: 'https://discord.gg/example', verified: true },

  // Riga, Latvia
  { id: 'rix1', name: 'Riga Startup Scene', platform: 'linkedin', location: 'Riga', country: 'Latvia', members: 9800, category: 'Business', description: 'Latvian entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'rix2', name: 'Riga Old Town Tours', platform: 'meetup', location: 'Riga', country: 'Latvia', members: 3400, category: 'Hobbies', description: 'Art Nouveau architecture', link: 'https://meetup.com/example', verified: true },

  // Vilnius, Lithuania
  { id: 'vno1', name: 'Vilnius Tech Park', platform: 'discord', location: 'Vilnius', country: 'Lithuania', members: 7800, category: 'Tech', description: 'Lithuanian innovation', link: 'https://discord.gg/example', verified: true },
  { id: 'vno2', name: 'Vilnius Basketball Fans', platform: 'facebook', location: 'Vilnius', country: 'Lithuania', members: 18200, category: 'Sports', description: 'Basketball is life', link: 'https://facebook.com/groups/example', verified: true },

  // Bucharest, Romania
  { id: 'otp1', name: 'Bucharest Tech Community', platform: 'linkedin', location: 'Bucharest', country: 'Romania', members: 14200, category: 'Tech', description: 'Romanian IT sector', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'otp2', name: 'Bucharest Nightlife', platform: 'telegram', location: 'Bucharest', country: 'Romania', members: 16700, category: 'Social', description: 'Party capital of Eastern Europe', link: 'https://t.me/example', verified: true },

  // Sofia, Bulgaria
  { id: 'sof1', name: 'Sofia Digital Nomads', platform: 'facebook', location: 'Sofia', country: 'Bulgaria', members: 11200, category: 'Business', description: 'Affordable nomad destination', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'sof2', name: 'Sofia Mountain Skiing', platform: 'meetup', location: 'Sofia', country: 'Bulgaria', members: 5600, category: 'Sports', description: 'Vitosha mountain skiing', link: 'https://meetup.com/example', verified: true },

  // Belgrade, Serbia
  { id: 'beg1', name: 'Belgrade Startup Scene', platform: 'linkedin', location: 'Belgrade', country: 'Serbia', members: 9800, category: 'Business', description: 'Balkan tech hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'beg2', name: 'Belgrade Nightlife', platform: 'telegram', location: 'Belgrade', country: 'Serbia', members: 14500, category: 'Social', description: 'Famous club scene', link: 'https://t.me/example', verified: true },

  // Delhi, India
  { id: 'del1', name: 'Delhi Startup Network', platform: 'linkedin', location: 'Delhi', country: 'India', members: 32000, category: 'Business', description: 'Northern India tech ecosystem', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'del2', name: 'Delhi Street Food Walks', platform: 'meetup', location: 'Delhi', country: 'India', members: 14500, category: 'Social', description: 'Old Delhi culinary tours', link: 'https://meetup.com/example', verified: true },
  { id: 'del3', name: 'Delhi Cricket Fanatics', platform: 'whatsapp', location: 'Delhi', country: 'India', members: 22000, category: 'Sports', description: 'IPL and gully cricket', link: 'https://wa.me/example', verified: true },

  // Shanghai, China
  { id: 'sha1', name: 'Shanghai Expat Business', platform: 'linkedin', location: 'Shanghai', country: 'China', members: 28000, category: 'Business', description: 'Finance and trade hub', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'sha2', name: 'Shanghai Tech Builders', platform: 'discord', location: 'Shanghai', country: 'China', members: 16200, category: 'Tech', description: 'Chinese tech innovation', link: 'https://discord.gg/example', verified: true },

  // Beijing, China
  { id: 'bjn1', name: 'Beijing Entrepreneurs', platform: 'linkedin', location: 'Beijing', country: 'China', members: 24000, category: 'Business', description: 'Zhongguancun startup scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bjn2', name: 'Beijing Culture Club', platform: 'meetup', location: 'Beijing', country: 'China', members: 8200, category: 'Hobbies', description: 'Hutong walks and cultural tours', link: 'https://meetup.com/example', verified: true },

  // Shenzhen, China
  { id: 'szx1', name: 'Shenzhen Hardware Makers', platform: 'discord', location: 'Shenzhen', country: 'China', members: 18700, category: 'Tech', description: 'Hardware capital of the world', link: 'https://discord.gg/example', verified: true },
  { id: 'szx2', name: 'Shenzhen Business Forum', platform: 'linkedin', location: 'Shenzhen', country: 'China', members: 14200, category: 'Business', description: 'Pearl River Delta entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },

  // Osaka, Japan
  { id: 'osa1', name: 'Osaka Food Lovers', platform: 'meetup', location: 'Osaka', country: 'Japan', members: 12400, category: 'Social', description: 'Japan kitchen city food tours', link: 'https://meetup.com/example', verified: true },
  { id: 'osa2', name: 'Osaka Business Network', platform: 'linkedin', location: 'Osaka', country: 'Japan', members: 9800, category: 'Business', description: 'Kansai business community', link: 'https://linkedin.com/groups/example', verified: true },

  // Madrid, Spain
  { id: 'mad1', name: 'Madrid Startup Ecosystem', platform: 'linkedin', location: 'Madrid', country: 'Spain', members: 22000, category: 'Business', description: 'Spanish capital entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mad2', name: 'Madrid Football Fans', platform: 'whatsapp', location: 'Madrid', country: 'Spain', members: 34000, category: 'Sports', description: 'Real Madrid and Atletico fans', link: 'https://wa.me/example', verified: true },
  { id: 'mad3', name: 'Madrid Tapas Tours', platform: 'meetup', location: 'Madrid', country: 'Spain', members: 8900, category: 'Social', description: 'Authentic Spanish tapas crawls', link: 'https://meetup.com/example', verified: true },

  // Munich, Germany
  { id: 'muc1', name: 'Munich Tech Hub', platform: 'linkedin', location: 'Munich', country: 'Germany', members: 18200, category: 'Tech', description: 'Bavarian tech scene', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'muc2', name: 'Munich Oktoberfest Community', platform: 'meetup', location: 'Munich', country: 'Germany', members: 12400, category: 'Social', description: 'Beer gardens and festivals', link: 'https://meetup.com/example', verified: true },

  // Zurich, Switzerland
  { id: 'zrh1', name: 'Zurich Finance Network', platform: 'linkedin', location: 'Zurich', country: 'Switzerland', members: 24000, category: 'Business', description: 'Swiss banking and finance', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'zrh2', name: 'Zurich Hiking Club', platform: 'meetup', location: 'Zurich', country: 'Switzerland', members: 9200, category: 'Sports', description: 'Swiss Alps adventures', link: 'https://meetup.com/example', verified: true },

  // Brussels, Belgium
  { id: 'bru1', name: 'Brussels EU Affairs', platform: 'linkedin', location: 'Brussels', country: 'Belgium', members: 16800, category: 'Business', description: 'EU policy and lobbying network', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'bru2', name: 'Brussels Beer Culture', platform: 'meetup', location: 'Brussels', country: 'Belgium', members: 7200, category: 'Social', description: 'Belgian beer tastings', link: 'https://meetup.com/example', verified: true },

  // Milan, Italy
  { id: 'mxp1', name: 'Milan Fashion Business', platform: 'linkedin', location: 'Milan', country: 'Italy', members: 22000, category: 'Business', description: 'Fashion capital networking', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mxp2', name: 'Milan Design Community', platform: 'meetup', location: 'Milan', country: 'Italy', members: 11200, category: 'Arts', description: 'Design Week and exhibitions', link: 'https://meetup.com/example', verified: true },

  // Abu Dhabi, UAE
  { id: 'auh1', name: 'Abu Dhabi Business Leaders', platform: 'linkedin', location: 'Abu Dhabi', country: 'UAE', members: 18700, category: 'Business', description: 'Capital city networking', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'auh2', name: 'Abu Dhabi F1 Fans', platform: 'whatsapp', location: 'Abu Dhabi', country: 'UAE', members: 8900, category: 'Sports', description: 'Yas Marina Circuit community', link: 'https://wa.me/example', verified: true },

  // Bangalore, India
  { id: 'blr1', name: 'Bangalore Tech Hub', platform: 'discord', location: 'Bangalore', country: 'India', members: 45000, category: 'Tech', description: 'Silicon Valley of India', link: 'https://discord.gg/example', verified: true },
  { id: 'blr2', name: 'Bangalore Startup Network', platform: 'linkedin', location: 'Bangalore', country: 'India', members: 38000, category: 'Business', description: 'Indian startup capital', link: 'https://linkedin.com/groups/example', verified: true },

  // Washington DC, USA
  { id: 'dca1', name: 'DC Policy & Tech', platform: 'linkedin', location: 'Washington DC', country: 'USA', members: 28000, category: 'Business', description: 'Policy meets technology', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'dca2', name: 'DC Running Club', platform: 'meetup', location: 'Washington DC', country: 'USA', members: 12400, category: 'Sports', description: 'National Mall morning runs', link: 'https://meetup.com/example', verified: true },

  // São Paulo communities (additional)
  { id: 'sao4', name: 'SP Art & Culture', platform: 'meetup', location: 'São Paulo', country: 'Brazil', members: 9800, category: 'Arts', description: 'Museum visits and galleries', link: 'https://meetup.com/example', verified: true },

  // Porto, Portugal
  { id: 'opo1', name: 'Porto Digital Nomads', platform: 'facebook', location: 'Porto', country: 'Portugal', members: 14200, category: 'Business', description: 'Northern Portugal remote workers', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'opo2', name: 'Porto Wine Tours', platform: 'meetup', location: 'Porto', country: 'Portugal', members: 6700, category: 'Social', description: 'Port wine tastings in Gaia', link: 'https://meetup.com/example', verified: true },

  // Tbilisi, Georgia
  { id: 'tbs1', name: 'Tbilisi Digital Nomads', platform: 'facebook', location: 'Tbilisi', country: 'Georgia', members: 18200, category: 'Business', description: 'Caucasus nomad hub', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'tbs2', name: 'Tbilisi Wine & Dine', platform: 'meetup', location: 'Tbilisi', country: 'Georgia', members: 5600, category: 'Social', description: 'Georgian cuisine and wine', link: 'https://meetup.com/example', verified: true },

  // Marrakech, Morocco
  { id: 'rak1', name: 'Marrakech Creatives', platform: 'facebook', location: 'Marrakech', country: 'Morocco', members: 8900, category: 'Arts', description: 'Artists and designers in Morocco', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'rak2', name: 'Marrakech Nomads', platform: 'telegram', location: 'Marrakech', country: 'Morocco', members: 6200, category: 'Business', description: 'North African remote workers', link: 'https://t.me/example', verified: true },

  // Kyiv, Ukraine
  { id: 'kbp1', name: 'Kyiv Tech Community', platform: 'discord', location: 'Kyiv', country: 'Ukraine', members: 16200, category: 'Tech', description: 'Ukrainian developers and founders', link: 'https://discord.gg/example', verified: true },
  { id: 'kbp2', name: 'Kyiv Entrepreneurs', platform: 'linkedin', location: 'Kyiv', country: 'Ukraine', members: 11200, category: 'Business', description: 'Resilient Ukrainian startups', link: 'https://linkedin.com/groups/example', verified: true },

  // Phnom Penh, Cambodia
  { id: 'pnh1', name: 'Phnom Penh Expats', platform: 'facebook', location: 'Phnom Penh', country: 'Cambodia', members: 12400, category: 'Social', description: 'Cambodia expat community', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'pnh2', name: 'PP Digital Nomads', platform: 'telegram', location: 'Phnom Penh', country: 'Cambodia', members: 4200, category: 'Business', description: 'Southeast Asia on a budget', link: 'https://t.me/example', verified: true },

  // Da Nang, Vietnam
  { id: 'dad1', name: 'Da Nang Nomads', platform: 'facebook', location: 'Da Nang', country: 'Vietnam', members: 16800, category: 'Business', description: 'Beach city remote workers', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'dad2', name: 'Da Nang Surf Club', platform: 'whatsapp', location: 'Da Nang', country: 'Vietnam', members: 3200, category: 'Sports', description: 'Central Vietnam surf culture', link: 'https://wa.me/example', verified: true },

  // Canggu, Indonesia
  { id: 'cgg1', name: 'Canggu Digital Nomads', platform: 'facebook', location: 'Canggu', country: 'Indonesia', members: 28000, category: 'Business', description: 'Bali nomad epicenter', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'cgg2', name: 'Canggu Surf & Skate', platform: 'whatsapp', location: 'Canggu', country: 'Indonesia', members: 5600, category: 'Sports', description: 'Daily surf sessions at Echo Beach', link: 'https://wa.me/example', verified: true },

  // Playa del Carmen, Mexico
  { id: 'pdc1', name: 'Playa Nomad Community', platform: 'facebook', location: 'Playa del Carmen', country: 'Mexico', members: 14200, category: 'Business', description: 'Riviera Maya digital workers', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'pdc2', name: 'Playa Scuba Diving', platform: 'whatsapp', location: 'Playa del Carmen', country: 'Mexico', members: 4800, category: 'Sports', description: 'Cenote and reef diving', link: 'https://wa.me/example', verified: true },

  // Tulum, Mexico
  { id: 'tul1', name: 'Tulum Wellness Community', platform: 'meetup', location: 'Tulum', country: 'Mexico', members: 9200, category: 'Wellness', description: 'Yoga retreats and cacao ceremonies', link: 'https://meetup.com/example', verified: true },
  { id: 'tul2', name: 'Tulum Digital Nomads', platform: 'telegram', location: 'Tulum', country: 'Mexico', members: 7800, category: 'Business', description: 'Jungle co-working lifestyle', link: 'https://t.me/example', verified: true },

  // Colombo, Sri Lanka
  { id: 'cmb1', name: 'Colombo Startup Hub', platform: 'linkedin', location: 'Colombo', country: 'Sri Lanka', members: 8200, category: 'Business', description: 'Sri Lankan entrepreneurs', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'cmb2', name: 'Colombo Surf & Beach', platform: 'whatsapp', location: 'Colombo', country: 'Sri Lanka', members: 3400, category: 'Sports', description: 'Southern coast surf trips', link: 'https://wa.me/example', verified: true },

  // Montevideo, Uruguay
  { id: 'mvd1', name: 'Montevideo Tech Scene', platform: 'linkedin', location: 'Montevideo', country: 'Uruguay', members: 6800, category: 'Tech', description: 'Uruguayan developers', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mvd2', name: 'Montevideo Mate Culture', platform: 'meetup', location: 'Montevideo', country: 'Uruguay', members: 4200, category: 'Social', description: 'Share mate on the Rambla', link: 'https://meetup.com/example', verified: true },

  // Split, Croatia
  { id: 'spu1', name: 'Split Digital Nomads', platform: 'facebook', location: 'Split', country: 'Croatia', members: 5600, category: 'Business', description: 'Adriatic coast remote workers', link: 'https://facebook.com/groups/example', verified: true },
  { id: 'spu2', name: 'Split Sailing Club', platform: 'whatsapp', location: 'Split', country: 'Croatia', members: 3200, category: 'Sports', description: 'Island hopping adventures', link: 'https://wa.me/example', verified: true },

  // Valletta, Malta
  { id: 'mla1', name: 'Malta iGaming Network', platform: 'linkedin', location: 'Valletta', country: 'Malta', members: 12400, category: 'Business', description: 'iGaming capital of Europe', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'mla2', name: 'Malta Diving Community', platform: 'meetup', location: 'Valletta', country: 'Malta', members: 4800, category: 'Sports', description: 'Mediterranean diving spots', link: 'https://meetup.com/example', verified: true },

  // Casablanca, Morocco
  { id: 'cmn1', name: 'Casablanca Business Club', platform: 'linkedin', location: 'Casablanca', country: 'Morocco', members: 14200, category: 'Business', description: 'Morocco financial center', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'cmn2', name: 'Casa Tech Devs', platform: 'discord', location: 'Casablanca', country: 'Morocco', members: 6800, category: 'Tech', description: 'Moroccan tech community', link: 'https://discord.gg/example', verified: true },

  // Florianópolis, Brazil
  { id: 'fln1', name: 'Floripa Tech Island', platform: 'linkedin', location: 'Florianópolis', country: 'Brazil', members: 8900, category: 'Tech', description: 'Brazilian Silicon Island', link: 'https://linkedin.com/groups/example', verified: true },
  { id: 'fln2', name: 'Floripa Surf Community', platform: 'whatsapp', location: 'Florianópolis', country: 'Brazil', members: 4200, category: 'Sports', description: 'Beach lifestyle and surfing', link: 'https://wa.me/example', verified: true },

  // Batumi, Georgia
  { id: 'bus1', name: 'Batumi Beach Nomads', platform: 'telegram', location: 'Batumi', country: 'Georgia', members: 5600, category: 'Business', description: 'Black Sea nomad hub', link: 'https://t.me/example', verified: true },
  { id: 'bus2', name: 'Batumi Nightlife', platform: 'whatsapp', location: 'Batumi', country: 'Georgia', members: 2800, category: 'Social', description: 'Vibrant summer scene', link: 'https://wa.me/example', verified: true },
];

const categories = [
  'All Categories',
  'Business',
  'Sports',
  'Hobbies',
  'Tech',
  'Arts',
  'Music',
  'Social',
  'Wellness',
];

const platforms = ['all', 'discord', 'telegram', 'facebook', 'whatsapp', 'meetup', 'linkedin'];

const LocalNomads: React.FC<LocalNomadsProps> = ({ currentLocation }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Detect user's location city
  const userCity = currentLocation?.city || 'Bangkok';
  const userCountry = currentLocation?.country || 'Thailand';

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(communityGroups.map(group => group.location))).sort();
    return ['All Cities', ...uniqueCities];
  }, []);

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let filtered = communityGroups;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(group => group.platform === selectedPlatform);
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(group => group.category === selectedCategory);
    }

    // Filter by city
    if (selectedCity !== 'all' && selectedCity !== 'All Cities') {
      filtered = filtered.filter(group => group.location === selectedCity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        group =>
          group.name.toLowerCase().includes(query) ||
          group.location.toLowerCase().includes(query) ||
          group.country.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedPlatform, selectedCategory, selectedCity, searchQuery]);

  // Get top 4 groups for user's location
  const topLocalGroups = useMemo(() => {
    return communityGroups
      .filter(group => group.location === userCity || group.country === userCountry)
      .sort((a, b) => b.members - a.members)
      .slice(0, 4);
  }, [userCity, userCountry]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'discord':
        return <MessageCircle className="h-5 w-5" />;
      case 'telegram':
        return <Send className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5" />;
      case 'meetup':
        return <Calendar className="h-5 w-5" />;
      case 'linkedin':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'discord':
        return 'bg-[#5865F2] hover:bg-[#4752C4]';
      case 'telegram':
        return 'bg-[#0088cc] hover:bg-[#006699]';
      case 'facebook':
        return 'bg-[#1877F2] hover:bg-[#166FE5]';
      case 'whatsapp':
        return 'bg-[#25D366] hover:bg-[#20BA5A]';
      case 'meetup':
        return 'bg-[#ED1C40] hover:bg-[#D11838]';
      case 'linkedin':
        return 'bg-[#0A66C2] hover:bg-[#004182]';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business':
        return <Briefcase className="h-4 w-4" />;
      case 'Sports':
        return <Dumbbell className="h-4 w-4" />;
      case 'Hobbies':
        return <Palette className="h-4 w-4" />;
      case 'Tech':
        return <Code className="h-4 w-4" />;
      case 'Arts':
        return <Camera className="h-4 w-4" />;
      case 'Music':
        return <Music className="h-4 w-4" />;
      case 'Social':
        return <Heart className="h-4 w-4" />;
      case 'Wellness':
        return <Heart className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const clearAllFilters = () => {
    setSelectedPlatform('all');
    setSelectedCategory('All Categories');
    setSelectedCity('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Local Community Groups</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold text-foreground">{userCity}, {userCountry}</span>
          - Connect with {communityGroups.length}+ communities worldwide
        </p>
      </div>

      {/* Top Local Groups */}
      {topLocalGroups.length > 0 && (
        <Card className="border-primary/20 shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Groups in Your Area
            </CardTitle>
            <CardDescription>Most popular communities near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topLocalGroups.map((group) => (
                <Card key={group.id} className="gradient-card hover-lift">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${getPlatformColor(group.platform)} text-white`}>
                        {getPlatformIcon(group.platform)}
                      </div>
                      {group.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{group.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {getCategoryIcon(group.category)}
                        {group.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {formatMembers(group.members)}
                      </Badge>
                      <Button
                        size="sm"
                        className={`${getPlatformColor(group.platform)} text-white text-xs`}
                        onClick={() => window.open(group.link, '_blank')}
                      >
                        Join <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Find Your Community
          </CardTitle>
          <CardDescription>
            Search and filter from {communityGroups.length}+ groups across 100+ cities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups, cities, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          {category !== 'All Categories' && getCategoryIcon(category)}
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50 max-h-[300px]">
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="discord">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Discord
                      </div>
                    </SelectItem>
                    <SelectItem value="telegram">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Telegram
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </div>
                    </SelectItem>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="meetup">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Meetup
                      </div>
                    </SelectItem>
                    <SelectItem value="linkedin">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        LinkedIn
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedPlatform !== 'all' || selectedCategory !== 'All Categories' || selectedCity !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredGroups.length} result{filteredGroups.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div>
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover-lift">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${getPlatformColor(group.platform)} text-white`}>
                      {getPlatformIcon(group.platform)}
                    </div>
                    {group.verified && (
                      <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-1 line-clamp-1">{group.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />
                      {group.location}, {group.country}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      {getCategoryIcon(group.category)}
                      {group.category}
                    </Badge>
                    <Badge className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {formatMembers(group.members)}
                    </Badge>
                  </div>

                  <Button
                    className={`w-full ${getPlatformColor(group.platform)} text-white`}
                    onClick={() => window.open(group.link, '_blank')}
                  >
                    Join Group <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No groups found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Footer */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{communityGroups.length}+</p>
              <p className="text-sm text-muted-foreground">Total Groups</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{cities.length - 1}</p>
              <p className="text-sm text-muted-foreground">Cities Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{platforms.length - 1}</p>
              <p className="text-sm text-muted-foreground">Platforms</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalNomads;