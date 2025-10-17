import React, { useState, useMemo } from 'react';
import { GraduationCap, MapPin, Filter, ExternalLink, MessageCircle, Send, Facebook, Search, Users, Globe, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LocationData } from '@/types/country';

interface StudentsProps {
  currentLocation?: LocationData | null;
}

interface StudentGroup {
  id: string;
  name: string;
  platform: 'discord' | 'telegram' | 'facebook' | 'whatsapp';
  location: string;
  country: string;
  university: string;
  members: number;
  topic: string;
  description: string;
  link: string;
  verified: boolean;
}

const studentGroups: StudentGroup[] = [
  // North America - Boston/Cambridge
  { id: 'd1', name: 'MIT Students Hub', platform: 'discord', location: 'Boston', country: 'USA', university: 'MIT', members: 12500, topic: 'General', description: 'Official MIT student community', link: 'https://discord.gg/mit', verified: true },
  { id: 'd2', name: 'Harvard Study Groups', platform: 'discord', location: 'Boston', country: 'USA', university: 'Harvard', members: 15200, topic: 'Study Groups', description: 'Collaborative learning community', link: 'https://discord.gg/harvard', verified: true },
  { id: 'd3', name: 'Boston International Students', platform: 'discord', location: 'Boston', country: 'USA', university: 'Multiple', members: 8700, topic: 'International Students', description: 'Connect with students worldwide', link: 'https://discord.gg/boston-intl', verified: true },
  { id: 't1', name: 'MIT International Chat', platform: 'telegram', location: 'Boston', country: 'USA', university: 'MIT', members: 6800, topic: 'International Students', description: 'Daily discussions for international students', link: 'https://t.me/mit_intl', verified: true },
  { id: 't2', name: 'Harvard Housing Help', platform: 'telegram', location: 'Boston', country: 'USA', university: 'Harvard', members: 5200, topic: 'Housing', description: 'Find apartments and roommates', link: 'https://t.me/harvard_housing', verified: true },
  { id: 't3', name: 'Boston Student Jobs', platform: 'telegram', location: 'Boston', country: 'USA', university: 'Multiple', members: 9100, topic: 'Part-time Jobs', description: 'Part-time job opportunities', link: 'https://t.me/boston_jobs', verified: true },
  { id: 'f1', name: 'MIT Students Official', platform: 'facebook', location: 'Boston', country: 'USA', university: 'MIT', members: 28500, topic: 'General', description: 'Official MIT student Facebook group', link: 'https://facebook.com/groups/mit', verified: true },
  { id: 'f2', name: 'Harvard Class of 2025', platform: 'facebook', location: 'Boston', country: 'USA', university: 'Harvard', members: 21300, topic: 'General', description: 'Class networking and events', link: 'https://facebook.com/groups/harvard25', verified: true },
  { id: 'f3', name: 'Boston Student Marketplace', platform: 'facebook', location: 'Boston', country: 'USA', university: 'Multiple', members: 34200, topic: 'General', description: 'Buy, sell, and trade student items', link: 'https://facebook.com/groups/boston-market', verified: true },
  
  // North America - New York
  { id: 'ny1', name: 'NYU Student Network', platform: 'discord', location: 'New York', country: 'USA', university: 'NYU', members: 18900, topic: 'General', description: 'NYU community hub', link: 'https://discord.gg/nyu', verified: true },
  { id: 'ny2', name: 'Columbia Tech Hub', platform: 'discord', location: 'New York', country: 'USA', university: 'Columbia', members: 14300, topic: 'Study Groups', description: 'Tech and CS students', link: 'https://discord.gg/columbia', verified: true },
  { id: 'ny3', name: 'NYC Student Housing', platform: 'telegram', location: 'New York', country: 'USA', university: 'Multiple', members: 22400, topic: 'Housing', description: 'Find affordable NYC housing', link: 'https://t.me/nyc_housing', verified: true },
  { id: 'ny4', name: 'NYU International', platform: 'facebook', location: 'New York', country: 'USA', university: 'NYU', members: 38600, topic: 'International Students', description: 'International student community', link: 'https://facebook.com/groups/nyu-intl', verified: true },
  
  // North America - Los Angeles
  { id: 'la1', name: 'UCLA Bruins Community', platform: 'discord', location: 'Los Angeles', country: 'USA', university: 'UCLA', members: 16700, topic: 'General', description: 'Official UCLA student Discord', link: 'https://discord.gg/ucla', verified: true },
  { id: 'la2', name: 'USC Trojans Network', platform: 'discord', location: 'Los Angeles', country: 'USA', university: 'USC', members: 15200, topic: 'General', description: 'USC student community', link: 'https://discord.gg/usc', verified: true },
  { id: 'la3', name: 'LA Student Film', platform: 'telegram', location: 'Los Angeles', country: 'USA', university: 'Multiple', members: 8900, topic: 'Arts & Film', description: 'Film students collaboration', link: 'https://t.me/la_film', verified: true },
  { id: 'la4', name: 'UCLA Housing & Roommates', platform: 'facebook', location: 'Los Angeles', country: 'USA', university: 'UCLA', members: 29400, topic: 'Housing', description: 'Find UCLA housing', link: 'https://facebook.com/groups/ucla-housing', verified: true },
  
  // North America - San Francisco
  { id: 'sf1', name: 'Stanford Students', platform: 'discord', location: 'San Francisco', country: 'USA', university: 'Stanford', members: 17800, topic: 'General', description: 'Stanford community hub', link: 'https://discord.gg/stanford', verified: true },
  { id: 'sf2', name: 'Berkeley Tech Community', platform: 'discord', location: 'San Francisco', country: 'USA', university: 'UC Berkeley', members: 19200, topic: 'Study Groups', description: 'CS and engineering students', link: 'https://discord.gg/berkeley', verified: true },
  { id: 'sf3', name: 'Bay Area Student Startups', platform: 'telegram', location: 'San Francisco', country: 'USA', university: 'Multiple', members: 11300, topic: 'Entrepreneurship', description: 'Student entrepreneurs network', link: 'https://t.me/bayarea_startups', verified: true },
  { id: 'sf4', name: 'Stanford Career Network', platform: 'facebook', location: 'San Francisco', country: 'USA', university: 'Stanford', members: 24600, topic: 'Career', description: 'Career opportunities and advice', link: 'https://facebook.com/groups/stanford-career', verified: true },
  
  // North America - Toronto
  { id: 'tor1', name: 'University of Toronto', platform: 'discord', location: 'Toronto', country: 'Canada', university: 'UofT', members: 21400, topic: 'General', description: 'UofT student community', link: 'https://discord.gg/uoft', verified: true },
  { id: 'tor2', name: 'Toronto International Students', platform: 'telegram', location: 'Toronto', country: 'Canada', university: 'Multiple', members: 13200, topic: 'International Students', description: 'International student support', link: 'https://t.me/toronto_intl', verified: true },
  { id: 'tor3', name: 'UofT Study Groups', platform: 'facebook', location: 'Toronto', country: 'Canada', university: 'UofT', members: 52300, topic: 'Study Groups', description: 'Largest UofT student community', link: 'https://facebook.com/groups/uoft', verified: true },
  { id: 'tor4', name: 'Toronto Student Jobs', platform: 'facebook', location: 'Toronto', country: 'Canada', university: 'Multiple', members: 31800, topic: 'Part-time Jobs', description: 'Job postings for students', link: 'https://facebook.com/groups/toronto-jobs', verified: true },
  
  // North America - Montreal
  { id: 'mtl1', name: 'McGill Students Hub', platform: 'discord', location: 'Montreal', country: 'Canada', university: 'McGill', members: 14700, topic: 'General', description: 'McGill University community', link: 'https://discord.gg/mcgill', verified: true },
  { id: 'mtl2', name: 'Montreal Language Exchange', platform: 'telegram', location: 'Montreal', country: 'Canada', university: 'Multiple', members: 9800, topic: 'Language Exchange', description: 'French and English practice', link: 'https://t.me/mtl_lang', verified: true },
  { id: 'mtl3', name: 'McGill Housing', platform: 'facebook', location: 'Montreal', country: 'Canada', university: 'McGill', members: 27400, topic: 'Housing', description: 'Find Montreal housing', link: 'https://facebook.com/groups/mcgill-housing', verified: true },
  
  // North America - Vancouver
  { id: 'van1', name: 'UBC Students Network', platform: 'discord', location: 'Vancouver', country: 'Canada', university: 'UBC', members: 18200, topic: 'General', description: 'University of British Columbia', link: 'https://discord.gg/ubc', verified: true },
  { id: 'van2', name: 'Vancouver Student Life', platform: 'telegram', location: 'Vancouver', country: 'Canada', university: 'Multiple', members: 11700, topic: 'Social Events', description: 'Student events and activities', link: 'https://t.me/van_life', verified: true },
  { id: 'van3', name: 'UBC International', platform: 'facebook', location: 'Vancouver', country: 'Canada', university: 'UBC', members: 34100, topic: 'International Students', description: 'International student community', link: 'https://facebook.com/groups/ubc-intl', verified: true },
  
  // Europe - London
  { id: 'ld1', name: 'UCL Student Network', platform: 'discord', location: 'London', country: 'UK', university: 'UCL', members: 18900, topic: 'General', description: 'University College London community', link: 'https://discord.gg/ucl', verified: true },
  { id: 'ld2', name: 'Imperial College Tech', platform: 'discord', location: 'London', country: 'UK', university: 'Imperial', members: 14300, topic: 'Study Groups', description: 'Tech and engineering students', link: 'https://discord.gg/imperial', verified: true },
  { id: 'ld3', name: 'London Student Housing', platform: 'discord', location: 'London', country: 'UK', university: 'Multiple', members: 11200, topic: 'Housing', description: 'Find accommodation and roommates', link: 'https://discord.gg/london-housing', verified: true },
  { id: 'ld4', name: 'UCL Study Buddies', platform: 'telegram', location: 'London', country: 'UK', university: 'UCL', members: 7300, topic: 'Study Groups', description: 'Find study partners for exams', link: 'https://t.me/ucl_study', verified: true },
  { id: 'ld5', name: 'Imperial Events', platform: 'telegram', location: 'London', country: 'UK', university: 'Imperial', members: 6500, topic: 'Social Events', description: 'Weekly student events and parties', link: 'https://t.me/imperial_events', verified: true },
  { id: 'ld6', name: 'London Student Deals', platform: 'telegram', location: 'London', country: 'UK', university: 'Multiple', members: 12400, topic: 'General', description: 'Discounts and student offers', link: 'https://t.me/london_deals', verified: true },
  { id: 'ld7', name: 'UCL Students 2024/25', platform: 'facebook', location: 'London', country: 'UK', university: 'UCL', members: 32800, topic: 'General', description: 'Official UCL student community', link: 'https://facebook.com/groups/ucl', verified: true },
  { id: 'ld8', name: 'Imperial College Students', platform: 'facebook', location: 'London', country: 'UK', university: 'Imperial', members: 27600, topic: 'General', description: 'Imperial College community', link: 'https://facebook.com/groups/imperial', verified: true },
  { id: 'ld9', name: 'London International Students', platform: 'facebook', location: 'London', country: 'UK', university: 'Multiple', members: 45900, topic: 'International Students', description: 'Largest London student community', link: 'https://facebook.com/groups/london-intl', verified: true },
  { id: 'ld10', name: 'LSE Economics Society', platform: 'whatsapp', location: 'London', country: 'UK', university: 'LSE', members: 890, topic: 'Study Groups', description: 'LSE economics students group', link: 'https://chat.whatsapp.com/example', verified: true },
  
  // Europe - Berlin
  { id: 'ber1', name: 'TU Berlin Students', platform: 'discord', location: 'Berlin', country: 'Germany', university: 'TU Berlin', members: 9800, topic: 'General', description: 'Technical University community', link: 'https://discord.gg/tuberlin', verified: true },
  { id: 'ber2', name: 'Berlin Language Exchange', platform: 'discord', location: 'Berlin', country: 'Germany', university: 'Multiple', members: 7600, topic: 'Language Exchange', description: 'Practice German and other languages', link: 'https://discord.gg/berlin-lang', verified: true },
  { id: 'ber3', name: 'Humboldt University Hub', platform: 'discord', location: 'Berlin', country: 'Germany', university: 'Humboldt', members: 11400, topic: 'General', description: 'Humboldt University students', link: 'https://discord.gg/humboldt', verified: true },
  { id: 'ber4', name: 'Berlin Student Housing', platform: 'telegram', location: 'Berlin', country: 'Germany', university: 'Multiple', members: 15700, topic: 'Housing', description: 'Find affordable Berlin housing', link: 'https://t.me/berlin_housing', verified: true },
  { id: 'ber5', name: 'Berlin Startup Students', platform: 'facebook', location: 'Berlin', country: 'Germany', university: 'Multiple', members: 18900, topic: 'Entrepreneurship', description: 'Student entrepreneurs in Berlin', link: 'https://facebook.com/groups/berlin-startups', verified: true },
  
  // Europe - Paris
  { id: 'par1', name: 'Sorbonne Students', platform: 'discord', location: 'Paris', country: 'France', university: 'Sorbonne', members: 12300, topic: 'General', description: 'Sorbonne University community', link: 'https://discord.gg/sorbonne', verified: true },
  { id: 'par2', name: 'Paris Language Practice', platform: 'telegram', location: 'Paris', country: 'France', university: 'Multiple', members: 5700, topic: 'Language Exchange', description: 'Practice French with natives', link: 'https://t.me/paris_lang', verified: true },
  { id: 'par3', name: 'Sciences Po Network', platform: 'telegram', location: 'Paris', country: 'France', university: 'Sciences Po', members: 8400, topic: 'General', description: 'Sciences Po student community', link: 'https://t.me/sciencespo', verified: true },
  { id: 'par4', name: 'Sorbonne Étudiants', platform: 'facebook', location: 'Paris', country: 'France', university: 'Sorbonne', members: 19200, topic: 'General', description: 'Communauté étudiante Sorbonne', link: 'https://facebook.com/groups/sorbonne', verified: true },
  { id: 'par5', name: 'Paris Student Life', platform: 'facebook', location: 'Paris', country: 'France', university: 'Multiple', members: 38400, topic: 'Social Events', description: 'Events and activities in Paris', link: 'https://facebook.com/groups/paris-life', verified: true },
  
  // Europe - Amsterdam
  { id: 'ams1', name: 'UvA Student Community', platform: 'discord', location: 'Amsterdam', country: 'Netherlands', university: 'UvA', members: 13600, topic: 'General', description: 'University of Amsterdam', link: 'https://discord.gg/uva', verified: true },
  { id: 'ams2', name: 'Amsterdam International', platform: 'telegram', location: 'Amsterdam', country: 'Netherlands', university: 'Multiple', members: 9200, topic: 'International Students', description: 'International student network', link: 'https://t.me/ams_intl', verified: true },
  { id: 'ams3', name: 'VU Amsterdam Students', platform: 'facebook', location: 'Amsterdam', country: 'Netherlands', university: 'VU', members: 24700, topic: 'General', description: 'Vrije Universiteit community', link: 'https://facebook.com/groups/vu-ams', verified: true },
  
  // Europe - Barcelona
  { id: 'bcn1', name: 'UB Students Network', platform: 'discord', location: 'Barcelona', country: 'Spain', university: 'UB', members: 10800, topic: 'General', description: 'University of Barcelona', link: 'https://discord.gg/ub', verified: true },
  { id: 'bcn2', name: 'Barcelona Language Exchange', platform: 'telegram', location: 'Barcelona', country: 'Spain', university: 'Multiple', members: 7400, topic: 'Language Exchange', description: 'Spanish and Catalan practice', link: 'https://t.me/bcn_lang', verified: true },
  { id: 'bcn3', name: 'Barcelona Student Life', platform: 'facebook', location: 'Barcelona', country: 'Spain', university: 'Multiple', members: 28600, topic: 'Social Events', description: 'Student events in Barcelona', link: 'https://facebook.com/groups/bcn-students', verified: true },
  
  // Europe - Madrid
  { id: 'mad1', name: 'UCM Students Hub', platform: 'discord', location: 'Madrid', country: 'Spain', university: 'UCM', members: 11900, topic: 'General', description: 'Complutense University Madrid', link: 'https://discord.gg/ucm', verified: true },
  { id: 'mad2', name: 'Madrid International', platform: 'telegram', location: 'Madrid', country: 'Spain', university: 'Multiple', members: 8700, topic: 'International Students', description: 'International students in Madrid', link: 'https://t.me/mad_intl', verified: true },
  { id: 'mad3', name: 'Madrid Student Housing', platform: 'facebook', location: 'Madrid', country: 'Spain', university: 'Multiple', members: 22400, topic: 'Housing', description: 'Find housing in Madrid', link: 'https://facebook.com/groups/mad-housing', verified: true },
  
  // Europe - Rome
  { id: 'rom1', name: 'La Sapienza Students', platform: 'discord', location: 'Rome', country: 'Italy', university: 'Sapienza', members: 12700, topic: 'General', description: 'Sapienza University of Rome', link: 'https://discord.gg/sapienza', verified: true },
  { id: 'rom2', name: 'Rome International Students', platform: 'telegram', location: 'Rome', country: 'Italy', university: 'Multiple', members: 6800, topic: 'International Students', description: 'International student community', link: 'https://t.me/rome_intl', verified: true },
  { id: 'rom3', name: 'Roma Student Life', platform: 'facebook', location: 'Rome', country: 'Italy', university: 'Multiple', members: 19800, topic: 'Social Events', description: 'Student life in Rome', link: 'https://facebook.com/groups/rome-students', verified: true },
  
  // Europe - Milan
  { id: 'mil1', name: 'Politecnico Milano', platform: 'discord', location: 'Milan', country: 'Italy', university: 'Polimi', members: 14200, topic: 'General', description: 'Politecnico di Milano', link: 'https://discord.gg/polimi', verified: true },
  { id: 'mil2', name: 'Milan Fashion Students', platform: 'telegram', location: 'Milan', country: 'Italy', university: 'Multiple', members: 5600, topic: 'Arts & Design', description: 'Fashion and design students', link: 'https://t.me/milan_fashion', verified: true },
  { id: 'mil3', name: 'Bocconi Students', platform: 'facebook', location: 'Milan', country: 'Italy', university: 'Bocconi', members: 16700, topic: 'General', description: 'Bocconi University community', link: 'https://facebook.com/groups/bocconi', verified: true },
  
  // Europe - Stockholm
  { id: 'sto1', name: 'KTH Students Network', platform: 'discord', location: 'Stockholm', country: 'Sweden', university: 'KTH', members: 11400, topic: 'General', description: 'Royal Institute of Technology', link: 'https://discord.gg/kth', verified: true },
  { id: 'sto2', name: 'Stockholm International', platform: 'telegram', location: 'Stockholm', country: 'Sweden', university: 'Multiple', members: 7800, topic: 'International Students', description: 'International students network', link: 'https://t.me/sto_intl', verified: true },
  { id: 'sto3', name: 'Stockholm University', platform: 'facebook', location: 'Stockholm', country: 'Sweden', university: 'SU', members: 21300, topic: 'General', description: 'Stockholm University students', link: 'https://facebook.com/groups/su-stockholm', verified: true },
  
  // Europe - Copenhagen
  { id: 'cph1', name: 'Copenhagen University', platform: 'discord', location: 'Copenhagen', country: 'Denmark', university: 'KU', members: 10600, topic: 'General', description: 'University of Copenhagen', link: 'https://discord.gg/ku', verified: true },
  { id: 'cph2', name: 'DTU Students Hub', platform: 'telegram', location: 'Copenhagen', country: 'Denmark', university: 'DTU', members: 8300, topic: 'General', description: 'Technical University of Denmark', link: 'https://t.me/dtu', verified: true },
  { id: 'cph3', name: 'Copenhagen Student Life', platform: 'facebook', location: 'Copenhagen', country: 'Denmark', university: 'Multiple', members: 18900, topic: 'Social Events', description: 'Student activities in Copenhagen', link: 'https://facebook.com/groups/cph-students', verified: true },
  
  // Asia - Singapore
  { id: 'sg1', name: 'NUS Student Community', platform: 'discord', location: 'Singapore', country: 'Singapore', university: 'NUS', members: 16700, topic: 'General', description: 'National University of Singapore', link: 'https://discord.gg/nus', verified: true },
  { id: 'sg2', name: 'NTU Career Hub', platform: 'discord', location: 'Singapore', country: 'Singapore', university: 'NTU', members: 13400, topic: 'Career', description: 'Career advice and opportunities', link: 'https://discord.gg/ntu', verified: true },
  { id: 'sg3', name: 'SMU Business Network', platform: 'discord', location: 'Singapore', country: 'Singapore', university: 'SMU', members: 9800, topic: 'Career', description: 'SMU business students', link: 'https://discord.gg/smu', verified: true },
  { id: 'sg4', name: 'Singapore Student Housing', platform: 'telegram', location: 'Singapore', country: 'Singapore', university: 'Multiple', members: 11200, topic: 'Housing', description: 'Find student accommodation', link: 'https://t.me/sg_housing', verified: true },
  { id: 'sg5', name: 'NUS Students Official', platform: 'facebook', location: 'Singapore', country: 'Singapore', university: 'NUS', members: 41200, topic: 'General', description: 'National University of Singapore', link: 'https://facebook.com/groups/nus', verified: true },
  { id: 'sg6', name: 'Singapore Student Housing', platform: 'facebook', location: 'Singapore', country: 'Singapore', university: 'Multiple', members: 29700, topic: 'Housing', description: 'Find student accommodation', link: 'https://facebook.com/groups/sg-housing', verified: true },
  
  // Asia - Tokyo
  { id: 'tky1', name: 'Tokyo Uni International', platform: 'discord', location: 'Tokyo', country: 'Japan', university: 'University of Tokyo', members: 9200, topic: 'International Students', description: 'UTokyo international students', link: 'https://discord.gg/utokyo', verified: true },
  { id: 'tky2', name: 'Waseda University Hub', platform: 'discord', location: 'Tokyo', country: 'Japan', university: 'Waseda', members: 8700, topic: 'General', description: 'Waseda University community', link: 'https://discord.gg/waseda', verified: true },
  { id: 'tky3', name: 'Tokyo Student Housing', platform: 'telegram', location: 'Tokyo', country: 'Japan', university: 'Multiple', members: 6200, topic: 'Housing', description: 'Affordable student housing', link: 'https://t.me/tokyo_housing', verified: true },
  { id: 'tky4', name: 'Tokyo Language Exchange', platform: 'telegram', location: 'Tokyo', country: 'Japan', university: 'Multiple', members: 9400, topic: 'Language Exchange', description: 'Japanese language practice', link: 'https://t.me/tokyo_lang', verified: true },
  { id: 'tky5', name: 'Tokyo International Students', platform: 'facebook', location: 'Tokyo', country: 'Japan', university: 'Multiple', members: 24600, topic: 'International Students', description: 'International student community', link: 'https://facebook.com/groups/tokyo-intl', verified: true },
  
  // Asia - Hong Kong
  { id: 'hk1', name: 'HKU Students Network', platform: 'discord', location: 'Hong Kong', country: 'Hong Kong', university: 'HKU', members: 12300, topic: 'General', description: 'University of Hong Kong', link: 'https://discord.gg/hku', verified: true },
  { id: 'hk2', name: 'CUHK Community', platform: 'discord', location: 'Hong Kong', country: 'Hong Kong', university: 'CUHK', members: 11800, topic: 'General', description: 'Chinese University of Hong Kong', link: 'https://discord.gg/cuhk', verified: true },
  { id: 'hk3', name: 'Hong Kong Student Life', platform: 'telegram', location: 'Hong Kong', country: 'Hong Kong', university: 'Multiple', members: 8900, topic: 'Social Events', description: 'Student events and activities', link: 'https://t.me/hk_life', verified: true },
  { id: 'hk4', name: 'HK International Students', platform: 'facebook', location: 'Hong Kong', country: 'Hong Kong', university: 'Multiple', members: 27400, topic: 'International Students', description: 'International student network', link: 'https://facebook.com/groups/hk-intl', verified: true },
  
  // Asia - Seoul
  { id: 'sel1', name: 'SNU Students Hub', platform: 'discord', location: 'Seoul', country: 'South Korea', university: 'SNU', members: 14700, topic: 'General', description: 'Seoul National University', link: 'https://discord.gg/snu', verified: true },
  { id: 'sel2', name: 'Yonsei University', platform: 'discord', location: 'Seoul', country: 'South Korea', university: 'Yonsei', members: 13200, topic: 'General', description: 'Yonsei University community', link: 'https://discord.gg/yonsei', verified: true },
  { id: 'sel3', name: 'Korea University Network', platform: 'discord', location: 'Seoul', country: 'South Korea', university: 'Korea U', members: 12900, topic: 'General', description: 'Korea University students', link: 'https://discord.gg/korea-u', verified: true },
  { id: 'sel4', name: 'Seoul International', platform: 'telegram', location: 'Seoul', country: 'South Korea', university: 'Multiple', members: 10400, topic: 'International Students', description: 'International students in Seoul', link: 'https://t.me/seoul_intl', verified: true },
  { id: 'sel5', name: 'Seoul Student Life', platform: 'facebook', location: 'Seoul', country: 'South Korea', university: 'Multiple', members: 32100, topic: 'Social Events', description: 'Student activities in Seoul', link: 'https://facebook.com/groups/seoul-students', verified: true },
  
  // Asia - Beijing
  { id: 'bj1', name: 'Peking University', platform: 'discord', location: 'Beijing', country: 'China', university: 'PKU', members: 11600, topic: 'General', description: 'Peking University community', link: 'https://discord.gg/pku', verified: true },
  { id: 'bj2', name: 'Tsinghua Students', platform: 'discord', location: 'Beijing', country: 'China', university: 'Tsinghua', members: 12400, topic: 'General', description: 'Tsinghua University network', link: 'https://discord.gg/tsinghua', verified: true },
  { id: 'bj3', name: 'Beijing International', platform: 'telegram', location: 'Beijing', country: 'China', university: 'Multiple', members: 8700, topic: 'International Students', description: 'International student support', link: 'https://t.me/beijing_intl', verified: true },
  
  // Asia - Shanghai
  { id: 'sh1', name: 'Fudan University Hub', platform: 'discord', location: 'Shanghai', country: 'China', university: 'Fudan', members: 10900, topic: 'General', description: 'Fudan University students', link: 'https://discord.gg/fudan', verified: true },
  { id: 'sh2', name: 'SJTU Network', platform: 'discord', location: 'Shanghai', country: 'China', university: 'SJTU', members: 11700, topic: 'General', description: 'Shanghai Jiao Tong University', link: 'https://discord.gg/sjtu', verified: true },
  { id: 'sh3', name: 'Shanghai International', platform: 'telegram', location: 'Shanghai', country: 'China', university: 'Multiple', members: 9300, topic: 'International Students', description: 'International students network', link: 'https://t.me/shanghai_intl', verified: true },
  
  // Asia - Bangkok
  { id: 'bkk1', name: 'Chula Students Network', platform: 'discord', location: 'Bangkok', country: 'Thailand', university: 'Chulalongkorn', members: 8900, topic: 'General', description: 'Chulalongkorn University', link: 'https://discord.gg/chula', verified: true },
  { id: 'bkk2', name: 'Bangkok International', platform: 'telegram', location: 'Bangkok', country: 'Thailand', university: 'Multiple', members: 7200, topic: 'International Students', description: 'International student community', link: 'https://t.me/bkk_intl', verified: true },
  { id: 'bkk3', name: 'Bangkok Student Life', platform: 'facebook', location: 'Bangkok', country: 'Thailand', university: 'Multiple', members: 21800, topic: 'Social Events', description: 'Student events in Bangkok', link: 'https://facebook.com/groups/bkk-students', verified: true },
  
  // Asia - Mumbai
  { id: 'mum1', name: 'IIT Bombay Network', platform: 'discord', location: 'Mumbai', country: 'India', university: 'IIT Bombay', members: 13800, topic: 'General', description: 'IIT Bombay student community', link: 'https://discord.gg/iitb', verified: true },
  { id: 'mum2', name: 'Mumbai University Hub', platform: 'telegram', location: 'Mumbai', country: 'India', university: 'Mumbai U', members: 16400, topic: 'General', description: 'Mumbai University students', link: 'https://t.me/mumbai_u', verified: true },
  { id: 'mum3', name: 'Mumbai Student Housing', platform: 'facebook', location: 'Mumbai', country: 'India', university: 'Multiple', members: 28900, topic: 'Housing', description: 'Find student accommodation', link: 'https://facebook.com/groups/mumbai-housing', verified: true },
  { id: 'mum4', name: 'IIT Bombay Tech', platform: 'whatsapp', location: 'Mumbai', country: 'India', university: 'IIT Bombay', members: 980, topic: 'Study Groups', description: 'Tech and CS discussions', link: 'https://chat.whatsapp.com/iitb', verified: true },
  
  // Asia - Delhi
  { id: 'del1', name: 'IIT Delhi Students', platform: 'discord', location: 'Delhi', country: 'India', university: 'IIT Delhi', members: 14200, topic: 'General', description: 'IIT Delhi community', link: 'https://discord.gg/iitd', verified: true },
  { id: 'del2', name: 'Delhi University Hub', platform: 'telegram', location: 'Delhi', country: 'India', university: 'DU', members: 18700, topic: 'General', description: 'Delhi University students', link: 'https://t.me/du', verified: true },
  { id: 'del3', name: 'Delhi Student Network', platform: 'facebook', location: 'Delhi', country: 'India', university: 'Multiple', members: 34600, topic: 'General', description: 'Delhi student community', link: 'https://facebook.com/groups/delhi-students', verified: true },
  
  // Asia - Bangalore
  { id: 'blr1', name: 'IISc Bangalore', platform: 'discord', location: 'Bangalore', country: 'India', university: 'IISc', members: 9800, topic: 'General', description: 'Indian Institute of Science', link: 'https://discord.gg/iisc', verified: true },
  { id: 'blr2', name: 'Bangalore Tech Students', platform: 'telegram', location: 'Bangalore', country: 'India', university: 'Multiple', members: 12300, topic: 'Study Groups', description: 'Tech and engineering students', link: 'https://t.me/blr_tech', verified: true },
  { id: 'blr3', name: 'Bangalore Student Startups', platform: 'facebook', location: 'Bangalore', country: 'India', university: 'Multiple', members: 19400, topic: 'Entrepreneurship', description: 'Student entrepreneurs network', link: 'https://facebook.com/groups/blr-startups', verified: true },
  
  // Oceania - Sydney
  { id: 'syd1', name: 'USYD Students Network', platform: 'discord', location: 'Sydney', country: 'Australia', university: 'USYD', members: 15700, topic: 'General', description: 'University of Sydney', link: 'https://discord.gg/usyd', verified: true },
  { id: 'syd2', name: 'UNSW Community', platform: 'discord', location: 'Sydney', country: 'Australia', university: 'UNSW', members: 16200, topic: 'General', description: 'University of New South Wales', link: 'https://discord.gg/unsw', verified: true },
  { id: 'syd3', name: 'Sydney International', platform: 'telegram', location: 'Sydney', country: 'Australia', university: 'Multiple', members: 11800, topic: 'International Students', description: 'International student community', link: 'https://t.me/sydney_intl', verified: true },
  { id: 'syd4', name: 'Sydney Student Housing', platform: 'facebook', location: 'Sydney', country: 'Australia', university: 'Multiple', members: 31400, topic: 'Housing', description: 'Find student accommodation', link: 'https://facebook.com/groups/sydney-housing', verified: true },
  
  // Oceania - Melbourne
  { id: 'mel1', name: 'UniMelb Students', platform: 'discord', location: 'Melbourne', country: 'Australia', university: 'UniMelb', members: 17400, topic: 'General', description: 'University of Melbourne', link: 'https://discord.gg/unimelb', verified: true },
  { id: 'mel2', name: 'Monash University Hub', platform: 'discord', location: 'Melbourne', country: 'Australia', university: 'Monash', members: 14900, topic: 'General', description: 'Monash University community', link: 'https://discord.gg/monash', verified: true },
  { id: 'mel3', name: 'Melbourne Student Life', platform: 'telegram', location: 'Melbourne', country: 'Australia', university: 'Multiple', members: 10600, topic: 'Social Events', description: 'Student events and activities', link: 'https://t.me/melb_life', verified: true },
  { id: 'mel4', name: 'Melbourne International', platform: 'facebook', location: 'Melbourne', country: 'Australia', university: 'Multiple', members: 36700, topic: 'International Students', description: 'International student network', link: 'https://facebook.com/groups/melb-intl', verified: true },
  
  // Oceania - Auckland
  { id: 'akl1', name: 'Auckland University', platform: 'discord', location: 'Auckland', country: 'New Zealand', university: 'UoA', members: 11200, topic: 'General', description: 'University of Auckland', link: 'https://discord.gg/uoa', verified: true },
  { id: 'akl2', name: 'Auckland International', platform: 'telegram', location: 'Auckland', country: 'New Zealand', university: 'Multiple', members: 7800, topic: 'International Students', description: 'International student support', link: 'https://t.me/akl_intl', verified: true },
  { id: 'akl3', name: 'Auckland Student Life', platform: 'facebook', location: 'Auckland', country: 'New Zealand', university: 'Multiple', members: 19600, topic: 'Social Events', description: 'Student activities in Auckland', link: 'https://facebook.com/groups/akl-students', verified: true },
  
  // Latin America - Mexico City
  { id: 'mex1', name: 'UNAM Students Hub', platform: 'discord', location: 'Mexico City', country: 'Mexico', university: 'UNAM', members: 16800, topic: 'General', description: 'National Autonomous University', link: 'https://discord.gg/unam', verified: true },
  { id: 'mex2', name: 'México International', platform: 'telegram', location: 'Mexico City', country: 'Mexico', university: 'Multiple', members: 9400, topic: 'International Students', description: 'International student community', link: 'https://t.me/mex_intl', verified: true },
  { id: 'mex3', name: 'CDMX Student Life', platform: 'facebook', location: 'Mexico City', country: 'Mexico', university: 'Multiple', members: 27900, topic: 'Social Events', description: 'Student life in Mexico City', link: 'https://facebook.com/groups/cdmx-students', verified: true },
  
  // Latin America - São Paulo
  { id: 'sp1', name: 'USP Students Network', platform: 'discord', location: 'São Paulo', country: 'Brazil', university: 'USP', members: 18600, topic: 'General', description: 'University of São Paulo', link: 'https://discord.gg/usp', verified: true },
  { id: 'sp2', name: 'São Paulo International', platform: 'telegram', location: 'São Paulo', country: 'Brazil', university: 'Multiple', members: 10800, topic: 'International Students', description: 'International student network', link: 'https://t.me/sp_intl', verified: true },
  { id: 'sp3', name: 'São Paulo Student Life', platform: 'facebook', location: 'São Paulo', country: 'Brazil', university: 'Multiple', members: 32400, topic: 'Social Events', description: 'Student activities in São Paulo', link: 'https://facebook.com/groups/sp-students', verified: true },
  
  // Latin America - Buenos Aires
  { id: 'bue1', name: 'UBA Students Hub', platform: 'discord', location: 'Buenos Aires', country: 'Argentina', university: 'UBA', members: 14300, topic: 'General', description: 'University of Buenos Aires', link: 'https://discord.gg/uba', verified: true },
  { id: 'bue2', name: 'Buenos Aires International', platform: 'telegram', location: 'Buenos Aires', country: 'Argentina', university: 'Multiple', members: 8600, topic: 'International Students', description: 'International student community', link: 'https://t.me/bue_intl', verified: true },
  { id: 'bue3', name: 'Buenos Aires Student Life', platform: 'facebook', location: 'Buenos Aires', country: 'Argentina', university: 'Multiple', members: 24700, topic: 'Social Events', description: 'Student life in Buenos Aires', link: 'https://facebook.com/groups/bue-students', verified: true },
  
  // Middle East - Dubai
  { id: 'dxb1', name: 'AUD Students Network', platform: 'discord', location: 'Dubai', country: 'UAE', university: 'AUD', members: 7800, topic: 'General', description: 'American University in Dubai', link: 'https://discord.gg/aud', verified: true },
  { id: 'dxb2', name: 'Dubai International', platform: 'telegram', location: 'Dubai', country: 'UAE', university: 'Multiple', members: 9600, topic: 'International Students', description: 'International student hub', link: 'https://t.me/dubai_intl', verified: true },
  { id: 'dxb3', name: 'Dubai Student Life', platform: 'facebook', location: 'Dubai', country: 'UAE', university: 'Multiple', members: 18400, topic: 'Social Events', description: 'Student activities in Dubai', link: 'https://facebook.com/groups/dubai-students', verified: true },
  
  // Middle East - Istanbul
  { id: 'ist1', name: 'Boğaziçi University', platform: 'discord', location: 'Istanbul', country: 'Turkey', university: 'Boğaziçi', members: 11900, topic: 'General', description: 'Boğaziçi University students', link: 'https://discord.gg/boun', verified: true },
  { id: 'ist2', name: 'Istanbul International', platform: 'telegram', location: 'Istanbul', country: 'Turkey', university: 'Multiple', members: 8400, topic: 'International Students', description: 'International student network', link: 'https://t.me/istanbul_intl', verified: true },
  { id: 'ist3', name: 'Istanbul Student Life', platform: 'facebook', location: 'Istanbul', country: 'Turkey', university: 'Multiple', members: 26300, topic: 'Social Events', description: 'Student life in Istanbul', link: 'https://facebook.com/groups/istanbul-students', verified: true },
  
  // Africa - Cape Town
  { id: 'cpt1', name: 'UCT Students Network', platform: 'discord', location: 'Cape Town', country: 'South Africa', university: 'UCT', members: 9700, topic: 'General', description: 'University of Cape Town', link: 'https://discord.gg/uct', verified: true },
  { id: 'cpt2', name: 'Cape Town International', platform: 'telegram', location: 'Cape Town', country: 'South Africa', university: 'Multiple', members: 6400, topic: 'International Students', description: 'International student community', link: 'https://t.me/cpt_intl', verified: true },
  { id: 'cpt3', name: 'Cape Town Student Life', platform: 'facebook', location: 'Cape Town', country: 'South Africa', university: 'Multiple', members: 17800, topic: 'Social Events', description: 'Student activities in Cape Town', link: 'https://facebook.com/groups/cpt-students', verified: true },
  
  // Additional European cities
  { id: 'vie1', name: 'University of Vienna', platform: 'discord', location: 'Vienna', country: 'Austria', university: 'UniWien', members: 12100, topic: 'General', description: 'University of Vienna students', link: 'https://discord.gg/uniwien', verified: true },
  { id: 'zrh1', name: 'ETH Zurich Students', platform: 'discord', location: 'Zurich', country: 'Switzerland', university: 'ETH', members: 13600, topic: 'General', description: 'ETH Zurich community', link: 'https://discord.gg/eth', verified: true },
  { id: 'dub1', name: 'Trinity College Dublin', platform: 'discord', location: 'Dublin', country: 'Ireland', university: 'TCD', members: 11800, topic: 'General', description: 'Trinity College students', link: 'https://discord.gg/tcd', verified: true },
  { id: 'edi1', name: 'Edinburgh University', platform: 'discord', location: 'Edinburgh', country: 'UK', university: 'Edinburgh', members: 14700, topic: 'General', description: 'University of Edinburgh', link: 'https://discord.gg/edinburgh', verified: true },
  { id: 'pra1', name: 'Charles University Prague', platform: 'discord', location: 'Prague', country: 'Czech Republic', university: 'Charles U', members: 9400, topic: 'General', description: 'Charles University students', link: 'https://discord.gg/charles', verified: true },
];

