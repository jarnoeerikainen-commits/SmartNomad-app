import { useState, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import BookingCards, { parseBookingBlocks } from '@/components/chat/BookingCards';
import {
  Plane, Users, Briefcase, GraduationCap, Baby, Heart,
  Mountain, Waves, Sun, Cloud, Snowflake,
  Wifi, Utensils, Dumbbell, Sparkles, MapPin, Calendar,
  DollarSign, Clock, Star, CheckCircle2,
  Search, Globe, Thermometer, Bike, Music,
  Camera, Tent, Palmtree, Building2, Compass,
  BookOpen, Wine, Sailboat, TreePine, Gamepad2,
  Swords, Trophy, ChevronRight, ArrowLeft, Bookmark, BookmarkCheck,
  X, SlidersHorizontal, Zap, RotateCcw, Loader2, Volume2, VolumeX,
  FileText, Mic, MicOff
} from 'lucide-react';

// ─── TRIP TYPES ─────────────────────────────────────────────
const TRIP_TYPES = [
  { id: 'business', label: 'Business Trip', icon: Briefcase, emoji: '💼',
    desc: 'Meetings, conferences & remote work', color: 'from-blue-500/20 to-blue-600/10',
    presets: { budget: 'luxury' as const, pace: 'moderate' as const, interests: ['coworking', 'fine-dining', 'city-walking'] }},
  { id: 'family', label: 'Family Holiday', icon: Baby, emoji: '👨‍👩‍👧‍👦',
    desc: 'Kid-friendly, safe & fun for everyone', color: 'from-green-500/20 to-green-600/10',
    presets: { budget: 'value' as const, pace: 'relaxed' as const, interests: ['theme-parks', 'beach', 'wildlife'] }},
  { id: 'friends', label: 'Friends Getaway', icon: Users, emoji: '🎉',
    desc: 'Group fun, nightlife & adventures', color: 'from-purple-500/20 to-purple-600/10',
    presets: { budget: 'value' as const, pace: 'active' as const, interests: ['nightlife', 'beach', 'food-tours'] }},
  { id: 'couple', label: 'Romantic Escape', icon: Heart, emoji: '💕',
    desc: 'Intimate, scenic & unforgettable', color: 'from-pink-500/20 to-pink-600/10',
    presets: { budget: 'luxury' as const, pace: 'relaxed' as const, interests: ['spa', 'wine-tasting', 'sunset-viewing'] }},
  { id: 'solo', label: 'Solo Adventure', icon: Compass, emoji: '🎒',
    desc: 'Freedom, discovery & self-growth', color: 'from-amber-500/20 to-amber-600/10',
    presets: { budget: 'budget' as const, pace: 'active' as const, interests: ['hiking', 'city-walking', 'food-tours'] }},
  { id: 'sports', label: 'Sports Holiday', icon: Trophy, emoji: '⚽',
    desc: 'Skiing, surfing, golf & more', color: 'from-red-500/20 to-red-600/10',
    presets: { budget: 'value' as const, pace: 'active' as const, interests: ['skiing', 'surfing', 'golf'] }},
  { id: 'wellness', label: 'Wellness Retreat', icon: Sparkles, emoji: '🧘',
    desc: 'Yoga, spa, detox & recharge', color: 'from-teal-500/20 to-teal-600/10',
    presets: { budget: 'luxury' as const, pace: 'relaxed' as const, interests: ['spa', 'yoga', 'hiking'] }},
  { id: 'digital-nomad', label: 'Digital Nomad', icon: Wifi, emoji: '💻',
    desc: 'Great WiFi, coworking & community', color: 'from-cyan-500/20 to-cyan-600/10',
    presets: { budget: 'budget' as const, pace: 'moderate' as const, interests: ['coworking', 'food-tours', 'nightlife'] }},
  { id: 'student', label: 'Student Trip', icon: GraduationCap, emoji: '📚',
    desc: 'Budget-friendly, culture & social', color: 'from-indigo-500/20 to-indigo-600/10',
    presets: { budget: 'budget' as const, pace: 'active' as const, interests: ['city-walking', 'nightlife', 'museums'] }},
  { id: 'senior', label: 'Relaxed Travel', icon: BookOpen, emoji: '🌿',
    desc: 'Comfortable, accessible & scenic', color: 'from-emerald-500/20 to-emerald-600/10',
    presets: { budget: 'value' as const, pace: 'relaxed' as const, interests: ['city-walking', 'food-tours', 'museums'] }},
  { id: 'adventure', label: 'Adventure Trip', icon: Mountain, emoji: '🏔️',
    desc: 'Extreme sports, wild nature & thrills', color: 'from-orange-500/20 to-orange-600/10',
    presets: { budget: 'value' as const, pace: 'active' as const, interests: ['hiking', 'mountaineering', 'paragliding'] }},
  { id: 'cultural', label: 'Cultural Journey', icon: Camera, emoji: '🎭',
    desc: 'History, art, cuisine & traditions', color: 'from-rose-500/20 to-rose-600/10',
    presets: { budget: 'value' as const, pace: 'moderate' as const, interests: ['museums', 'food-tours', 'city-walking'] }},
];

// ─── ACTIVITIES ─────────────────────────────────────────────
const ACTIVITY_OPTIONS = [
  { id: 'skiing', label: 'Skiing', icon: Snowflake, cat: 'sports' },
  { id: 'snowboarding', label: 'Snowboard', icon: Snowflake, cat: 'sports' },
  { id: 'surfing', label: 'Surfing', icon: Waves, cat: 'sports' },
  { id: 'golf', label: 'Golf', icon: Trophy, cat: 'sports' },
  { id: 'tennis', label: 'Tennis', icon: Swords, cat: 'sports' },
  { id: 'hiking', label: 'Hiking', icon: Mountain, cat: 'sports' },
  { id: 'mountaineering', label: 'Climbing', icon: Mountain, cat: 'sports' },
  { id: 'paragliding', label: 'Paragliding', icon: Plane, cat: 'sports' },
  { id: 'cycling', label: 'Cycling', icon: Bike, cat: 'sports' },
  { id: 'diving', label: 'Diving', icon: Waves, cat: 'sports' },
  { id: 'sailing', label: 'Sailing', icon: Sailboat, cat: 'sports' },
  { id: 'beach', label: 'Beach', icon: Palmtree, cat: 'leisure' },
  { id: 'spa', label: 'Spa & Wellness', icon: Sparkles, cat: 'leisure' },
  { id: 'yoga', label: 'Yoga', icon: Dumbbell, cat: 'leisure' },
  { id: 'wine-tasting', label: 'Wine Tasting', icon: Wine, cat: 'leisure' },
  { id: 'sunset-viewing', label: 'Sunsets', icon: Sun, cat: 'leisure' },
  { id: 'shopping', label: 'Shopping', icon: DollarSign, cat: 'leisure' },
  { id: 'city-walking', label: 'City Walking', icon: MapPin, cat: 'culture' },
  { id: 'museums', label: 'Museums & Art', icon: Camera, cat: 'culture' },
  { id: 'food-tours', label: 'Food Tours', icon: Utensils, cat: 'culture' },
  { id: 'nightlife', label: 'Nightlife', icon: Music, cat: 'culture' },
  { id: 'temple-tours', label: 'Temples', icon: Building2, cat: 'culture' },
  { id: 'wildlife', label: 'Wildlife', icon: TreePine, cat: 'nature' },
  { id: 'theme-parks', label: 'Theme Parks', icon: Gamepad2, cat: 'family' },
  { id: 'coworking', label: 'Coworking', icon: Wifi, cat: 'work' },
  { id: 'fine-dining', label: 'Fine Dining', icon: Utensils, cat: 'leisure' },
  { id: 'camping', label: 'Camping', icon: Tent, cat: 'nature' },
  { id: 'photography', label: 'Photography', icon: Camera, cat: 'culture' },
];

const REGIONS = [
  'Any Region', 'Western Europe', 'Eastern Europe', 'Northern Europe', 'Mediterranean',
  'Southeast Asia', 'East Asia', 'South Asia', 'Middle East', 'North Africa',
  'Sub-Saharan Africa', 'North America', 'Central America', 'South America',
  'Caribbean', 'Oceania', 'Pacific Islands'
];

const MONTHS = [
  { value: '', label: 'Any month' },
  { value: 'Jan', label: 'January' }, { value: 'Feb', label: 'February' },
  { value: 'Mar', label: 'March' }, { value: 'Apr', label: 'April' },
  { value: 'May', label: 'May' }, { value: 'Jun', label: 'June' },
  { value: 'Jul', label: 'July' }, { value: 'Aug', label: 'August' },
  { value: 'Sep', label: 'September' }, { value: 'Oct', label: 'October' },
  { value: 'Nov', label: 'November' }, { value: 'Dec', label: 'December' },
];

const DURATIONS = [
  { value: '', label: 'Any duration' },
  { value: 'weekend', label: 'Weekend (2-3 days)' },
  { value: 'week', label: '1 Week' },
  { value: '2weeks', label: '2 Weeks' },
  { value: 'month', label: '1 Month+' },
];

// ─── DESTINATIONS DATABASE (50+) ──────────────────────────
interface Destination {
  id: string; name: string; country: string; region: string; rating: number;
  priceLevel: number; bestMonths: string[];
  avgTemp: Record<string, number>;
  activities: string[]; facilities: string[]; suitableFor: string[];
  description: string; weatherPattern: string; accessibility: number;
  highlights: string[]; idealDuration: string;
}

const DESTINATIONS: Destination[] = [
  { id:'1', name:'Grandvalira Resort', country:'Andorra', region:'Western Europe', rating:4.7, priceLevel:3,
    bestMonths:['Dec','Jan','Feb','Mar'], avgTemp:{Dec:2,Jan:0,Feb:2,Mar:5},
    activities:['skiing','snowboarding','spa','hiking'], facilities:['ski-lifts','spa','gym','restaurant'],
    suitableFor:['business','couple','sports','friends','adventure'],
    description:'World-class skiing in the Pyrenees with 210km of slopes and après-ski culture.',
    weatherPattern:'Cold winters with reliable snow. Indoor activities available.', accessibility:8,
    highlights:['210km ski area','Caldea spa complex','Tax-free shopping'], idealDuration:'week' },
  { id:'2', name:'Seminyak', country:'Indonesia', region:'Southeast Asia', rating:4.8, priceLevel:2,
    bestMonths:['Apr','May','Jun','Jul','Aug','Sep'], avgTemp:{Apr:28,May:28,Jun:27,Jul:27,Aug:27,Sep:28},
    activities:['beach','surfing','yoga','spa','nightlife','temple-tours','food-tours'],
    facilities:['coworking','spa','gym','pool'],
    suitableFor:['digital-nomad','solo','couple','student','wellness','friends'],
    description:'Digital nomad paradise — beach clubs, world-class surf, incredible food, and coworking hubs.',
    weatherPattern:'Tropical. Dry season Apr-Sep.', accessibility:7,
    highlights:['Potato Head Beach Club','Uluwatu Temple','$5 massages'], idealDuration:'month' },
  { id:'3', name:'Disney World Orlando', country:'USA', region:'North America', rating:4.9, priceLevel:4,
    bestMonths:['Jan','Feb','Mar','Oct','Nov','Dec'], avgTemp:{Jan:16,Feb:18,Mar:21,Oct:24,Nov:20,Dec:17},
    activities:['theme-parks','shopping','wildlife'], facilities:['family-rooms','kids-club','pool','restaurant'],
    suitableFor:['family'], description:'The ultimate family destination with world-class theme parks.',
    weatherPattern:'Subtropical. Mild winters.', accessibility:10,
    highlights:['Magic Kingdom','EPCOT','Animal Kingdom'], idealDuration:'week' },
  { id:'4', name:'Historic Center', country:'Portugal', region:'Western Europe', rating:4.6, priceLevel:2,
    bestMonths:['Mar','Apr','May','Sep','Oct'], avgTemp:{Mar:15,Apr:16,May:19,Sep:22,Oct:19},
    activities:['city-walking','museums','food-tours','beach','photography','nightlife'],
    facilities:['coworking','cafe','accessible','medical'],
    suitableFor:['business','senior','couple','student','digital-nomad','solo','cultural','friends'],
    description:'Charming city with pastel facades, legendary pastel de nata, and booming nomad scene.',
    weatherPattern:'Mediterranean. Mild winters, warm dry summers.', accessibility:6,
    highlights:['Alfama district','Time Out Market','Pastéis de Belém'], idealDuration:'2weeks' },
  { id:'5', name:'Chamonix-Mont Blanc', country:'France', region:'Western Europe', rating:4.8, priceLevel:4,
    bestMonths:['Dec','Jan','Feb','Jun','Jul','Aug'], avgTemp:{Dec:-2,Jan:-4,Feb:-2,Jun:14,Jul:17,Aug:16},
    activities:['skiing','snowboarding','mountaineering','hiking','paragliding','cycling'],
    facilities:['ski-lifts','spa','restaurant','medical'],
    suitableFor:['sports','couple','solo','adventure','friends'],
    description:'Legendary Alpine destination beneath Mont Blanc — skiing, climbing, and mountain culture.',
    weatherPattern:'Alpine. Snowy winters, cool summers.', accessibility:5,
    highlights:['Aiguille du Midi','Vallée Blanche','Trail running'], idealDuration:'week' },
  { id:'6', name:'Oia', country:'Greece', region:'Mediterranean', rating:4.9, priceLevel:4,
    bestMonths:['Apr','May','Sep','Oct'], avgTemp:{Apr:17,May:21,Sep:24,Oct:21},
    activities:['beach','wine-tasting','sunset-viewing','sailing','photography','food-tours'],
    facilities:['spa','fine-dining','accessible'],
    suitableFor:['couple','senior','cultural','friends'],
    description:'Iconic caldera views, legendary sunsets, and crystal waters.',
    weatherPattern:'Mediterranean. Perfect weather Apr-Oct.', accessibility:4,
    highlights:['Caldera sunset','Amoudi Bay','Local wines'], idealDuration:'week' },
  { id:'7', name:'Shibuya, Tokyo', country:'Japan', region:'East Asia', rating:4.7, priceLevel:3,
    bestMonths:['Mar','Apr','May','Oct','Nov'], avgTemp:{Mar:10,Apr:15,May:20,Oct:18,Nov:13},
    activities:['city-walking','shopping','food-tours','temple-tours','museums','photography'],
    facilities:['coworking','subway','restaurant','medical'],
    suitableFor:['business','student','family','couple','cultural','solo','digital-nomad'],
    description:'Where tradition meets hyper-modernity. Cherry blossoms, ramen, and robot restaurants.',
    weatherPattern:'Humid subtropical. Cherry blossoms in spring.', accessibility:9,
    highlights:['Shibuya Crossing','Tsukiji Outer Market','Cherry blossom season'], idealDuration:'2weeks' },
  { id:'8', name:'Tamarindo', country:'Costa Rica', region:'Central America', rating:4.6, priceLevel:2,
    bestMonths:['Dec','Jan','Feb','Mar','Apr'], avgTemp:{Dec:27,Jan:27,Feb:28,Mar:29,Apr:29},
    activities:['surfing','wildlife','yoga','beach','hiking','diving'],
    facilities:['surf-school','yoga-studio','eco-lodge','restaurant'],
    suitableFor:['student','solo','couple','family','wellness','adventure','sports'],
    description:'Eco-paradise with monkeys, world-class surf, and pura vida lifestyle.',
    weatherPattern:'Tropical. Dry season Dec-Apr.', accessibility:6,
    highlights:['Surf breaks','Turtle nesting','Zip-lining'], idealDuration:'2weeks' },
  { id:'9', name:'Dubai Marina', country:'UAE', region:'Middle East', rating:4.5, priceLevel:4,
    bestMonths:['Nov','Dec','Jan','Feb','Mar'], avgTemp:{Nov:26,Dec:22,Jan:20,Feb:21,Mar:24},
    activities:['shopping','fine-dining','beach','photography'],
    facilities:['business-center','gym','pool','concierge'],
    suitableFor:['business','couple','family','friends'],
    description:'Ultra-modern luxury with world-class shopping, dining, and desert adventures.',
    weatherPattern:'Desert. Pleasant winter, extremely hot summer.', accessibility:10,
    highlights:['Burj Khalifa','Desert safari','Dubai Mall'], idealDuration:'week' },
  { id:'10', name:'Gothic Quarter', country:'Spain', region:'Western Europe', rating:4.8, priceLevel:3,
    bestMonths:['Apr','May','Jun','Sep','Oct'], avgTemp:{Apr:15,May:18,Jun:22,Sep:23,Oct:19},
    activities:['city-walking','beach','food-tours','nightlife','museums','cycling','photography'],
    facilities:['coworking','beach-club','restaurant','metro'],
    suitableFor:['business','student','couple','family','digital-nomad','friends','cultural','solo'],
    description:'Gaudí, tapas, beach, and one of Europe\'s best nightlife scenes.',
    weatherPattern:'Mediterranean. Warm summers, mild winters.', accessibility:7,
    highlights:['Sagrada Familia','La Boqueria','Barceloneta beach'], idealDuration:'week' },
  { id:'11', name:'Ubud', country:'Indonesia', region:'Southeast Asia', rating:4.7, priceLevel:1,
    bestMonths:['Apr','May','Jun','Jul','Aug','Sep'], avgTemp:{Apr:27,May:27,Jun:26,Jul:26,Aug:26,Sep:27},
    activities:['yoga','hiking','temple-tours','food-tours','cycling','wildlife','photography'],
    facilities:['coworking','yoga-studio','spa','eco-lodge'],
    suitableFor:['wellness','solo','couple','digital-nomad','cultural'],
    description:'Spiritual heart of Bali — rice terraces, monkey forests, and world-class yoga retreats.',
    weatherPattern:'Tropical. Dry season Apr-Sep.', accessibility:5,
    highlights:['Tegallalang Rice Terrace','Monkey Forest','$3 organic meals'], idealDuration:'month' },
  { id:'12', name:'Queenstown', country:'New Zealand', region:'Oceania', rating:4.8, priceLevel:3,
    bestMonths:['Dec','Jan','Feb','Mar','Jun','Jul','Aug'], avgTemp:{Dec:16,Jan:18,Feb:17,Mar:14,Jun:4,Jul:3,Aug:5},
    activities:['skiing','hiking','paragliding','sailing','cycling','mountaineering','camping'],
    facilities:['ski-lifts','spa','restaurant','medical'],
    suitableFor:['adventure','sports','couple','friends','solo'],
    description:'Adventure capital of the world — bungee jumping, skiing, and Lord of the Rings scenery.',
    weatherPattern:'Temperate. Ski season Jun-Aug, summer Dec-Feb.', accessibility:7,
    highlights:['Bungee jumping birthplace','Milford Sound','Remarkables ski'], idealDuration:'2weeks' },
  { id:'13', name:'Medellín', country:'Colombia', region:'South America', rating:4.5, priceLevel:1,
    bestMonths:['Jan','Feb','Mar','Jul','Aug','Dec'], avgTemp:{Jan:22,Feb:22,Mar:22,Jul:22,Aug:22,Dec:22},
    activities:['city-walking','nightlife','food-tours','hiking','coworking','photography'],
    facilities:['coworking','gym','restaurant','metro'],
    suitableFor:['digital-nomad','solo','friends','student','cultural'],
    description:'City of Eternal Spring — perfect weather, incredible value, and booming nomad community.',
    weatherPattern:'Spring-like year-round, 22°C average.', accessibility:6,
    highlights:['Comuna 13','El Poblado','$2 coffee'], idealDuration:'month' },
  { id:'14', name:'Chiang Mai Old City', country:'Thailand', region:'Southeast Asia', rating:4.6, priceLevel:1,
    bestMonths:['Nov','Dec','Jan','Feb','Mar'], avgTemp:{Nov:25,Dec:22,Jan:21,Feb:23,Mar:26},
    activities:['temple-tours','food-tours','yoga','hiking','coworking','nightlife','cycling'],
    facilities:['coworking','gym','spa','restaurant'],
    suitableFor:['digital-nomad','solo','student','wellness','cultural','budget'],
    description:'The OG digital nomad hub — temples, $1 pad thai, and fast WiFi everywhere.',
    weatherPattern:'Tropical. Cool season Nov-Feb is best.', accessibility:7,
    highlights:['300+ temples','Sunday Night Market','$500/mo living cost'], idealDuration:'month' },
  { id:'15', name:'Banff & Lake Louise', country:'Canada', region:'North America', rating:4.9, priceLevel:3,
    bestMonths:['Jun','Jul','Aug','Sep','Dec','Jan','Feb'], avgTemp:{Jun:12,Jul:15,Aug:14,Sep:10,Dec:-8,Jan:-10,Feb:-7},
    activities:['skiing','hiking','wildlife','photography','camping','mountaineering'],
    facilities:['ski-lifts','spa','restaurant','medical'],
    suitableFor:['adventure','couple','family','sports','friends'],
    description:'Turquoise lakes, Rocky Mountain peaks, and some of the best skiing in North America.',
    weatherPattern:'Mountain climate. Cold winters, cool summers.', accessibility:8,
    highlights:['Lake Louise','Moraine Lake','Sunshine Village ski'], idealDuration:'week' },
  { id:'16', name:'Amalfi Coast', country:'Italy', region:'Mediterranean', rating:4.8, priceLevel:4,
    bestMonths:['May','Jun','Sep','Oct'], avgTemp:{May:20,Jun:24,Sep:24,Oct:20},
    activities:['beach','food-tours','hiking','wine-tasting','sailing','photography'],
    facilities:['spa','fine-dining','accessible'],
    suitableFor:['couple','senior','cultural','friends','family'],
    description:'Cliffside villages, limoncello, and the most beautiful coastline in Europe.',
    weatherPattern:'Mediterranean. Warm, dry summers.', accessibility:4,
    highlights:['Positano','Path of the Gods hike','Fresh seafood'], idealDuration:'week' },
  { id:'17', name:'Cape Town', country:'South Africa', region:'Sub-Saharan Africa', rating:4.7, priceLevel:2,
    bestMonths:['Nov','Dec','Jan','Feb','Mar'], avgTemp:{Nov:19,Dec:21,Jan:23,Feb:23,Mar:22},
    activities:['hiking','beach','wine-tasting','wildlife','surfing','photography','diving'],
    facilities:['coworking','restaurant','gym','medical'],
    suitableFor:['adventure','couple','solo','digital-nomad','friends','sports'],
    description:'Table Mountain, penguins, world-class wine, and incredible value for money.',
    weatherPattern:'Mediterranean. Warm, dry summers Nov-Mar.', accessibility:7,
    highlights:['Table Mountain','Cape Winelands','Boulders Beach penguins'], idealDuration:'2weeks' },
  { id:'18', name:'Marrakech Medina', country:'Morocco', region:'North Africa', rating:4.5, priceLevel:1,
    bestMonths:['Mar','Apr','May','Oct','Nov'], avgTemp:{Mar:18,Apr:20,May:24,Oct:22,Nov:18},
    activities:['city-walking','food-tours','shopping','photography','spa'],
    facilities:['spa','restaurant','accessible'],
    suitableFor:['couple','solo','cultural','friends','student'],
    description:'Sensory overload — souks, riads, hammams, and the best tagine you\'ll ever eat.',
    weatherPattern:'Semi-arid. Pleasant spring and autumn.', accessibility:5,
    highlights:['Jemaa el-Fnaa','Jardin Majorelle','Hammam rituals'], idealDuration:'week' },
  { id:'19', name:'Reykjavik', country:'Iceland', region:'Northern Europe', rating:4.6, priceLevel:4,
    bestMonths:['Jun','Jul','Aug','Sep','Feb','Mar'], avgTemp:{Jun:10,Jul:12,Aug:11,Sep:8,Feb:-1,Mar:1},
    activities:['hiking','photography','camping','wildlife','spa'],
    facilities:['spa','restaurant','medical'],
    suitableFor:['adventure','couple','solo','friends'],
    description:'Land of fire and ice — geysers, northern lights, and midnight sun adventures.',
    weatherPattern:'Subarctic. Midnight sun in summer, northern lights in winter.', accessibility:7,
    highlights:['Northern Lights','Blue Lagoon','Golden Circle'], idealDuration:'week' },
  { id:'20', name:'Tulum', country:'Mexico', region:'Central America', rating:4.5, priceLevel:2,
    bestMonths:['Nov','Dec','Jan','Feb','Mar','Apr'], avgTemp:{Nov:26,Dec:24,Jan:24,Feb:25,Mar:26,Apr:27},
    activities:['beach','yoga','diving','food-tours','nightlife','photography','temple-tours'],
    facilities:['coworking','yoga-studio','spa','restaurant'],
    suitableFor:['digital-nomad','couple','wellness','friends','solo'],
    description:'Bohemian beach paradise with Mayan ruins, cenotes, and Instagram-perfect aesthetics.',
    weatherPattern:'Tropical. Dry season Nov-Apr.', accessibility:6,
    highlights:['Mayan ruins','Cenote swimming','Beach clubs'], idealDuration:'2weeks' },
  { id:'21', name:'Swiss Alps - Zermatt', country:'Switzerland', region:'Western Europe', rating:4.9, priceLevel:5,
    bestMonths:['Dec','Jan','Feb','Mar','Jul','Aug'], avgTemp:{Dec:-5,Jan:-7,Feb:-5,Mar:-2,Jul:14,Aug:13},
    activities:['skiing','snowboarding','hiking','mountaineering','photography'],
    facilities:['ski-lifts','spa','fine-dining','medical'],
    suitableFor:['sports','couple','adventure','friends'],
    description:'The Matterhorn, car-free village, and some of the best skiing on Earth.',
    weatherPattern:'Alpine. Heavy snow in winter, mild summers.', accessibility:6,
    highlights:['Matterhorn views','Glacier Paradise','Car-free village'], idealDuration:'week' },
  { id:'22', name:'Hội An', country:'Vietnam', region:'Southeast Asia', rating:4.7, priceLevel:1,
    bestMonths:['Feb','Mar','Apr','May','Jun','Jul','Aug'], avgTemp:{Feb:22,Mar:24,Apr:26,May:28,Jun:29,Jul:29,Aug:29},
    activities:['city-walking','food-tours','cycling','beach','photography','temple-tours'],
    facilities:['coworking','spa','restaurant'],
    suitableFor:['solo','couple','cultural','student','digital-nomad','friends'],
    description:'Lantern-lit ancient town with legendary street food and $1 tailored suits.',
    weatherPattern:'Tropical. Dry Feb-Aug.', accessibility:6,
    highlights:['Lantern Festival','Banh Mi Queen','$1 custom tailoring'], idealDuration:'2weeks' },
  { id:'23', name:'Patagonia - El Chaltén', country:'Argentina', region:'South America', rating:4.8, priceLevel:2,
    bestMonths:['Nov','Dec','Jan','Feb','Mar'], avgTemp:{Nov:8,Dec:11,Jan:13,Feb:12,Mar:10},
    activities:['hiking','mountaineering','camping','photography','wildlife'],
    facilities:['eco-lodge','restaurant','medical'],
    suitableFor:['adventure','solo','couple','sports'],
    description:'Trekking capital of Argentina — Fitz Roy, glaciers, and raw Patagonian wilderness.',
    weatherPattern:'Windy & unpredictable. Summer Nov-Mar is best.', accessibility:3,
    highlights:['Mount Fitz Roy','Perito Moreno Glacier','Free camping'], idealDuration:'2weeks' },
  { id:'24', name:'Copenhagen', country:'Denmark', region:'Northern Europe', rating:4.6, priceLevel:4,
    bestMonths:['May','Jun','Jul','Aug','Sep'], avgTemp:{May:12,Jun:16,Jul:18,Aug:17,Sep:14},
    activities:['city-walking','cycling','food-tours','museums','photography'],
    facilities:['coworking','restaurant','metro','accessible'],
    suitableFor:['business','couple','cultural','digital-nomad','solo','family'],
    description:'World\'s happiest city — Michelin dining, bike culture, and hygge lifestyle.',
    weatherPattern:'Oceanic. Long summer days, cold winters.', accessibility:9,
    highlights:['Nyhavn','Noma legacy restaurants','Tivoli Gardens'], idealDuration:'week' },
  { id:'25', name:'Kyoto', country:'Japan', region:'East Asia', rating:4.9, priceLevel:3,
    bestMonths:['Mar','Apr','May','Oct','Nov'], avgTemp:{Mar:10,Apr:15,May:20,Oct:17,Nov:12},
    activities:['temple-tours','city-walking','food-tours','photography','museums'],
    facilities:['accessible','restaurant','medical'],
    suitableFor:['cultural','couple','senior','solo','family'],
    description:'Ancient capital — 2,000 temples, geisha districts, and the soul of Japan.',
    weatherPattern:'Humid subtropical. Cherry blossoms Mar-Apr, fall foliage Oct-Nov.', accessibility:8,
    highlights:['Fushimi Inari','Bamboo Grove','Tea ceremonies'], idealDuration:'week' },
  { id:'26', name:'Playa del Carmen', country:'Mexico', region:'Central America', rating:4.4, priceLevel:2,
    bestMonths:['Nov','Dec','Jan','Feb','Mar','Apr'], avgTemp:{Nov:26,Dec:25,Jan:24,Feb:25,Mar:26,Apr:27},
    activities:['beach','diving','nightlife','food-tours','coworking'],
    facilities:['coworking','gym','restaurant','pool'],
    suitableFor:['digital-nomad','friends','couple','solo','student'],
    description:'Riviera Maya hub — cenotes, ruins, great nightlife, and growing nomad scene.',
    weatherPattern:'Tropical. Dry season Nov-Apr.', accessibility:7,
    highlights:['5th Avenue','Cozumel diving','Cenotes'], idealDuration:'2weeks' },
  { id:'27', name:'Dubrovnik', country:'Croatia', region:'Mediterranean', rating:4.7, priceLevel:3,
    bestMonths:['May','Jun','Sep','Oct'], avgTemp:{May:19,Jun:23,Sep:23,Oct:18},
    activities:['city-walking','beach','sailing','food-tours','photography','museums'],
    facilities:['spa','restaurant','accessible'],
    suitableFor:['couple','cultural','friends','senior','solo'],
    description:'Pearl of the Adriatic — medieval walls, Game of Thrones sets, and stunning coastline.',
    weatherPattern:'Mediterranean. Warm dry summers.', accessibility:5,
    highlights:['Old Town walls walk','Lokrum Island','Game of Thrones tours'], idealDuration:'week' },
  { id:'28', name:'Whistler', country:'Canada', region:'North America', rating:4.8, priceLevel:4,
    bestMonths:['Dec','Jan','Feb','Mar','Jun','Jul','Aug'], avgTemp:{Dec:-3,Jan:-4,Feb:-2,Mar:1,Jun:14,Jul:17,Aug:17},
    activities:['skiing','snowboarding','hiking','cycling','golf','camping'],
    facilities:['ski-lifts','spa','restaurant','gym'],
    suitableFor:['sports','friends','couple','adventure','family'],
    description:'North America\'s #1 ski resort, with epic mountain biking in summer.',
    weatherPattern:'Mountain. Heavy snowfall in winter, warm summers.', accessibility:8,
    highlights:['Whistler Blackcomb','Peak 2 Peak Gondola','Mountain bike park'], idealDuration:'week' },
  { id:'29', name:'Budapest', country:'Hungary', region:'Eastern Europe', rating:4.6, priceLevel:1,
    bestMonths:['Apr','May','Jun','Sep','Oct'], avgTemp:{Apr:13,May:18,Jun:22,Sep:19,Oct:13},
    activities:['city-walking','spa','nightlife','food-tours','museums','photography'],
    facilities:['coworking','spa','restaurant','metro'],
    suitableFor:['student','friends','couple','digital-nomad','cultural','solo'],
    description:'Thermal baths, ruin bars, stunning architecture, and Europe\'s best value capital.',
    weatherPattern:'Continental. Warm summers, cold winters.', accessibility:8,
    highlights:['Széchenyi Baths','Ruin bars','Parliament building'], idealDuration:'week' },
  { id:'30', name:'Maldives - Malé Atoll', country:'Maldives', region:'South Asia', rating:4.9, priceLevel:5,
    bestMonths:['Nov','Dec','Jan','Feb','Mar','Apr'], avgTemp:{Nov:28,Dec:28,Jan:28,Feb:28,Mar:29,Apr:29},
    activities:['beach','diving','sailing','spa','sunset-viewing','photography'],
    facilities:['spa','fine-dining','pool'],
    suitableFor:['couple','wellness','senior'],
    description:'Overwater villas, turquoise lagoons, and the ultimate luxury escape.',
    weatherPattern:'Tropical. Dry season Nov-Apr.', accessibility:4,
    highlights:['Overwater bungalows','Manta ray snorkeling','Private island dining'], idealDuration:'week' },
  { id:'31', name:'Berlin - Kreuzberg', country:'Germany', region:'Western Europe', rating:4.5, priceLevel:2,
    bestMonths:['May','Jun','Jul','Aug','Sep'], avgTemp:{May:14,Jun:18,Jul:20,Aug:20,Sep:15},
    activities:['city-walking','nightlife','museums','food-tours','cycling','photography'],
    facilities:['coworking','gym','restaurant','metro'],
    suitableFor:['digital-nomad','student','friends','solo','cultural'],
    description:'Europe\'s coolest city — underground clubs, street art, history, and kebabs.',
    weatherPattern:'Continental. Warm summers, cold winters.', accessibility:9,
    highlights:['Berghain','East Side Gallery','Turkish Market'], idealDuration:'2weeks' },
  { id:'32', name:'Phuket', country:'Thailand', region:'Southeast Asia', rating:4.4, priceLevel:2,
    bestMonths:['Nov','Dec','Jan','Feb','Mar','Apr'], avgTemp:{Nov:27,Dec:27,Jan:27,Feb:28,Mar:29,Apr:29},
    activities:['beach','diving','nightlife','food-tours','spa','sailing'],
    facilities:['spa','gym','pool','restaurant'],
    suitableFor:['friends','couple','family','student','wellness'],
    description:'Thailand\'s largest island — stunning beaches, vibrant nightlife, and island-hopping.',
    weatherPattern:'Tropical. Dry season Nov-Apr.', accessibility:8,
    highlights:['Phi Phi Islands','Patong nightlife','Thai massage'], idealDuration:'2weeks' },
  { id:'33', name:'Edinburgh', country:'UK', region:'Northern Europe', rating:4.6, priceLevel:3,
    bestMonths:['May','Jun','Jul','Aug'], avgTemp:{May:11,Jun:14,Jul:16,Aug:15},
    activities:['city-walking','museums','food-tours','photography','nightlife','hiking'],
    facilities:['coworking','restaurant','accessible','medical'],
    suitableFor:['cultural','solo','couple','business','friends'],
    description:'Medieval old town, literary heritage, and the world\'s biggest arts festival.',
    weatherPattern:'Oceanic. Cool and unpredictable. Best in summer.', accessibility:8,
    highlights:['Edinburgh Castle','Arthur\'s Seat','Fringe Festival (Aug)'], idealDuration:'week' },
  { id:'34', name:'Maui', country:'USA', region:'North America', rating:4.8, priceLevel:4,
    bestMonths:['Apr','May','Jun','Sep','Oct','Nov'], avgTemp:{Apr:24,May:25,Jun:26,Sep:27,Oct:26,Nov:25},
    activities:['beach','surfing','hiking','photography'],
    facilities:['spa','restaurant','accessible'],
    suitableFor:['couple','family','adventure','wellness','friends'],
    description:'Hawaiian paradise — Road to Hana, Haleakalā sunrise, and pristine beaches.',
    weatherPattern:'Tropical. Warm year-round, drier Apr-Nov.', accessibility:7,
    highlights:['Road to Hana','Haleakalā sunrise','Whale watching (winter)'], idealDuration:'week' },
  { id:'35', name:'Prague Old Town', country:'Czech Republic', region:'Eastern Europe', rating:4.7, priceLevel:2,
    bestMonths:['Apr','May','Jun','Sep','Oct'], avgTemp:{Apr:10,May:15,Jun:19,Sep:16,Oct:10},
    activities:['city-walking','museums','nightlife','food-tours','photography'],
    facilities:['coworking','restaurant','metro','accessible'],
    suitableFor:['cultural','student','couple','friends','solo','digital-nomad'],
    description:'Gothic architecture, $2 beers, and one of Europe\'s most beautiful old towns.',
    weatherPattern:'Continental. Pleasant springs, warm summers.', accessibility:8,
    highlights:['Charles Bridge','Old Town Square','Beer gardens'], idealDuration:'week' },
  { id:'36', name:'Colombo & Galle', country:'Sri Lanka', region:'South Asia', rating:4.4, priceLevel:1,
    bestMonths:['Dec','Jan','Feb','Mar'], avgTemp:{Dec:27,Jan:27,Feb:28,Mar:29},
    activities:['beach','temple-tours','wildlife','surfing','food-tours','hiking','photography'],
    facilities:['eco-lodge','spa','restaurant'],
    suitableFor:['solo','couple','adventure','cultural','student'],
    description:'Tropical island with ancient temples, tea plantations, and incredible train journeys.',
    weatherPattern:'Tropical. Dry season Dec-Mar on west coast.', accessibility:5,
    highlights:['Galle Fort','Ella train ride','Whale watching in Mirissa'], idealDuration:'2weeks' },
  { id:'37', name:'Amsterdam', country:'Netherlands', region:'Western Europe', rating:4.6, priceLevel:3,
    bestMonths:['Apr','May','Jun','Jul','Aug','Sep'], avgTemp:{Apr:10,May:14,Jun:16,Jul:18,Aug:18,Sep:15},
    activities:['cycling','museums','nightlife','food-tours','city-walking','photography'],
    facilities:['coworking','restaurant','metro','accessible'],
    suitableFor:['digital-nomad','student','couple','friends','cultural','solo','business'],
    description:'Canals, Rijksmuseum, bike culture, and legendary nightlife in the Venice of the North.',
    weatherPattern:'Oceanic. Mild but unpredictable. Best May-Sep.', accessibility:9,
    highlights:['Rijksmuseum','Vondelpark','Canal boat tours'], idealDuration:'week' },
  { id:'38', name:'Cusco & Sacred Valley', country:'Peru', region:'South America', rating:4.7, priceLevel:1,
    bestMonths:['May','Jun','Jul','Aug','Sep'], avgTemp:{May:10,Jun:8,Jul:8,Aug:9,Sep:11},
    activities:['hiking','temple-tours','food-tours','photography','mountaineering','camping'],
    facilities:['eco-lodge','restaurant','medical'],
    suitableFor:['adventure','cultural','solo','friends','student'],
    description:'Gateway to Machu Picchu, Inca history, and high-altitude Andean culture.',
    weatherPattern:'Dry season May-Sep. High altitude (3,400m).', accessibility:4,
    highlights:['Machu Picchu','Rainbow Mountain','Inca Trail'], idealDuration:'2weeks' },
  { id:'39', name:'Singapore', country:'Singapore', region:'Southeast Asia', rating:4.7, priceLevel:4,
    bestMonths:['Feb','Mar','Apr','May','Jun','Jul'], avgTemp:{Feb:27,Mar:27,Apr:28,May:28,Jun:28,Jul:28},
    activities:['food-tours','shopping','city-walking','museums','photography'],
    facilities:['coworking','restaurant','metro','accessible','medical'],
    suitableFor:['business','family','couple','cultural','digital-nomad'],
    description:'Garden city-state — hawker food, Marina Bay, and the cleanest city you\'ll ever visit.',
    weatherPattern:'Tropical. Hot and humid year-round. Feb-Apr slightly drier.', accessibility:10,
    highlights:['Gardens by the Bay','Hawker Centers','Marina Bay Sands'], idealDuration:'week' },
  { id:'40', name:'Mallorca', country:'Spain', region:'Mediterranean', rating:4.5, priceLevel:3,
    bestMonths:['May','Jun','Sep','Oct'], avgTemp:{May:20,Jun:24,Sep:24,Oct:20},
    activities:['beach','cycling','hiking','sailing','wine-tasting','food-tours','golf'],
    facilities:['spa','restaurant','accessible','gym'],
    suitableFor:['sports','couple','family','senior','friends'],
    description:'Mediterranean gem — world-class cycling, hidden coves, and Serra de Tramuntana mountains.',
    weatherPattern:'Mediterranean. Warm, dry summers.', accessibility:8,
    highlights:['Serra de Tramuntana cycling','Cala Mondragó','Palma Old Town'], idealDuration:'week' },
  { id:'41', name:'Nairobi & Masai Mara', country:'Kenya', region:'Sub-Saharan Africa', rating:4.6, priceLevel:2,
    bestMonths:['Jul','Aug','Sep','Oct','Jan','Feb'], avgTemp:{Jul:17,Aug:17,Sep:19,Oct:20,Jan:19,Feb:20},
    activities:['wildlife','photography','hiking','camping'],
    facilities:['eco-lodge','restaurant','medical'],
    suitableFor:['adventure','couple','family','solo','friends'],
    description:'The Great Migration, Big Five safaris, and raw African wilderness.',
    weatherPattern:'Tropical highland. Dry seasons Jul-Oct and Jan-Feb.', accessibility:5,
    highlights:['Great Migration','Big Five safari','Maasai culture'], idealDuration:'2weeks' },
  { id:'42', name:'Tallinn', country:'Estonia', region:'Northern Europe', rating:4.4, priceLevel:2,
    bestMonths:['May','Jun','Jul','Aug'], avgTemp:{May:11,Jun:15,Jul:18,Aug:17},
    activities:['city-walking','museums','nightlife','food-tours','coworking','photography'],
    facilities:['coworking','restaurant','accessible'],
    suitableFor:['digital-nomad','solo','couple','cultural','student','business'],
    description:'Medieval meets digital — the world\'s most advanced e-society in a fairytale old town.',
    weatherPattern:'Cool summers, freezing winters. Best May-Aug.', accessibility:7,
    highlights:['Old Town','e-Residency hub','Telliskivi Creative City'], idealDuration:'week' },
  { id:'43', name:'Bora Bora', country:'French Polynesia', region:'Pacific Islands', rating:4.9, priceLevel:5,
    bestMonths:['May','Jun','Jul','Aug','Sep','Oct'], avgTemp:{May:27,Jun:26,Jul:25,Aug:25,Sep:26,Oct:27},
    activities:['beach','diving','sailing','spa','sunset-viewing','photography'],
    facilities:['spa','fine-dining','pool'],
    suitableFor:['couple','wellness'],
    description:'The most beautiful island on Earth — overwater bungalows and Mount Otemanu views.',
    weatherPattern:'Tropical. Dry season May-Oct.', accessibility:3,
    highlights:['Mount Otemanu','Lagoon snorkeling','Overwater bungalows'], idealDuration:'week' },
  { id:'44', name:'Havana', country:'Cuba', region:'Caribbean', rating:4.3, priceLevel:1,
    bestMonths:['Nov','Dec','Jan','Feb','Mar','Apr'], avgTemp:{Nov:25,Dec:24,Jan:22,Feb:23,Mar:24,Apr:26},
    activities:['city-walking','music','food-tours','photography','beach'],
    facilities:['restaurant','accessible'],
    suitableFor:['cultural','solo','couple','friends','student'],
    description:'Classic cars, salsa clubs, colonial architecture, and the spirit of revolution.',
    weatherPattern:'Tropical. Dry season Nov-Apr.', accessibility:4,
    highlights:['Old Havana','Tropicana show','Viñales Valley'], idealDuration:'week' },
  { id:'45', name:'Lofoten Islands', country:'Norway', region:'Northern Europe', rating:4.7, priceLevel:4,
    bestMonths:['Jun','Jul','Aug','Sep','Jan','Feb','Mar'], avgTemp:{Jun:11,Jul:13,Aug:13,Sep:10,Jan:-1,Feb:-1,Mar:1},
    activities:['hiking','photography','fishing','camping','wildlife','surfing'],
    facilities:['eco-lodge','restaurant'],
    suitableFor:['adventure','couple','solo','photography'],
    description:'Dramatic fjords, midnight sun, and Arctic surfing above the Arctic Circle.',
    weatherPattern:'Surprisingly mild for Arctic. Midnight sun Jun-Jul, northern lights Oct-Mar.', accessibility:4,
    highlights:['Midnight sun','Reine fishing village','Arctic surfing'], idealDuration:'week' },
  { id:'46', name:'Jaipur', country:'India', region:'South Asia', rating:4.5, priceLevel:1,
    bestMonths:['Oct','Nov','Dec','Jan','Feb','Mar'], avgTemp:{Oct:27,Nov:22,Dec:17,Jan:16,Feb:19,Mar:24},
    activities:['city-walking','temple-tours','shopping','food-tours','photography'],
    facilities:['spa','restaurant','accessible'],
    suitableFor:['cultural','couple','solo','student','friends'],
    description:'The Pink City — maharajas\' palaces, vibrant bazaars, and the gateway to Rajasthan.',
    weatherPattern:'Semi-arid. Cool winters Oct-Mar, scorching summers.', accessibility:5,
    highlights:['Hawa Mahal','Amber Fort','Block printing workshops'], idealDuration:'week' },
  { id:'47', name:'Fiji - Nadi & Mamanuca', country:'Fiji', region:'Pacific Islands', rating:4.6, priceLevel:3,
    bestMonths:['May','Jun','Jul','Aug','Sep','Oct'], avgTemp:{May:26,Jun:24,Jul:24,Aug:24,Sep:25,Oct:26},
    activities:['beach','diving','sailing','spa','wildlife'],
    facilities:['spa','restaurant','pool'],
    suitableFor:['couple','family','wellness','friends'],
    description:'Bula! Crystal-clear waters, friendly locals, and barefoot luxury island life.',
    weatherPattern:'Tropical. Dry season May-Oct.', accessibility:5,
    highlights:['Mamanuca Islands','Cloud 9 bar','Coral reefs'], idealDuration:'week' },
  { id:'48', name:'Cartagena', country:'Colombia', region:'South America', rating:4.5, priceLevel:1,
    bestMonths:['Dec','Jan','Feb','Mar','Apr'], avgTemp:{Dec:28,Jan:27,Feb:28,Mar:28,Apr:29},
    activities:['city-walking','beach','food-tours','nightlife','photography'],
    facilities:['restaurant','spa','accessible'],
    suitableFor:['couple','friends','solo','cultural','student'],
    description:'Colorful colonial walled city with Caribbean beaches, salsa, and incredible seafood.',
    weatherPattern:'Tropical. Dry season Dec-Apr.', accessibility:6,
    highlights:['Walled City','Rosario Islands','Street food tours'], idealDuration:'week' },
  { id:'49', name:'Val Thorens', country:'France', region:'Western Europe', rating:4.6, priceLevel:3,
    bestMonths:['Dec','Jan','Feb','Mar','Apr'], avgTemp:{Dec:-6,Jan:-8,Feb:-6,Mar:-3,Apr:0},
    activities:['skiing','snowboarding','spa'],
    facilities:['ski-lifts','spa','restaurant','gym'],
    suitableFor:['sports','friends','couple','adventure'],
    description:'Highest ski resort in Europe (2,300m) — guaranteed snow and 600km of linked slopes.',
    weatherPattern:'Alpine. Guaranteed snow Nov-May at this altitude.', accessibility:6,
    highlights:['600km 3 Valleys','Guaranteed snow','Après-ski'], idealDuration:'week' },
  { id:'50', name:'Zanzibar', country:'Tanzania', region:'Sub-Saharan Africa', rating:4.5, priceLevel:2,
    bestMonths:['Jun','Jul','Aug','Sep','Dec','Jan','Feb'], avgTemp:{Jun:26,Jul:25,Aug:25,Sep:26,Dec:28,Jan:29,Feb:29},
    activities:['beach','diving','food-tours','city-walking','photography','sailing'],
    facilities:['spa','restaurant','eco-lodge'],
    suitableFor:['couple','solo','adventure','cultural','friends'],
    description:'Spice Island — pristine beaches, Stone Town history, and dhow sailing at sunset.',
    weatherPattern:'Tropical. Dry seasons Jun-Oct and Dec-Feb.', accessibility:5,
    highlights:['Stone Town','Spice tours','Nungwi Beach'], idealDuration:'week' },
];

// ── Types
type BudgetType = 'budget' | 'value' | 'luxury';
type PaceType = 'relaxed' | 'moderate' | 'active';
type ViewType = 'choose' | 'customize' | 'results' | 'fullplan';

const PLAN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-planner`;

// ─── Markdown renderer (simple) ─────────────────────
function SimpleMarkdown({ content }: { content: string }) {
  const { text, bookings } = parseBookingBlocks(content);

  const parts = text.split(/({{BOOKING_CARD_\d+}})/);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {parts.map((part, i) => {
        const match = part.match(/{{BOOKING_CARD_(\d+)}}/);
        if (match) {
          const idx = parseInt(match[1]);
          return bookings[idx] ? <BookingCards key={i} items={bookings[idx]} /> : null;
        }
        // render markdown lines
        return (
          <div key={i}>
            {part.split('\n').map((line, li) => {
              if (line.startsWith('## ')) return <h2 key={li} className="text-lg font-bold mt-4 mb-2 flex items-center gap-2">{line.slice(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={li} className="text-base font-semibold mt-3 mb-1">{line.slice(4)}</h3>;
              if (line.startsWith('| ')) {
                // table row
                const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
                const isHeader = cells.every(c => /^[-:]+$/.test(c));
                if (isHeader) return null;
                return (
                  <div key={li} className="grid grid-cols-4 gap-1 text-xs py-1 border-b border-border/50">
                    {cells.map((cell, ci) => (
                      <span key={ci} className={ci === 0 ? 'font-medium' : 'text-right'}>{cell}</span>
                    ))}
                  </div>
                );
              }
              if (line.startsWith('- **')) {
                const boldMatch = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
                if (boldMatch) return (
                  <div key={li} className="flex gap-2 text-sm py-0.5">
                    <span className="font-semibold shrink-0">{boldMatch[1]}:</span>
                    <span className="text-muted-foreground">{renderInlineMarkdown(boldMatch[2])}</span>
                  </div>
                );
              }
              if (line.startsWith('- ')) return <div key={li} className="flex gap-2 text-sm py-0.5"><span>•</span><span>{renderInlineMarkdown(line.slice(2))}</span></div>;
              if (line.trim() === '') return <div key={li} className="h-1" />;
              return <p key={li} className="text-sm leading-relaxed">{renderInlineMarkdown(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1');
}

// ─── COMPONENT ────────────────────────────────────────────
export default function AITravelPlanner() {
  const { toast } = useToast();
  const voice = useVoiceConversation();

  // ── State
  const [view, setView] = useState<ViewType>('choose');
  const [tripType, setTripType] = useState('');
  const [budget, setBudget] = useState<BudgetType>('value');
  const [pace, setPace] = useState<PaceType>('moderate');
  const [interests, setInterests] = useState<string[]>([]);
  const [month, setMonth] = useState('');
  const [region, setRegion] = useState('');
  const [duration, setDuration] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [searchText, setSearchText] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('tp-saved') || '[]'); } catch { return []; }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [detailDest, setDetailDest] = useState<Destination | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // AI Plan state
  const [planContent, setPlanContent] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [planDest, setPlanDest] = useState<Destination | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Current location
  const [currentLocation] = useState<{ city: string; country: string } | null>(() => {
    try {
      const loc = localStorage.getItem('user-location');
      return loc ? JSON.parse(loc) : null;
    } catch { return null; }
  });

  // ── Handlers
  const toggleInterest = useCallback((id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('tp-saved', JSON.stringify(next));
      return next;
    });
  }, []);

  const selectTripType = useCallback((id: string) => {
    const tt = TRIP_TYPES.find(t => t.id === id);
    if (tt) {
      setTripType(id);
      setBudget(tt.presets.budget);
      setPace(tt.presets.pace);
      setInterests(tt.presets.interests);
      setView('customize');
    }
  }, []);

  const resetAll = useCallback(() => {
    setView('choose');
    setTripType('');
    setBudget('value');
    setPace('moderate');
    setInterests([]);
    setMonth('');
    setRegion('');
    setDuration('');
    setGroupSize('');
    setSearchText('');
    setShowSavedOnly(false);
    setPlanContent('');
    setPlanDest(null);
  }, []);

  // ── Generate Full Plan (streaming)
  const generateFullPlan = useCallback(async (dest: Destination | null) => {
    setPlanLoading(true);
    setPlanContent('');
    setPlanDest(dest);
    setView('fullplan');

    abortRef.current = new AbortController();

    try {
      const resp = await fetch(PLAN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          destination: dest,
          tripType: tripType || undefined,
          budget,
          pace,
          duration: duration || dest?.idealDuration || 'week',
          groupSize: groupSize || undefined,
          interests,
          month: month || undefined,
          region: region || undefined,
        }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: 'Error', description: err.error || `Error ${resp.status}`, variant: 'destructive' });
        setPlanLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) { setPlanLoading(false); return; }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setPlanContent(fullText);
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setPlanContent(fullText);
            }
          } catch {}
        }
      }

      setPlanLoading(false);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
      setPlanLoading(false);
    }
  }, [tripType, budget, pace, duration, groupSize, interests, month, region, toast]);

  const stopPlan = useCallback(() => {
    abortRef.current?.abort();
    setPlanLoading(false);
  }, []);

  // ── Filtering
  const filteredResults = useMemo(() => {
    let list = DESTINATIONS;
    if (tripType) list = list.filter(d => d.suitableFor.includes(tripType));
    if (interests.length > 0) list = list.filter(d => interests.some(i => d.activities.includes(i)));
    if (month) list = list.filter(d => d.bestMonths.includes(month));
    if (region && region !== 'Any Region') list = list.filter(d => d.region === region);
    if (duration) list = list.filter(d => d.idealDuration === duration);
    const maxPrice = budget === 'budget' ? 2 : budget === 'value' ? 3 : 5;
    list = list.filter(d => d.priceLevel <= maxPrice);
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) || d.activities.some(a => a.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q)
      );
    }
    if (showSavedOnly) list = list.filter(d => savedIds.includes(d.id));
    list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [tripType, interests, month, region, duration, budget, searchText, showSavedOnly, savedIds]);

  const activeFilterCount = [month, region !== '' && region !== 'Any Region' ? region : '', duration, groupSize].filter(Boolean).length;

  // ─── RENDER: FULL PLAN VIEW ───────────────────────────────
  if (view === 'fullplan') {
    return (
      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { stopPlan(); setView('results'); }}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                {planDest ? `${planDest.name} Plan` : 'Your Travel Plan'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {planDest ? `${planDest.country} · ${planDest.region}` : 'AI-generated full itinerary'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {planLoading && (
              <Button variant="destructive" size="sm" onClick={stopPlan}>
                <X className="h-4 w-4 mr-1" /> Stop
              </Button>
            )}
            {/* Voice controls */}
            {voice.ttsSupported && planContent && !planLoading && (
              <Button
                variant={voice.isSpeaking ? 'default' : 'outline'}
                size="icon"
                onClick={() => voice.isSpeaking ? voice.stopSpeaking() : voice.speak(planContent)}
                title={voice.isSpeaking ? 'Stop reading' : 'Read plan aloud'}
              >
                {voice.isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={resetAll}>
              <RotateCcw className="h-4 w-4 mr-1" /> New Plan
            </Button>
          </div>
        </div>

        {/* Plan badges */}
        <div className="flex flex-wrap gap-2">
          {tripType && <Badge>{TRIP_TYPES.find(t => t.id === tripType)?.emoji} {TRIP_TYPES.find(t => t.id === tripType)?.label}</Badge>}
          <Badge variant="outline">💰 {budget}</Badge>
          <Badge variant="outline">🏃 {pace}</Badge>
          {month && <Badge variant="outline">📅 {month}</Badge>}
          {duration && <Badge variant="outline">⏱️ {duration}</Badge>}
          {groupSize && <Badge variant="outline">👥 {groupSize}</Badge>}
        </div>

        {/* Plan content */}
        <Card>
          <CardContent className="pt-6">
            {planLoading && !planContent && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Crafting your perfect trip plan...</p>
              </div>
            )}
            {planContent && (
              <ScrollArea className="max-h-[70vh]">
                <SimpleMarkdown content={planContent} />
                {planLoading && (
                  <div className="flex items-center gap-2 mt-4 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Still generating...</span>
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Regenerate button */}
        {!planLoading && planContent && (
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => generateFullPlan(planDest)}>
              <RotateCcw className="mr-2 h-4 w-4" /> Regenerate Plan
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setView('results')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Destinations
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ─── RENDER: TRIP TYPE SELECTION ──────────────────────────
  if (view === 'choose') {
    return (
      <div className="container mx-auto p-4 max-w-6xl space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            AI Travel Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What kind of trip are you planning? We'll create a complete plan with flights, hotels, restaurants, events & costs.
          </p>
          {currentLocation && (
            <Badge variant="outline" className="gap-2">
              <MapPin className="h-3 w-3" /> From {currentLocation.city}, {currentLocation.country}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {TRIP_TYPES.map(tt => (
            <Card
              key={tt.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group bg-gradient-to-br ${tt.color} border-2 ${
                tripType === tt.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/30'
              }`}
              onClick={() => selectTripType(tt.id)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <span className="text-3xl">{tt.emoji}</span>
                <h3 className="font-semibold text-sm">{tt.label}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{tt.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => { setTripType(''); setView('customize'); }}>
            Skip — I'll customize everything myself <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── RENDER: CUSTOMIZE + RESULTS ──────────────────────────
  const currentTT = TRIP_TYPES.find(t => t.id === tripType);

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => view === 'results' ? setView('customize') : setView('choose')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {currentTT && <span>{currentTT.emoji}</span>}
              {currentTT ? currentTT.label : 'Custom Trip'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {view === 'customize' ? 'Fine-tune your preferences' : `${filteredResults.length} destinations found`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={resetAll}>
            <RotateCcw className="h-4 w-4 mr-1" /> Start Over
          </Button>
          {view === 'customize' && (
            <Button size="sm" onClick={() => { setView('results'); toast({ title: `Found ${filteredResults.length} destinations` }); }}>
              <Zap className="h-4 w-4 mr-1" /> Show {filteredResults.length} Results
            </Button>
          )}
          {view === 'results' && (
            <Button size="sm" variant="default" onClick={() => generateFullPlan(null)} className="gap-1">
              <FileText className="h-4 w-4" /> Make Full Plan
            </Button>
          )}
        </div>
      </div>

      {/* ── CUSTOMIZE VIEW ─────────────────────────────────── */}
      {view === 'customize' && (
        <div className="space-y-6">
          {/* Budget & Pace quick selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" /> Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(['budget', 'value', 'luxury'] as const).map(b => (
                    <Button key={b} variant={budget === b ? 'default' : 'outline'} size="sm" className="flex-1"
                      onClick={() => setBudget(b)}>
                      {b === 'budget' ? '💰 Budget' : b === 'value' ? '💰💰 Value' : '💰💰💰 Luxury'}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Pace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(['relaxed', 'moderate', 'active'] as const).map(p => (
                    <Button key={p} variant={pace === p ? 'default' : 'outline'} size="sm" className="flex-1"
                      onClick={() => setPace(p)}>
                      {p === 'relaxed' ? '🧘 Relaxed' : p === 'moderate' ? '⚖️ Moderate' : '🏃 Active'}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* When & Where */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> When & Where
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Month</Label>
                  <select className="w-full mt-1 p-2 text-sm border rounded-md bg-background" value={month}
                    onChange={e => setMonth(e.target.value)}>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Region</Label>
                  <select className="w-full mt-1 p-2 text-sm border rounded-md bg-background" value={region}
                    onChange={e => setRegion(e.target.value)}>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Duration</Label>
                  <select className="w-full mt-1 p-2 text-sm border rounded-md bg-background" value={duration}
                    onChange={e => setDuration(e.target.value)}>
                    {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Group Size</Label>
                  <select className="w-full mt-1 p-2 text-sm border rounded-md bg-background" value={groupSize}
                    onChange={e => setGroupSize(e.target.value)}>
                    <option value="">Any</option>
                    <option value="1">Solo</option>
                    <option value="2">Couple</option>
                    <option value="3-5">Small group (3-5)</option>
                    <option value="6+">Large group (6+)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Activities
                {interests.length > 0 && <Badge variant="secondary" className="text-xs">{interests.length} selected</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(['sports', 'leisure', 'culture', 'nature', 'family', 'work'] as const).map(cat => {
                const items = ACTIVITY_OPTIONS.filter(a => a.cat === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map(act => (
                        <Button key={act.id} variant={interests.includes(act.id) ? 'default' : 'outline'}
                          size="sm" className="h-8 text-xs gap-1.5" onClick={() => toggleInterest(act.id)}>
                          <act.icon className="h-3.5 w-3.5" />
                          {act.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* CTA */}
          <Button className="w-full" size="lg" onClick={() => { setView('results'); toast({ title: `Found ${filteredResults.length} perfect destinations!` }); }}>
            <Search className="mr-2 h-5 w-5" />
            Find {filteredResults.length} Perfect Destinations
          </Button>
        </div>
      )}

      {/* ── RESULTS VIEW ───────────────────────────────────── */}
      {view === 'results' && (
        <div className="space-y-4">
          {/* Search bar & filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search destinations, countries, activities..." className="pl-9"
                value={searchText} onChange={e => setSearchText(e.target.value)} />
              {searchText && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchText('')}><X className="h-3 w-3" /></Button>
              )}
            </div>
            <Button variant={showSavedOnly ? 'default' : 'outline'} size="icon"
              onClick={() => setShowSavedOnly(!showSavedOnly)}>
              <BookmarkCheck className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setView('customize')} className="gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && <Badge variant="secondary" className="text-xs ml-1">{activeFilterCount}</Badge>}
            </Button>
          </div>

          {/* Quick interest chips */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {ACTIVITY_OPTIONS.slice(0, 14).map(act => (
                <Button key={act.id} variant={interests.includes(act.id) ? 'default' : 'outline'}
                  size="sm" className="h-7 text-xs whitespace-nowrap shrink-0 gap-1"
                  onClick={() => toggleInterest(act.id)}>
                  <act.icon className="h-3 w-3" />
                  {act.label}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Results grid */}
          {filteredResults.length === 0 ? (
            <Card className="p-12 text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h4 className="text-lg font-semibold mb-2">No destinations match</h4>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={() => setView('customize')}>Adjust Filters</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map(dest => (
                <Card key={dest.id} className="group hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer overflow-hidden"
                  onClick={() => setDetailDest(dest)}>
                  {/* Color strip */}
                  <div className="h-1.5 bg-gradient-to-r from-primary/60 to-primary/20" />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{dest.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" /> {dest.country} · {dest.region}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-0.5 text-sm">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{dest.rating}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7"
                          onClick={e => { e.stopPropagation(); toggleSave(dest.id); }}>
                          {savedIds.includes(dest.id)
                            ? <BookmarkCheck className="h-4 w-4 text-primary" />
                            : <Bookmark className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">{dest.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {dest.activities.slice(0, 4).map(a => (
                        <Badge key={a} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {a.replace(/-/g, ' ')}
                        </Badge>
                      ))}
                      {dest.activities.length > 4 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          +{dest.activities.length - 4}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sun className="h-3 w-3 text-orange-400" />
                        {dest.bestMonths.slice(0, 3).join(', ')}{dest.bestMonths.length > 3 ? '…' : ''}
                      </span>
                      <span>{'💰'.repeat(Math.min(dest.priceLevel, 4))}</span>
                    </div>

                    {/* Make Full Plan button on each card */}
                    <Button
                      size="sm"
                      className="w-full gap-2"
                      onClick={e => { e.stopPropagation(); generateFullPlan(dest); }}
                    >
                      <FileText className="h-3.5 w-3.5" /> Make Full Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DESTINATION DETAIL MODAL ─────────────────────── */}
      <Dialog open={!!detailDest} onOpenChange={() => setDetailDest(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {detailDest && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{detailDest.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {detailDest.country} · {detailDest.region}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{detailDest.rating}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleSave(detailDest.id)}>
                      {savedIds.includes(detailDest.id)
                        ? <BookmarkCheck className="h-5 w-5 text-primary" />
                        : <Bookmark className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="weather">Weather</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <p className="text-sm leading-relaxed">{detailDest.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge>{'💰'.repeat(Math.min(detailDest.priceLevel, 4))}</Badge>
                    <Badge variant="outline">Accessibility: {detailDest.accessibility}/10</Badge>
                    <Badge variant="outline">Duration: {detailDest.idealDuration}</Badge>
                  </div>

                  {detailDest.highlights.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Highlights</p>
                      <div className="flex flex-wrap gap-2">
                        {detailDest.highlights.map(h => (
                          <Badge key={h} variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {h}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold mb-2">Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {detailDest.activities.map(a => (
                        <Badge key={a} variant="outline" className="text-xs capitalize">
                          {a.replace(/-/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Perfect For</p>
                    <div className="flex flex-wrap gap-2">
                      {detailDest.suitableFor.map(s => {
                        const tt = TRIP_TYPES.find(t => t.id === s);
                        return (
                          <Badge key={s} className="text-xs gap-1">
                            {tt ? tt.emoji : '✈️'} {tt ? tt.label : s}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="weather" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Cloud className="h-4 w-4" /> Weather Pattern
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{detailDest.weatherPattern}</p>
                    </CardContent>
                  </Card>

                  <div>
                    <p className="text-sm font-semibold mb-2">Best Months</p>
                    <div className="flex flex-wrap gap-2">
                      {detailDest.bestMonths.map(m => (
                        <Badge key={m} variant="secondary">{m}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Temperatures</p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {Object.entries(detailDest.avgTemp).map(([m, t]) => (
                        <div key={m} className="text-center p-2 rounded-lg border">
                          <span className="text-xs text-muted-foreground">{m}</span>
                          <p className="font-bold text-primary">{t}°C</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price Level</span>
                        <span className="font-medium">{'💰'.repeat(Math.min(detailDest.priceLevel, 4))}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accessibility</span>
                        <span className="font-medium">{detailDest.accessibility}/10</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${detailDest.accessibility * 10}%` }} />
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ideal Duration</span>
                        <span className="font-medium capitalize">{detailDest.idealDuration}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Facilities</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                          {detailDest.facilities.map(f => (
                            <Badge key={f} variant="outline" className="text-[10px]">{f.replace(/-/g, ' ')}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1 gap-2" onClick={() => { setDetailDest(null); generateFullPlan(detailDest); }}>
                  <FileText className="h-4 w-4" /> Make Full Plan
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => { toggleSave(detailDest.id); }}>
                  <Bookmark className="h-4 w-4" /> Save
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
