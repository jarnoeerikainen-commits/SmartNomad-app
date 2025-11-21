export enum ChatCategory {
  SPORTS_ACTIVITIES = 'Sports & Activities',
  PROFESSIONAL_NETWORKING = 'Professional Networking',
  CO_WORKING = 'Co-working & Productivity',
  LANGUAGE_EXCHANGE = 'Language Exchange',
  CULTURAL_EXPLORATION = 'Cultural Exploration',
  FOOD_DINING = 'Food & Dining',
  LEARNING_SKILLS = 'Learning & Skills',
  SOCIAL_EVENTS = 'Social Events',
  TRAVEL_ADVENTURE = 'Travel & Adventure',
  BUSINESS_COLLABORATION = 'Business Collaboration',
  HEALTH_WELLNESS = 'Health & Wellness',
  TECH_INNOVATION = 'Tech & Innovation',
  CREATIVE_ARTS = 'Creative Arts',
  VOLUNTEERING = 'Volunteering & Community'
}

export enum ChatDuration {
  TWO_HOURS = '2 hours',
  SIX_HOURS = '6 hours',
  ONE_DAY = '24 hours',
  THREE_DAYS = '3 days',
  ONE_WEEK = '1 week',
  CONTINUOUS = 'Continuous'
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  PROFESSIONAL = 'Professional'
}

export type PrivacyType = 'public' | 'invite-only' | 'approval-required';
export type ModeratorStrictness = 'relaxed' | 'moderate' | 'strict';

export interface ChatRoomSettings {
  privacy: PrivacyType;
  ageRange: { min: number; max: number } | 'all-ages';
  skillLevel: SkillLevel[];
  capacity: number;
  duration: ChatDuration;
  locationRadius: number;
}

export interface AIModerator {
  enabled: boolean;
  strictness: ModeratorStrictness;
  topicEnforcement: boolean;
  summaryFrequency: 'hourly' | 'daily' | 'manual';
  welcomeNewUsers: boolean;
}

export interface ChatRoomActivity {
  messages: number;
  activeParticipants: number;
  created: Date;
  expires: Date | null;
}

export interface ChatRoom {
  id: string;
  creator: string;
  creatorAvatar: string;
  subject: string;
  category: ChatCategory;
  description: string;
  settings: ChatRoomSettings;
  participants: string[];
  participantDetails: Array<{
    id: string;
    name: string;
    avatar: string;
    skillLevel?: SkillLevel;
  }>;
  waitingList: string[];
  aiModerator: AIModerator;
  activity: ChatRoomActivity;
  messages: SubjectChatMessage[];
  topicAdherence: number;
}

export interface SubjectChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
  type?: 'message' | 'summary' | 'welcome' | 'topic-suggestion';
}

export interface JoinRequest {
  userId: string;
  userName: string;
  userAvatar: string;
  chatRoomId: string;
  message: string;
  qualifications: {
    skillLevel: SkillLevel;
    experience: string;
    availability: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
}

export interface ChatFilters {
  category?: ChatCategory;
  skillLevel?: SkillLevel;
  location?: string;
  duration?: ChatDuration;
  hasSpace?: boolean;
}
