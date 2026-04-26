import { useState, useCallback, useEffect, useRef } from 'react';
import { SocialProfile, ChatRoom, ChatMessage, AIMatchSuggestion } from '@/types/socialChat';
import { socialProfiles, demoChatRooms, AVATAR_URLS } from '@/data/socialChatData';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { supabase } from '@/integrations/supabase/client';
import { AdminAgentActivityService } from '@/services/AdminAgentActivityService';

const FALLBACK_REPLIES: string[] = [
  'That sounds great! Count me in 😄',
  'Thanks for sharing! Really helpful.',
  'I was just thinking the same thing!',
  'Love this idea — let\'s make it happen.',
  'Absolutely! When works best for everyone?',
  'Perfect timing — I\'m free this week.',
];
const FALLBACK_QUICK = ['Sounds great 👍', 'Tell me more', 'When works for you?'];

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface TypingMember { id: string; name: string; avatar: string }

export const useSocialChat = () => {
  const [profiles] = useState<SocialProfile[]>(socialProfiles);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(demoChatRooms);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingByRoom, setTypingByRoom] = useState<Record<string, TypingMember[]>>({});
  const [quickRepliesByRoom, setQuickRepliesByRoom] = useState<Record<string, string[]>>({});
  const [quickLoadingByRoom, setQuickLoadingByRoom] = useState<Record<string, boolean>>({});
  const nudgeTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lastActivityByRoom = useRef<Record<string, number>>({});
  const { activePersona } = useDemoPersona();

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
    const runId = AdminAgentActivityService.startRun({ surface: 'Social Match AI', command: 'Find compatible social matches', functionName: 'social-chat-ai' });
    try {
      const { data, error } = await supabase.functions.invoke('social-chat-ai', {
        body: { type: 'match', userProfile, availableProfiles: profiles.slice(0, 20) },
      });
      if (error) throw error;
      AdminAgentActivityService.completeRun(runId, `Matched ${(data.matches || []).length} profiles using verified demo profile and community context.`);
      return data.matches || [];
    } catch {
      AdminAgentActivityService.failRun(runId, 'Social match AI unavailable; fallback suggestions shown.');
      return profiles.filter(p => p.status === 'online').slice(0, 8).map(profile => ({
        profile,
        matchScore: Math.floor(Math.random() * 20) + 78,
        reasons: [
          `Both based in the ${profile.mobility.currentLocation.country} region`,
          `Shared interest in ${profile.professional.interests[0]}`,
          `Compatible ${profile.travelerType.replace('_', ' ')} lifestyle`,
        ],
        commonInterests: profile.professional.interests.slice(0, 3),
        sharedLocations: [profile.mobility.currentLocation.city],
        conversationStarters: [
          `I see you're also into ${profile.professional.interests[0]}! What got you started?`,
          `How's the ${profile.professional.industry.toLowerCase()} scene in ${profile.mobility.currentLocation.city}?`,
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [profiles]);

  const updateRoomMessage = useCallback((roomId: string, msg: ChatMessage) => {
    setChatRooms(prev => prev.map(r => r.id === roomId ? { ...r, messages: [...r.messages, msg], lastMessage: msg.content, lastActivity: new Date() } : r));
    setActiveChatRoom(prev => prev?.id === roomId ? { ...prev, messages: [...prev.messages, msg], lastMessage: msg.content, lastActivity: new Date() } : prev);
    lastActivityByRoom.current[roomId] = Date.now();
  }, []);

  const refreshQuickReplies = useCallback(async (roomId: string, lastMsg: ChatMessage, room: ChatRoom) => {
    setQuickLoadingByRoom(prev => ({ ...prev, [roomId]: true }));
    try {
      const { data } = await supabase.functions.invoke('community-orchestrator', {
        body: {
          mode: 'quick_replies',
          location: activePersona?.profile.city || '',
          lastMessage: lastMsg.content,
          lastSenderName: lastMsg.senderName,
          recentMessages: room.messages.slice(-6).map(m => ({ senderName: m.senderName, content: m.content, isAI: m.isAI })),
        },
      });
      const s = (data?.suggestions as string[] | undefined)?.filter(x => typeof x === 'string' && x.trim()).slice(0, 3) || FALLBACK_QUICK;
      setQuickRepliesByRoom(prev => ({ ...prev, [roomId]: s }));
    } catch {
      setQuickRepliesByRoom(prev => ({ ...prev, [roomId]: FALLBACK_QUICK }));
    } finally {
      setQuickLoadingByRoom(prev => ({ ...prev, [roomId]: false }));
    }
  }, [activePersona]);

  const scheduleNudge = useCallback((roomId: string) => {
    if (nudgeTimers.current[roomId]) clearTimeout(nudgeTimers.current[roomId]);
    nudgeTimers.current[roomId] = setTimeout(async () => {
      const room = chatRooms.find(r => r.id === roomId);
      if (!room) return;
      const last = room.messages[room.messages.length - 1];
      if (last?.isAI) return;
      if (Date.now() - (lastActivityByRoom.current[roomId] || 0) < 14000) return;
      try {
        const otherIds = room.participants.filter(p => p !== getCurrentUserId() && p !== 'demo-user');
        const memberPool = otherIds.map(id => {
          const p = profiles.find(pr => pr.id === id);
          return p ? { id: p.id, name: p.basicInfo.name, profession: p.professional.industry, interests: p.professional.interests } : null;
        }).filter(Boolean);
        const { data } = await supabase.functions.invoke('community-orchestrator', {
          body: {
            mode: 'ai_nudge',
            location: room.metadata?.location || activePersona?.profile.city || '',
            recentMessages: room.messages.slice(-8).map(m => ({ senderName: m.senderName, content: m.content, isAI: m.isAI })),
            members: memberPool,
          },
        });
        const text = (data?.message as string | undefined)?.trim();
        if (text) {
          updateRoomMessage(roomId, {
            id: `nudge-${Date.now()}`,
            senderId: 'ai',
            senderName: 'SuperNomad AI',
            senderAvatar: '',
            content: text,
            timestamp: new Date(),
            type: 'ai_suggestion',
            isAI: true,
          });
        }
      } catch { /* silent */ }
    }, 15000);
  }, [chatRooms, profiles, activePersona, getCurrentUserId, updateRoomMessage]);

  // Schedule nudge on active room change / message change
  useEffect(() => {
    if (activeChatRoom) scheduleNudge(activeChatRoom.id);
    return () => {
      Object.values(nudgeTimers.current).forEach(t => clearTimeout(t));
    };
  }, [activeChatRoom?.id, activeChatRoom?.messages.length, scheduleNudge]);

  const sendMessage = useCallback(async (
    roomId: string,
    content: string,
    senderId: string,
  ): Promise<void> => {
    const userId = getCurrentUserId();
    const userName = getCurrentUserName();
    const isCurrentUser = senderId === userId || senderId === 'demo-user';

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
      type: 'message',
    };

    updateRoomMessage(roomId, newMessage);
    setQuickRepliesByRoom(prev => ({ ...prev, [roomId]: [] }));

    const room = chatRooms.find(r => r.id === roomId) || activeChatRoom;
    if (!room) return;
    const otherParticipants = room.participantDetails.filter(p => p.id !== userId && p.id !== 'demo-user');

    // Typing indicators
    const typers = otherParticipants.slice(0, 2).map(p => {
      const prof = profiles.find(x => x.id === p.id);
      return { id: p.id, name: p.name, avatar: prof?.basicInfo.avatar || p.avatar };
    });
    setTypingByRoom(prev => ({ ...prev, [roomId]: typers }));

    // Orchestrated replies
    let replies: Array<{ memberId: string; memberName: string; content: string }> = [];
    const runId = AdminAgentActivityService.startRun({ surface: 'Social Chat', command: content, functionName: 'community-orchestrator' });
    try {
      const memberPool = otherParticipants.map(p => {
        const prof = profiles.find(x => x.id === p.id);
        return { id: p.id, name: p.name, profession: prof?.professional.industry, interests: prof?.professional.interests };
      });
      const { data } = await supabase.functions.invoke('community-orchestrator', {
        body: {
          mode: 'replies',
          location: room.metadata?.location || activePersona?.profile.city || '',
          lastMessage: content,
          lastSenderName: userName,
          recentMessages: room.messages.slice(-8).map(m => ({ senderName: m.senderName, content: m.content, isAI: m.isAI })),
          members: memberPool,
        },
      });
      replies = (data?.replies as any[] | undefined) || [];
      AdminAgentActivityService.completeRun(runId, `Generated ${replies.length} community replies and quick-response context.`);
    } catch {
      AdminAgentActivityService.failRun(runId, 'Community orchestrator unavailable; local fallback reply used.');
      if (otherParticipants.length > 0) {
        const r = pickRandom(otherParticipants);
        replies = [{ memberId: r.id, memberName: r.name, content: pickRandom(FALLBACK_REPLIES) }];
      }
    }

    let cumulative = 1500;
    replies.forEach((r, idx) => {
      const delay = cumulative + Math.random() * 800;
      cumulative += 1600;
      setTimeout(() => {
        const detail = otherParticipants.find(p => p.id === r.memberId) || otherParticipants.find(p => p.name === r.memberName) || otherParticipants[idx % Math.max(otherParticipants.length, 1)];
        if (!detail) return;
        const prof = profiles.find(x => x.id === detail.id);
        const replyMsg: ChatMessage = {
          id: `m-${Date.now()}-${idx}`,
          senderId: detail.id,
          senderName: detail.name,
          senderAvatar: prof?.basicInfo.avatar || detail.avatar,
          content: r.content,
          timestamp: new Date(),
          type: 'message',
        };
        updateRoomMessage(roomId, replyMsg);
        setTypingByRoom(prev => ({ ...prev, [roomId]: (prev[roomId] || []).filter(t => t.id !== detail.id) }));
        // Refresh quick replies after the last member reply
        if (idx === replies.length - 1) {
          const updatedRoom = { ...room, messages: [...room.messages, newMessage, replyMsg] };
          refreshQuickReplies(roomId, replyMsg, updatedRoom);
        }
      }, delay);
    });
    setTimeout(() => setTypingByRoom(prev => ({ ...prev, [roomId]: [] })), cumulative + 200);

    // If no replies came back, refresh quick replies from user message
    if (replies.length === 0) {
      refreshQuickReplies(roomId, newMessage, room);
    }
  }, [profiles, activeChatRoom, chatRooms, getCurrentUserId, getCurrentUserName, activePersona, updateRoomMessage, refreshQuickReplies]);

  const createChatRoom = useCallback((
    type: ChatRoom['type'],
    participantIds: string[],
    name?: string,
    metadata?: ChatRoom['metadata'],
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
        ...participants.map(p => ({ id: p.id, name: p.basicInfo.name, avatar: p.basicInfo.avatar })),
      ],
      messages: [],
      unreadCount: 0,
      lastActivity: new Date(),
      metadata,
    };

    setChatRooms(prev => [...prev, newRoom]);
    setActiveChatRoom(newRoom);

    if (participants.length === 1) {
      const other = participants[0];
      const greetings = [
        `Hey ${userName}! 👋 Nice to connect. I see you're into ${other.professional.interests[0]} too!`,
        `Hi there! Great to meet you. I noticed we're both in the ${other.professional.industry} space. What are you working on?`,
        `Welcome! 🙌 Always happy to connect with fellow travelers. What brings you to ${other.mobility.currentLocation.city}?`,
        `Hey! So glad you reached out. I've been looking for someone to chat with about ${other.professional.interests[1] || other.professional.interests[0]}.`,
      ];
      setTimeout(() => {
        const welcomeMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: other.id,
          senderName: other.basicInfo.name,
          senderAvatar: other.basicInfo.avatar,
          content: pickRandom(greetings),
          timestamp: new Date(),
          type: 'message',
        };
        const updatedRoom = { ...newRoom, messages: [welcomeMsg], lastMessage: welcomeMsg.content };
        setChatRooms(prev => prev.map(r => r.id === newRoom.id ? updatedRoom : r));
        setActiveChatRoom(prev => prev?.id === newRoom.id ? updatedRoom : prev);
      }, 800);
    }

    return newRoom;
  }, [profiles, getCurrentUserId, getCurrentUserName]);

  const filterProfiles = useCallback((filters: { location?: string; travelerType?: string; status?: string }) => {
    return profiles.filter(profile => {
      if (filters.location && profile.mobility.currentLocation.city !== filters.location) return false;
      if (filters.travelerType && profile.travelerType !== filters.travelerType) return false;
      if (filters.status && profile.status !== filters.status) return false;
      return true;
    });
  }, [profiles]);

  const pickQuickReply = useCallback((roomId: string, text: string) => {
    sendMessage(roomId, text, getCurrentUserId());
  }, [sendMessage, getCurrentUserId]);

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
    typingByRoom,
    quickRepliesByRoom,
    quickLoadingByRoom,
    pickQuickReply,
  };
};
