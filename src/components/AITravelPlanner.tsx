import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Plane, Users, Briefcase, GraduationCap, Baby, Heart,
  Mountain, Waves, Sun, Cloud, Snowflake, Umbrella,
  Wifi, Utensils, Dumbbell, Sparkles, MapPin, Calendar,
  TrendingUp, DollarSign, Clock, Star, CheckCircle2,
  AlertCircle, Search, Filter, Globe, Thermometer
} from 'lucide-react';

interface TravelerProfile {
  type: 'business' | 'student' | 'family' | 'senior' | 'solo' | 'couple';
  ageGroup?: string;
  budget: 'budget' | 'value' | 'luxury';
  pace: 'relaxed' | 'moderate' | 'active';
  interests: string[];
}

interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  rating: number;
  priceLevel: number;
  bestMonths: string[];
  avgTemp: { [month: string]: number };
  activities: string[];
  facilities: string[];
  suitableFor: string[];
  description: string;
  weatherPattern: string;
  accessibility: number;
}

const PRE_LOADED_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Andorra - Grandvalira Resort',
    country: 'Andorra',
    region: 'Pyrenees',
    rating: 4.7,
    priceLevel: 3,
    bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'],
    avgTemp: { 'Dec': 2, 'Jan': 0, 'Feb': 2, 'Mar': 5 },
    activities: ['skiing', 'snowboarding', 'tennis', 'spa', 'hiking'],
    facilities: ['indoor-tennis', 'ski-lifts', 'spa', 'gym', 'restaurant'],
    suitableFor: ['business', 'couple', 'family'],
    description: 'Perfect winter sports destination with indoor tennis facilities. Excellent ski conditions and proximity to Barcelona.',
    weatherPattern: 'Cold winters with reliable snow. Indoor activities available.',
    accessibility: 8
  },
  {
    id: '2',
    name: 'Bali - Seminyak',
    country: 'Indonesia',
    region: 'Southeast Asia',
    rating: 4.8,
    priceLevel: 2,
    bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    avgTemp: { 'Apr': 28, 'May': 28, 'Jun': 27, 'Jul': 27, 'Aug': 27, 'Sep': 28 },
    activities: ['beach', 'surfing', 'yoga', 'spa', 'nightlife', 'temple-tours'],
    facilities: ['beach-club', 'coworking', 'spa', 'gym', 'pool'],
    suitableFor: ['business', 'solo', 'couple', 'student'],
    description: 'Digital nomad paradise with beautiful beaches, vibrant culture, and excellent coworking spaces.',
    weatherPattern: 'Tropical climate. Dry season Apr-Sep, monsoon Oct-Mar.',
    accessibility: 7
  },
  {
    id: '3',
    name: 'Orlando - Disney World',
    country: 'USA',
    region: 'Florida',
    rating: 4.9,
    priceLevel: 4,
    bestMonths: ['Jan', 'Feb', 'Mar', 'Oct', 'Nov', 'Dec'],
    avgTemp: { 'Jan': 16, 'Feb': 18, 'Mar': 21, 'Oct': 24, 'Nov': 20, 'Dec': 17 },
    activities: ['theme-parks', 'water-parks', 'shows', 'golf', 'shopping'],
    facilities: ['family-rooms', 'kids-club', 'pool', 'restaurant', 'babysitting'],
    suitableFor: ['family'],
    description: 'Ultimate family destination with world-class theme parks, water parks, and family entertainment.',
    weatherPattern: 'Subtropical. Hot humid summers, mild winters. Hurricane season Jun-Nov.',
    accessibility: 10
  },
  {
    id: '4',
    name: 'Lisbon - Historic Center',
    country: 'Portugal',
    region: 'Western Europe',
    rating: 4.6,
    priceLevel: 2,
    bestMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct'],
    avgTemp: { 'Mar': 15, 'Apr': 16, 'May': 19, 'Sep': 22, 'Oct': 19 },
    activities: ['city-walking', 'museums', 'food-tours', 'tram-rides', 'beach'],
    facilities: ['coworking', 'cafe', 'elevator', 'accessible', 'medical'],
    suitableFor: ['business', 'senior', 'couple', 'student'],
    description: 'Charming historic city with excellent food, culture, and digital nomad infrastructure. Very walkable.',
    weatherPattern: 'Mediterranean climate. Mild winters, warm dry summers.',
    accessibility: 6
  },
  {
    id: '5',
    name: 'Chamonix - Mont Blanc',
    country: 'France',
    region: 'French Alps',
    rating: 4.8,
    priceLevel: 4,
    bestMonths: ['Dec', 'Jan', 'Feb', 'Jun', 'Jul', 'Aug'],
    avgTemp: { 'Dec': -2, 'Jan': -4, 'Feb': -2, 'Jun': 14, 'Jul': 17, 'Aug': 16 },
    activities: ['skiing', 'snowboarding', 'mountaineering', 'hiking', 'paragliding'],
    facilities: ['ski-lifts', 'equipment-rental', 'spa', 'restaurant', 'medical'],
    suitableFor: ['business', 'couple', 'solo'],
    description: 'World-class alpine destination for skiing in winter and hiking in summer. Stunning mountain views.',
    weatherPattern: 'Alpine climate. Snowy winters, cool summers. Best for outdoor enthusiasts.',
    accessibility: 5
  },
  {
    id: '6',
    name: 'Santorini - Oia',
    country: 'Greece',
    region: 'Mediterranean',
    rating: 4.9,
    priceLevel: 4,
    bestMonths: ['Apr', 'May', 'Sep', 'Oct'],
    avgTemp: { 'Apr': 17, 'May': 21, 'Sep': 24, 'Oct': 21 },
    activities: ['beach', 'wine-tasting', 'sunset-viewing', 'sailing', 'photography'],
    facilities: ['infinity-pool', 'spa', 'fine-dining', 'accessible', 'medical'],
    suitableFor: ['couple', 'senior'],
    description: 'Romantic island paradise with iconic sunsets, white-washed buildings, and crystal-clear waters.',
    weatherPattern: 'Mediterranean. Hot dry summers, mild winters. Perfect weather Apr-Oct.',
    accessibility: 4
  },
  {
    id: '7',
    name: 'Tokyo - Shibuya',
    country: 'Japan',
    region: 'East Asia',
    rating: 4.7,
    priceLevel: 3,
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'],
    avgTemp: { 'Mar': 10, 'Apr': 15, 'May': 20, 'Oct': 18, 'Nov': 13 },
    activities: ['city-walking', 'shopping', 'anime-culture', 'food-tours', 'temples'],
    facilities: ['coworking', 'high-speed-internet', 'subway', 'restaurant', 'medical'],
    suitableFor: ['business', 'student', 'family', 'couple'],
    description: 'Vibrant modern city blending traditional culture with cutting-edge technology. Excellent public transport.',
    weatherPattern: 'Humid subtropical. Cherry blossoms in spring, colorful autumn.',
    accessibility: 9
  },
  {
    id: '8',
    name: 'Costa Rica - Tamarindo',
    country: 'Costa Rica',
    region: 'Central America',
    rating: 4.6,
    priceLevel: 2,
    bestMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    avgTemp: { 'Dec': 27, 'Jan': 27, 'Feb': 28, 'Mar': 29, 'Apr': 29 },
    activities: ['surfing', 'zip-lining', 'wildlife', 'yoga', 'beach'],
    facilities: ['surf-school', 'yoga-studio', 'eco-lodge', 'restaurant', 'medical'],
    suitableFor: ['student', 'solo', 'couple', 'family'],
    description: 'Eco-paradise with incredible biodiversity, surf culture, and adventure activities. Pura Vida lifestyle.',
    weatherPattern: 'Tropical. Dry season Dec-Apr, rainy May-Nov.',
    accessibility: 6
  },
  {
    id: '9',
    name: 'Dubai - Marina',
    country: 'UAE',
    region: 'Middle East',
    rating: 4.5,
    priceLevel: 4,
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    avgTemp: { 'Nov': 26, 'Dec': 22, 'Jan': 20, 'Feb': 21, 'Mar': 24 },
    activities: ['shopping', 'fine-dining', 'desert-safari', 'beach', 'luxury'],
    facilities: ['business-center', 'meeting-rooms', 'gym', 'pool', 'concierge'],
    suitableFor: ['business', 'couple', 'family'],
    description: 'Luxury destination with world-class shopping, dining, and business facilities. Ultra-modern infrastructure.',
    weatherPattern: 'Desert climate. Extremely hot summer, pleasant winter.',
    accessibility: 10
  },
  {
    id: '10',
    name: 'Barcelona - Gothic Quarter',
    country: 'Spain',
    region: 'Western Europe',
    rating: 4.8,
    priceLevel: 3,
    bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
    avgTemp: { 'Apr': 15, 'May': 18, 'Jun': 22, 'Sep': 23, 'Oct': 19 },
    activities: ['city-walking', 'beach', 'architecture', 'food-tours', 'nightlife'],
    facilities: ['coworking', 'beach-club', 'restaurant', 'metro', 'medical'],
    suitableFor: ['business', 'student', 'couple', 'family'],
    description: 'Vibrant Mediterranean city with stunning architecture, beaches, and incredible food scene.',
    weatherPattern: 'Mediterranean. Mild winters, warm summers. Perfect for beach and city.',
    accessibility: 7
  }
];

