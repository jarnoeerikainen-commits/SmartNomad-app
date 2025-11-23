import { useState, useCallback } from 'react';
import { SocialProfile, ChatRoom, ChatMessage, AIMatchSuggestion } from '@/types/socialChat';
import { socialProfiles, demoChatRooms } from '@/data/socialChatData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSocialChat = () => {
  const [profiles] = useState<SocialProfile[]>(socialProfiles);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(demoChatRooms);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAIMatches = useCallback(async (userProfile: Partial<SocialProfile>): Promise<AIMatchSuggestion[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('social-chat-ai', {
        body: {
          type: 'match',
          userProfile,
          availableProfiles: profiles
        }
      });

      if (error) throw error;

      return data.matches || [];
    } catch (error) {
      console.error('Error getting AI matches:', error);
      toast.error('Failed to get AI match suggestions');
      
      // Fallback: Return top 5 online profiles
      return profiles
        .filter(p => p.status === 'online')
        .slice(0, 5)
        .map(profile => ({
          profile,
          matchScore: Math.floor(Math.random() * 30) + 70,
          reasons: ['Location overlap', 'Shared interests'],
          commonInterests: profile.professional.interests.slice(0, 2),
          sharedLocations: [profile.mobility.currentLocation.city],
          conversationStarters: [
            `I see you're also interested in ${profile.professional.interests[0]}!`,
            `How's life in ${profile.mobility.currentLocation.city}?`
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

    setChatRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          messages: [...room.messages, newMessage],
          lastMessage: content,
          lastActivity: new Date()
        };
      }
      return room;
    }));

    // Get AI conversation assistance
    try {
      const { data } = await supabase.functions.invoke('social-chat-ai', {
        body: {
          type: 'conversation',
          message: content,
          chatHistory: activeChatRoom?.messages || []
        }
      });

      if (data?.suggestion) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          senderName: 'AI Assistant',
          senderAvatar: '',
          content: data.suggestion,
          timestamp: new Date(),
          type: 'ai_suggestion',
          isAI: true
        };

        setTimeout(() => {
          setChatRooms(prev => prev.map(room => {
            if (room.id === roomId) {
              return {
                ...room,
                messages: [...room.messages, aiMessage]
              };
            }
            return room;
          }));
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting AI conversation help:', error);
    }
  }, [profiles, activeChatRoom]);

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
      if (filters.location && profile.mobility.currentLocation.city !== filters.location) {
        return false;
      }
      if (filters.travelerType && profile.travelerType !== filters.travelerType) {
        return false;
      }
      if (filters.status && profile.status !== filters.status) {
        return false;
      }
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