const topics = ['All Topics', 'General', 'Study Groups', 'International Students', 'Housing', 'Part-time Jobs', 'Career', 'Social Events', 'Language Exchange', 'Arts & Design', 'Arts & Film', 'Entrepreneurship'];

const countries = ['All Countries', 'USA', 'Canada', 'UK', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'Denmark', 'Austria', 'Switzerland', 'Ireland', 'Czech Republic', 'Singapore', 'Japan', 'Hong Kong', 'South Korea', 'China', 'Thailand', 'India', 'Australia', 'New Zealand', 'Mexico', 'Brazil', 'Argentina', 'UAE', 'Turkey', 'South Africa'];

const cities = ['All Cities', 'Boston', 'New York', 'Los Angeles', 'San Francisco', 'Toronto', 'Montreal', 'Vancouver', 'London', 'Berlin', 'Paris', 'Amsterdam', 'Barcelona', 'Madrid', 'Rome', 'Milan', 'Stockholm', 'Copenhagen', 'Vienna', 'Zurich', 'Dublin', 'Edinburgh', 'Prague', 'Singapore', 'Tokyo', 'Hong Kong', 'Seoul', 'Beijing', 'Shanghai', 'Bangkok', 'Mumbai', 'Delhi', 'Bangalore', 'Sydney', 'Melbourne', 'Auckland', 'Mexico City', 'São Paulo', 'Buenos Aires', 'Dubai', 'Istanbul', 'Cape Town'];