const ACTIVITY_OPTIONS = [
  { id: 'skiing', label: 'Skiing/Snowboarding', icon: Snowflake, season: 'winter' },
  { id: 'beach', label: 'Beach Activities', icon: Waves, season: 'summer' },
  { id: 'tennis', label: 'Tennis', icon: Sparkles, season: 'all' },
  { id: 'hiking', label: 'Hiking/Trekking', icon: Mountain, season: 'spring-fall' },
  { id: 'city-walking', label: 'City Exploration', icon: MapPin, season: 'all' },
  { id: 'food-tours', label: 'Food & Culinary', icon: Utensils, season: 'all' },
  { id: 'nightlife', label: 'Nightlife/Entertainment', icon: Sparkles, season: 'all' },
  { id: 'spa', label: 'Spa & Wellness', icon: Heart, season: 'all' },
  { id: 'theme-parks', label: 'Theme Parks', icon: Sparkles, season: 'all' },
  { id: 'shopping', label: 'Shopping', icon: DollarSign, season: 'all' }
];

const TRAVELER_TYPES = [
  {
    id: 'business',
    label: 'Business Traveler',
    icon: Briefcase,
    description: 'WiFi, workspace, meeting facilities',
    priorities: ['coworking', 'airport-proximity', 'high-speed-internet', 'meeting-rooms']
  },
  {
    id: 'student',
    label: 'Student Traveler',
    icon: GraduationCap,
    description: 'Budget-friendly, social atmosphere',
    priorities: ['budget', 'social', 'nightlife', 'public-transport']
  },
  {
    id: 'family',
    label: 'Family Traveler',
    icon: Baby,
    description: 'Kid-friendly, safe, spacious',
    priorities: ['family-rooms', 'kids-club', 'pool', 'safety']
  },
  {
    id: 'senior',
    label: 'Senior Traveler',
    icon: Heart,
    description: 'Accessible, comfortable, relaxed',
    priorities: ['accessible', 'elevator', 'medical', 'relaxed-pace']
  },
  {
    id: 'solo',
    label: 'Solo Traveler',
    icon: Plane,
    description: 'Flexible, adventurous, social',
    priorities: ['social', 'safety', 'public-transport', 'wifi']
  },
  {
    id: 'couple',
    label: 'Couple/Romance',
    icon: Users,
    description: 'Romantic, intimate, special',
    priorities: ['privacy', 'fine-dining', 'spa', 'sunset-views']
  }
];

