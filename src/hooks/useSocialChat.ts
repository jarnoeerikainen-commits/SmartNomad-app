import { useState, useCallback } from 'react';
import { SocialProfile, ChatRoom, ChatMessage, AIMatchSuggestion } from '@/types/socialChat';
import { socialProfiles, demoChatRooms, AVATAR_URLS } from '@/data/socialChatData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simulated member replies for realistic demo feel
const MEMBER_REPLIES: Record<string, string[]> = {
  default: [
    'That sounds great! Count me in 😄',
    'Thanks for sharing! Really helpful.',
    'I was just thinking the same thing!',
    'Love this idea — let\'s make it happen.',
    'Absolutely! When works best for everyone?',
    'Perfect timing — I\'m free this week.',
    'Can\'t wait! This group is the best 🙌',
  ]
};

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const useSocialChat = () => {
  const [profiles] = useState<SocialProfile[]>(socialProfiles);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(demoChatRooms);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAIMatches = useCallback(async (userProfile: Partial<SocialProfile>): Promise<AIMatchSuggestion[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('social-chat-ai', {
        body: { type: 'match', userProfile, availableProfiles: profiles }
      });
      if (error) throw error;
      return data.matches || [];
    } catch {
      // Fallback: Return top 5 online profiles with realistic data
      return profiles
        .filter(p => p.status === 'online')
        .slice(0, 5)
        .map(profile => ({
          profile,
          matchScore: Math.floor(Math.random() * 20) + 78,
          reasons: [
            `Both based in the ${profile.mobility.currentLocation.country} region`,
            `Shared interest in ${profile.professional.interests[0]}`,
            `Compatible ${profile.travelerType.replace('_', ' ')} lifestyle`
          ],
          commonInterests: profile.professional.interests.slice(0, 3),
          sharedLocations: [profile.mobility.currentLocation.city],
          conversationStarters: [
            `I see you're also into ${profile.professional.interests[0]}! What got you started?`,
            `How's the ${profile.professional.industry.toLowerCase()} scene in ${profile.mobility.currentLocation.city}?`
          ]
        }));
    } finally {
      setIsLoading(false);
    }
  }, [profiles]);

  const sendMessage = useCallback(async (
    roomId: string,
    content: string,
    senderId: string
  ): Promise<void> => {
    const sender = profiles.find(p => p.id === senderId);
    if (!sender) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      senderName: sender.basicInfo.name,
      senderAvatar: sender.basicInfo.avatar,
      content,
      timestamp: new Date(),
      type: 'message'
    };

    const updateRoom = (room: ChatRoom, msg: ChatMessage) => ({
      ...room,
      messages: [...room.messages, msg],
      lastMessage: msg.content,
      lastActivity: new Date()
    });

    setChatRooms(prev => prev.map(room => room.id === roomId ? updateRoom(room, newMessage) : room));
    if (activeChatRoom?.id === roomId) {
      setActiveChatRoom(prev => prev ? updateRoom(prev, newMessage) : prev);
    }

    // Simulate a member reply after 1.5–3s
    const room = chatRooms.find(r => r.id === roomId);
    const otherParticipants = room?.participantDetails.filter(p => p.id !== senderId) || [];
    if (otherParticipants.length > 0) {
      const replier = pickRandom(otherParticipants);
      const replyProfile = profiles.find(p => p.id === replier.id);
      const delay = 1500 + Math.random() * 1500;

      setTimeout(() => {
        const memberReply: ChatMessage = {
          id: (Date.now() + 2).toString(),
          senderId: replier.id,
          senderName: replier.name,
          senderAvatar: replyProfile?.basicInfo.avatar || replier.avatar,
          content: pickRandom(MEMBER_REPLIES.default),
          timestamp: new Date(),
          type: 'message'
        };

        setChatRooms(prev => prev.map(r => r.id === roomId ? updateRoom(r, memberReply) : r));
        setActiveChatRoom(prev => prev?.id === roomId ? updateRoom(prev, memberReply) : prev);
      }, delay);
    }

    // Get AI suggestion after member reply — pass city & interests for event discovery
    try {
      const senderProfile = profiles.find(p => p.id === senderId);
      const userCity = senderProfile?.mobility?.currentLocation?.city || '';
      const userInterests = senderProfile?.professional?.interests || [];
      const { data } = await supabase.functions.invoke('social-chat-ai', {
        body: { type: 'conversation', message: content, chatHistory: activeChatRoom?.messages || [], userCity, userInterests }
      });

      if (data?.suggestion) {
        const aiDelay = 3500 + Math.random() * 1500;
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 3).toString(),
            senderId: 'ai',
            senderName: 'SuperNomad AI',
            senderAvatar: '',
            content: data.suggestion,
            timestamp: new Date(),
            type: 'ai_suggestion',
            isAI: true
          };
          setChatRooms(prev => prev.map(r => r.id === roomId ? updateRoom(r, aiMessage) : r));
          setActiveChatRoom(prev => prev?.id === roomId ? updateRoom(prev, aiMessage) : prev);
        }, aiDelay);
      }
    } catch {
      // Silent fail for AI — member reply already provides life
    }
  }, [profiles, activeChatRoom, chatRooms]);

  const createChatRoom = useCallback((
    type: ChatRoom['type'],
    participantIds: string[],
    name?: string,
    metadata?: ChatRoom['metadata']
  ): ChatRoom => {
    const participants = profiles.filter(p => participantIds.includes(p.id));
    
    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      type,
      name: name || participants.map(p => p.basicInfo.name).join(', '),
      participants: participantIds,
      participantDetails: participants.map(p => ({
        id: p.id,
        name: p.basicInfo.name,
        avatar: p.basicInfo.avatar
      })),
      messages: [],
      unreadCount: 0,
      lastActivity: new Date(),
      metadata
    };

    setChatRooms(prev => [...prev, newRoom]);
    setActiveChatRoom(newRoom);
    
    return newRoom;
  }, [profiles]);

  const filterProfiles = useCallback((filters: {
    location?: string;
    travelerType?: string;
    status?: string;
  }) => {
    return profiles.filter(profile => {
      if (filters.location && profile.mobility.currentLocation.city !== filters.location) return false;
      if (filters.travelerType && profile.travelerType !== filters.travelerType) return false;
      if (filters.status && profile.status !== filters.status) return false;
      return true;
    });
  }, [profiles]);

  return {
    profiles,
    chatRooms,
    activeChatRoom,
    isLoading,
    setActiveChatRoom,
    getAIMatches,
    sendMessage,
    createChatRoom,
    filterProfiles
  };
};
