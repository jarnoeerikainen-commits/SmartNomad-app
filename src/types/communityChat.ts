export interface NomadUser {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  location: string;
  interests: string[];
  isOnline: boolean;
  expertise: string[];
  socialPreference: 'introvert' | 'ambivert' | 'extrovert';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  category: string;
  members: NomadUser[];
  lastMessage?: string;
  unreadCount: number;
  icon: string;
}

export interface AIMatch {
  type: string;
  count: number;
  description: string;
  icon: string;
}