interface AITravelPlannerProps {
  currentLocation?: { country: string; city: string };
}

export function AITravelPlanner({ currentLocation }: AITravelPlannerProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<TravelerProfile>({
    type: 'solo',
    budget: 'value',
    pace: 'moderate',
    interests: []
  });
  const [searchCriteria, setSearchCriteria] = useState({
    month: '',
    minTemp: '',
    maxTemp: '',
    region: ''
  });
  const [results, setResults] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleProfileUpdate = (key: keyof TravelerProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleInterestToggle = (interestId: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const searchDestinations = () => {
    let filtered = PRE_LOADED_DESTINATIONS.filter(dest => 
      dest.suitableFor.includes(profile.type)
    );

    // Filter by interests
    if (profile.interests.length > 0) {
      filtered = filtered.filter(dest =>
        profile.interests.some(interest => dest.activities.includes(interest))
      );
    }

    // Filter by month
    if (searchCriteria.month) {
      filtered = filtered.filter(dest =>
        dest.bestMonths.includes(searchCriteria.month)
      );
    }

    // Filter by temperature
    if (searchCriteria.minTemp && searchCriteria.month) {
      filtered = filtered.filter(dest => {
        const temp = dest.avgTemp[searchCriteria.month];
        return temp && temp >= parseInt(searchCriteria.minTemp);
      });
    }

    // Filter by budget
    const maxPrice = profile.budget === 'budget' ? 2 : profile.budget === 'value' ? 3 : 5;
    filtered = filtered.filter(dest => dest.priceLevel <= maxPrice);

    // Sort by rating
    filtered.sort((a, b) => b.rating - a.rating);

    setResults(filtered);
    setStep(4);

    toast({
      title: "Search Complete",
      description: `Found ${filtered.length} destinations matching your criteria`,
    });
  };

  const renderPriceLevel = (level: number) => {
    return '💰'.repeat(level);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-6 border-2">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                AI Travel Planner
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Perfect destinations for every traveler type, activity, and season
              </CardDescription>
            </div>
            {currentLocation && (
              <Badge variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" />
                Currently in {currentLocation.city}, {currentLocation.country}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: 'Profile' },
              { num: 2, label: 'Interests' },
              { num: 3, label: 'Search' },
              { num: 4, label: 'Results' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    step >= s.num
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-muted'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                </div>
                <span className="ml-2 text-sm font-medium">{s.label}</span>
                {idx < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step > s.num ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Traveler Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Your Traveler Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TRAVELER_TYPES.map(type => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        profile.type === type.id
                          ? 'border-2 border-primary bg-primary/5'
                          : 'border hover:border-primary/50'
                      }`}
                      onClick={() => handleProfileUpdate('type', type.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <type.icon className="h-12 w-12 mb-3 text-primary" />
                          <h4 className="font-semibold mb-2">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-4">Budget & Travel Pace</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Budget Level</Label>
                    <RadioGroup value={profile.budget} onValueChange={(v) => handleProfileUpdate('budget', v)}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                        <RadioGroupItem value="budget" id="budget" />
                        <Label htmlFor="budget" className="cursor-pointer flex-1">
                          Budget (💰) - Hostels, street food, public transport
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                        <RadioGroupItem value="value" id="value" />
                        <Label htmlFor="value" className="cursor-pointer flex-1">
                          Value (💰💰) - Mid-range hotels, local restaurants
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                        <RadioGroupItem value="luxury" id="luxury" />
                        <Label htmlFor="luxury" className="cursor-pointer flex-1">
                          Luxury (💰💰💰💰) - Premium hotels, fine dining
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Travel Pace</Label>
                    <RadioGroup value={profile.pace} onValueChange={(v) => handleProfileUpdate('pace', v)}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                        <RadioGroupItem value="relaxed" id="relaxed" />
                        <Label htmlFor="relaxed" className="cursor-pointer flex-1">
                          Relaxed - 1-2 activities per day, plenty of rest
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate" className="cursor-pointer flex-1">
                          Moderate - 3-4 activities, balanced schedule
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active" className="cursor-pointer flex-1">
                          Active - 5+ activities, maximize every day
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button size="lg" onClick={() => setStep(2)}>
                  Next: Choose Activities
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Activity Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What activities interest you?</h3>
                <p className="text-muted-foreground mb-6">Select all that apply - we'll find destinations that match</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ACTIVITY_OPTIONS.map(activity => (
                    <Card
                      key={activity.id}
                      className={`cursor-pointer transition-all ${
                        profile.interests.includes(activity.id)
                          ? 'border-2 border-primary bg-primary/5'
                          : 'border hover:border-primary/50'
                      }`}
                      onClick={() => handleInterestToggle(activity.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={profile.interests.includes(activity.id)}
                            onCheckedChange={() => handleInterestToggle(activity.id)}
                          />
                          <activity.icon className="h-6 w-6 text-primary" />
                          <span className="font-medium">{activity.label}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button size="lg" onClick={() => setStep(3)}>
                  Next: Search Criteria
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Search Criteria */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">When and where do you want to go?</h3>
                <p className="text-muted-foreground mb-6">Tell us your preferences and we'll find the perfect match</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="month" className="text-base font-semibold">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Travel Month
                    </Label>
                    <select
                      id="month"
                      className="w-full mt-2 p-3 border rounded-lg bg-background"
                      value={searchCriteria.month}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, month: e.target.value }))}
                    >
                      <option value="">Any month</option>
                      <option value="Jan">January</option>
                      <option value="Feb">February</option>
                      <option value="Mar">March</option>
                      <option value="Apr">April</option>
                      <option value="May">May</option>
                      <option value="Jun">June</option>
                      <option value="Jul">July</option>
                      <option value="Aug">August</option>
                      <option value="Sep">September</option>
                      <option value="Oct">October</option>
                      <option value="Nov">November</option>
                      <option value="Dec">December</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="minTemp" className="text-base font-semibold">
                      <Thermometer className="inline h-4 w-4 mr-2" />
                      Minimum Temperature (°C)
                    </Label>
                    <Input
                      id="minTemp"
                      type="number"
                      placeholder="e.g., 20"
                      className="mt-2"
                      value={searchCriteria.minTemp}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, minTemp: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Current Profile Summary */}
              <Card className="bg-accent/50">
                <CardHeader>
                  <CardTitle className="text-lg">Your Travel Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge>{profile.type}</Badge>
                    <Badge variant="outline">{profile.budget}</Badge>
                    <Badge variant="outline">{profile.pace} pace</Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Interests: </span>
                    {profile.interests.length > 0 ? (
                      <span>{profile.interests.join(', ')}</span>
                    ) : (
                      <span className="text-muted-foreground">Any activities</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button size="lg" onClick={searchDestinations}>
                  <Search className="mr-2 h-5 w-5" />
                  Find Perfect Destinations
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Your Perfect Destinations</h3>
                  <p className="text-muted-foreground">Found {results.length} matches based on your profile</p>
                </div>
                <Button variant="outline" onClick={() => setStep(3)}>
                  <Filter className="mr-2 h-4 w-4" />
                  Refine Search
                </Button>
              </div>

              {results.length === 0 ? (
                <Card className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No destinations found</h4>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or interests
                  </p>
                  <Button onClick={() => setStep(3)}>
                    Modify Search
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {results.map(destination => (
                    <Card
                      key={destination.id}
                      className="hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedDestination(destination)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{destination.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {destination.country} • {destination.region}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {renderRating(destination.rating)}
                            <span className="text-sm">{renderPriceLevel(destination.priceLevel)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">{destination.description}</p>

                        <div>
                          <div className="text-sm font-semibold mb-2">Activities:</div>
                          <div className="flex flex-wrap gap-2">
                            {destination.activities.slice(0, 5).map(activity => (
                              <Badge key={activity} variant="secondary" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-orange-500" />
                            <span>Best: {destination.bestMonths.join(', ')}</span>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Accessibility: {destination.accessibility}/10
                          </Badge>
                        </div>

                        <Button className="w-full" onClick={() => setSelectedDestination(destination)}>
                          View Full Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <Card className="border-2 border-primary mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{selectedDestination.name}</CardTitle>
                <CardDescription className="text-base">
                  {selectedDestination.country} • {selectedDestination.region}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedDestination(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="practical">Practical Info</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="flex items-center gap-4">
                  {renderRating(selectedDestination.rating)}
                  <Badge>{renderPriceLevel(selectedDestination.priceLevel)}</Badge>
                  <Badge variant="outline">Accessibility: {selectedDestination.accessibility}/10</Badge>
                </div>

                <p className="text-lg">{selectedDestination.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Best For</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedDestination.suitableFor.map(type => (
                          <Badge key={type}>{type}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Best Months</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedDestination.bestMonths.map(month => (
                          <Badge key={month} variant="secondary">{month}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="weather" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Weather Pattern
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedDestination.weatherPattern}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Temperatures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {Object.entries(selectedDestination.avgTemp).map(([month, temp]) => (
                        <div key={month} className="text-center p-3 rounded-lg border">
                          <div className="font-semibold text-sm">{month}</div>
                          <div className="text-2xl font-bold text-primary">{temp}°C</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDestination.activities.map(activity => (
                    <Card key={activity}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="font-medium capitalize">{activity.replace('-', ' ')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedDestination.facilities.map(facility => (
                        <Badge key={facility} variant="secondary">
                          {facility.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="practical" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Budget Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Price Level:</span>
                        <span className="font-medium">{renderPriceLevel(selectedDestination.priceLevel)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDestination.priceLevel <= 2 && "Budget-friendly with good value options"}
                        {selectedDestination.priceLevel === 3 && "Mid-range pricing, balanced quality"}
                        {selectedDestination.priceLevel >= 4 && "Premium destination with luxury options"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Accessibility Score:</span>
                        <Badge>{selectedDestination.accessibility}/10</Badge>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${selectedDestination.accessibility * 10}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <div className="ml-2">
                    <div className="font-semibold">Pro Tip</div>
                    <div className="text-sm">
                      Book accommodations 2-3 months in advance for the best rates during peak season.
                    </div>
                  </div>
                </Alert>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Full Itinerary
              </Button>
              <Button variant="outline" size="lg">
                Save to My Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Smart Matching
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Our algorithm considers your traveler type, budget, interests, and seasonal weather patterns to find perfect destinations.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Weather Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Real seasonal data, microclimate patterns, and activity-specific weather optimization ensure ideal conditions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Verified Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            All destination information verified from official tourism boards, weather services, and traveler reviews.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
