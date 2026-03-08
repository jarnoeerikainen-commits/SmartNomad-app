import { useState, useCallback } from 'react';
import { SocialProfile, ChatRoom, ChatMessage, AIMatchSuggestion } from '@/types/socialChat';
import { socialProfiles, demoChatRooms, AVATAR_URLS } from '@/data/socialChatData';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { supabase } from '@/integrations/supabase/client';

// Simulated member replies - context-aware
const MEMBER_REPLIES: string[] = [
  'That sounds great! Count me in 😄',
  'Thanks for sharing! Really helpful.',
  'I was just thinking the same thing!',
  'Love this idea — let\'s make it happen.',
  'Absolutely! When works best for everyone?',
  'Perfect timing — I\'m free this week.',
  'Can\'t wait! This group is the best 🙌',
  'Good to know! I\'ll check that out.',
  'Haha yes! Let\'s definitely do this.',
  'That\'s exactly what I needed to hear 🙏',
  'Great point! I totally agree.',
  'Oh wow, I didn\'t know that. Thanks!',
  'Count me in! What time?',
  'This is why I love this community ❤️',
  'Just sent you a DM about it!',
];

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const useSocialChat = () => {
  const [profiles] = useState<SocialProfile[]>(socialProfiles);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(demoChatRooms);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { activePersona } = useDemoPersona();

  // Determine current user ID based on persona
  const getCurrentUserId = useCallback(() => {
    if (activePersona?.id === 'meghan') return 'meghan';
    if (activePersona?.id === 'john') return 'john';
    return 'demo-user';
  }, [activePersona?.id]);

  const getCurrentUserName = useCallback(() => {
    if (activePersona?.id === 'meghan') return activePersona.profile.firstName + ' ' + activePersona.profile.lastName;
    if (activePersona?.id === 'john') return activePersona.profile.firstName + ' ' + activePersona.profile.lastName;
    return 'You';
  }, [activePersona]);

  const getAIMatches = useCallback(async (userProfile: Partial<SocialProfile>): Promise<AIMatchSuggestion[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('social-chat-ai', {
        body: { type: 'match', userProfile, availableProfiles: profiles.slice(0, 20) }
      });
      if (error) throw error;
      return data.matches || [];
    } catch {
      // Fallback: Return top profiles with realistic data
      return profiles
        .filter(p => p.status === 'online')
        .slice(0, 8)
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
    const userId = getCurrentUserId();
    const userName = getCurrentUserName();
    const isCurrentUser = senderId === userId || senderId === 'demo-user';

    // Find sender info
    const senderProfile = isCurrentUser ? null : profiles.find(p => p.id === senderId);
    const senderName = isCurrentUser ? userName : (senderProfile?.basicInfo.name || 'Unknown');
    const senderAvatar = isCurrentUser ? '' : (senderProfile?.basicInfo.avatar || '');

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: isCurrentUser ? userId : senderId,
      senderName,
      senderAvatar,
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
    const room = chatRooms.find(r => r.id === roomId) || activeChatRoom;
    const otherParticipants = room?.participantDetails.filter(p => p.id !== userId && p.id !== 'demo-user') || [];
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
          content: pickRandom(MEMBER_REPLIES),
          timestamp: new Date(),
          type: 'message'
        };

        setChatRooms(prev => prev.map(r => r.id === roomId ? updateRoom(r, memberReply) : r));
        setActiveChatRoom(prev => prev?.id === roomId ? updateRoom(prev, memberReply) : prev);
      }, delay);
    }

    // Get AI suggestion
    try {
      const userCity = activePersona?.profile.city || '';
      const userInterests = activePersona?.lifestyle?.sports || [];
      const { data } = await supabase.functions.invoke('social-chat-ai', {
        body: { type: 'conversation', message: content, chatHistory: activeChatRoom?.messages?.slice(-10) || [], userCity, userInterests }
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
      // Silent fail for AI
    }
  }, [profiles, activeChatRoom, chatRooms, getCurrentUserId, getCurrentUserName, activePersona]);

  const createChatRoom = useCallback((
    type: ChatRoom['type'],
    participantIds: string[],
    name?: string,
    metadata?: ChatRoom['metadata']
  ): ChatRoom => {
    const participants = profiles.filter(p => participantIds.includes(p.id));
    const userId = getCurrentUserId();
    const userName = getCurrentUserName();

    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      type,
      name: name || participants.map(p => p.basicInfo.name).join(', '),
      participants: [userId, ...participantIds],
      participantDetails: [
        { id: userId, name: userName, avatar: '' },
        ...participants.map(p => ({
          id: p.id,
          name: p.basicInfo.name,
          avatar: p.basicInfo.avatar
        }))
      ],
      messages: [],
      unreadCount: 0,
      lastActivity: new Date(),
      metadata
    };

    setChatRooms(prev => [...prev, newRoom]);
    setActiveChatRoom(newRoom);

    // Auto-generate a welcome message from the other participant
    if (participants.length === 1) {
      const other = participants[0];
      const greetings = [
        `Hey ${userName}! 👋 Nice to connect. I see you're into ${other.professional.interests[0]} too!`,
        `Hi there! Great to meet you. I noticed we're both in the ${other.professional.industry} space. What are you working on?`,
        `Welcome! 🙌 Always happy to connect with fellow travelers. What brings you to ${other.mobility.currentLocation.city}?`,
        `Hey! So glad you reached out. I've been looking for someone to chat with about ${other.professional.interests[1] || other.professional.interests[0]}.`,
        `Hi ${userName}! 😄 Love connecting with people on SuperNomad. How's your day going?`,
      ];

      setTimeout(() => {
        const welcomeMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: other.id,
          senderName: other.basicInfo.name,
          senderAvatar: other.basicInfo.avatar,
          content: pickRandom(greetings),
          timestamp: new Date(),
          type: 'message'
        };
        const updatedRoom = { ...newRoom, messages: [welcomeMsg], lastMessage: welcomeMsg.content };
        setChatRooms(prev => prev.map(r => r.id === newRoom.id ? updatedRoom : r));
        setActiveChatRoom(prev => prev?.id === newRoom.id ? updatedRoom : prev);
      }, 800);
    }

    return newRoom;
  }, [profiles, getCurrentUserId, getCurrentUserName]);

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
    filterProfiles,
    getCurrentUserId,
  };
};