const Students: React.FC<StudentsProps> = ({ currentLocation }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllGroups, setShowAllGroups] = useState<boolean>(false);

  // Detect user's location
  const userCity = currentLocation?.city || 'Boston';
  const userCountry = currentLocation?.country || 'USA';

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let filtered = studentGroups;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(group => group.platform === selectedPlatform);
    }

    // Filter by topic
    if (selectedTopic !== 'All Topics') {
      filtered = filtered.filter(group => group.topic === selectedTopic);
    }

    // Filter by country
    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(group => group.country === selectedCountry);
    }

    // Filter by city
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(group => group.location === selectedCity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(query) ||
        group.university.toLowerCase().includes(query) ||
        group.location.toLowerCase().includes(query) ||
        group.country.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query)
      );
    }

    // Limit display to 50 groups unless showing all
    if (!showAllGroups) {
      filtered = filtered.slice(0, 50);
    }

    return filtered;
  }, [selectedPlatform, selectedTopic, selectedCountry, selectedCity, searchQuery, showAllGroups]);

  // Get top 3 groups for user's location
  const topLocalGroups = useMemo(() => {
    return studentGroups
      .filter(group => group.location === userCity || group.country === userCountry)
      .sort((a, b) => b.members - a.members)
      .slice(0, 3);
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
      default:
        return <GraduationCap className="h-5 w-5" />;
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
        return 'bg-[#25D366] hover:bg-[#1DA851]';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">University Student Groups</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Currently showing groups for: <span className="font-semibold text-foreground">{userCity}, {userCountry}</span>
        </p>
      </div>

      {/* Top 3 Local Groups */}
      {topLocalGroups.length > 0 && (
        <Card className="border-primary/20 shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Top Student Groups in Your Area
            </CardTitle>
            <CardDescription>Most popular university communities near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <h3 className="font-semibold text-sm mb-1">{group.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{group.university}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {formatMembers(group.members)}
                      </Badge>
                      <Button
                        size="sm"
                        className={`${getPlatformColor(group.platform)} text-white`}
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
            Search & Filter Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, university, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Topic</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50 max-h-[300px]">
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50 max-h-[300px]">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="discord" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Discord
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPlatform} className="mt-6">
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
                    <h3 className="font-semibold mb-1">{group.name}</h3>
                    <p className="text-sm font-medium text-primary mb-1">{group.university}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />
                      {group.location}, {group.country}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {group.topic}
                    </Badge>
                    <Badge className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {formatMembers(group.members)} members
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

          {/* Load More Button */}
          {!showAllGroups && studentGroups.length > 50 && filteredGroups.length === 50 && (
            <div className="text-center mt-6">
              <Button onClick={() => setShowAllGroups(true)} variant="outline" size="lg">
                <Globe className="h-4 w-4 mr-2" />
                Show All {studentGroups.length} Groups Worldwide
              </Button>
            </div>
          )}

          {filteredGroups.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No groups found with the selected filters</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlatform('all');
                    setSelectedTopic('All Topics');
                    setSelectedCountry('All Countries');
                    setSelectedCity('All Cities');
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;
