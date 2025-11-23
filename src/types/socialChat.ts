export type TravelerType = 
  | 'digital_nomad' 
  | 'business_traveler' 
  | 'student' 
  | 'expat' 
  | 'aviation' 
  | 'tourist'
  | 'conference_attendee'
  | 'trade_show_visitor';

export type ConnectionType = 'friendship' | 'professional' | 'dating' | 'mentorship';
export type VisibilityLevel = 'public' | 'connections' | 'private';
export type VerificationLevel = 'basic' | 'verified' | 'premium';
export type OnlineStatus = 'online' | 'away' | 'offline';

export interface FutureLocation {
  city: string;
  country: string;
  arrivalDate: Date;
  departureDate?: Date;
  purpose: string;
  visibility: VisibilityLevel;
}

export interface SocialProfile {
  id: string;
  basicInfo: {
    name: string;
    avatar: string;
    age: number;
    languages: string[];
    tagline: string;
  };
  travelerType: TravelerType;
  professional: {
    industry: string;
    company: string;
    skills: string[];
    interests: string[];
  };
  mobility: {
    currentLocation: {
      city: string;
      country: string;
      since: Date;
    };
    nextDestinations: FutureLocation[];
    travelFrequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  };
  socialPreferences: {
    connectionTypes: ConnectionType[];
    lookingFor: string;
    visibility: VisibilityLevel;
  };
  verification: {
    level: VerificationLevel;
    badges: string[];
    trustScore: number;
  };
  status: OnlineStatus;
  lastActive: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'ai_suggestion' | 'system';
  isAI?: boolean;
}

export interface ChatRoom {
  id: string;
  type: 'one_on_one' | 'group' | 'location' | 'professional' | 'interest' | 'event';
  name: string;
  participants: string[];
  participantDetails: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: string;
  lastActivity: Date;
  metadata?: {
    location?: string;
    event?: string;
    purpose?: string;
  };
}

export interface AIMatchSuggestion {
  profile: SocialProfile;
  matchScore: number;
  reasons: string[];
  commonInterests: string[];
  sharedLocations: string[];
  conversationStarters: string[];
}

export interface TravelEvent {
  id: string;
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  type: 'arrival' | 'departure' | 'meetup' | 'event';
}
