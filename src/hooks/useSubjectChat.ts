import { useState, useCallback } from 'react';
import { ChatRoom, SubjectChatMessage, ChatFilters } from '@/types/subjectChat';
import { DEMO_CHAT_ROOMS } from '@/data/subjectChatData';

export const useSubjectChat = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(DEMO_CHAT_ROOMS);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filterChatRooms = useCallback((filters: ChatFilters) => {
    return chatRooms.filter(room => {
      if (filters.category && room.category !== filters.category) return false;
      if (filters.skillLevel && !room.settings.skillLevel.includes(filters.skillLevel)) return false;
      if (filters.duration && room.settings.duration !== filters.duration) return false;
      if (filters.hasSpace && room.participants.length >= room.settings.capacity) return false;
      return true;
    });
  }, [chatRooms]);

  const createChatRoom = useCallback((newRoom: Omit<ChatRoom, 'id' | 'participants' | 'participantDetails' | 'waitingList' | 'messages' | 'topicAdherence' | 'activity'>) => {
    const chatRoom: ChatRoom = {
      ...newRoom,
      id: `chat-${Date.now()}`,
      participants: ['you'],
      participantDetails: [{ id: 'you', name: 'You', avatar: '👤' }],
      waitingList: [],
      messages: [
        {
          id: 'welcome',
          senderId: 'ai',
          senderName: 'AI Moderator',
          senderAvatar: '🤖',
          content: `Welcome to "${newRoom.subject}"! I'm your AI moderator. I'll help keep discussions on topic and welcome new members. Feel free to start the conversation!`,
          timestamp: new Date(),
          isAI: true,
          type: 'welcome'
        }
      ],
      topicAdherence: 100,
      activity: {
        messages: 1,
        activeParticipants: 1,
        created: new Date(),
        expires: newRoom.settings.duration === 'Continuous' ? null : new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    };

    setChatRooms(prev => [chatRoom, ...prev]);
    setActiveChatRoom(chatRoom);
    return chatRoom;
  }, []);

  const joinChatRoom = useCallback((roomId: string, userId: string, userName: string, userAvatar: string) => {
    setChatRooms(prev => prev.map(room => {
      if (room.id === roomId && room.participants.length < room.settings.capacity) {
        const welcomeMessage: SubjectChatMessage = {
          id: `welcome-${Date.now()}`,
          senderId: 'ai',
          senderName: 'AI Moderator',
          senderAvatar: '🤖',
          content: `Welcome ${userName}! We're currently discussing ${room.subject}. Feel free to jump in and share your thoughts!`,
          timestamp: new Date(),
          isAI: true,
          type: 'welcome'
        };

        return {
          ...room,
          participants: [...room.participants, userId],
          participantDetails: [...room.participantDetails, { id: userId, name: userName, avatar: userAvatar }],
          messages: [...room.messages, welcomeMessage],
          activity: {
            ...room.activity,
            activeParticipants: room.activity.activeParticipants + 1,
            messages: room.activity.messages + 1
          }
        };
      }
      return room;
    }));
  }, []);

  const sendMessage = useCallback(async (roomId: string, content: string) => {
    const userMessage: SubjectChatMessage = {
      id: Date.now().toString(),
      senderId: 'you',
      senderName: 'You',
      senderAvatar: '👤',
      content,
      timestamp: new Date()
    };

    setChatRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          messages: [...room.messages, userMessage],
          activity: {
            ...room.activity,
            messages: room.activity.messages + 1
          }
        };
      }
      return room;
    }));

    if (activeChatRoom && activeChatRoom.aiModerator.enabled) {
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subject-chat-moderator`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({
            message: content,
            context: {
              chatSubject: activeChatRoom.subject,
              category: activeChatRoom.category,
              recentMessages: activeChatRoom.messages.slice(-5),
              strictness: activeChatRoom.aiModerator.strictness,
              topicEnforcement: activeChatRoom.aiModerator.topicEnforcement
            }
          })
        });

        if (response.ok) {
          const data = await response.json();

          const aiMessage: SubjectChatMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai',
            senderName: 'AI Moderator',
            senderAvatar: '🤖',
            content: data.response,
            timestamp: new Date(),
            isAI: true
          };

          setChatRooms(prev => prev.map(room => {
            if (room.id === roomId) {
              return {
                ...room,
                messages: [...room.messages, aiMessage],
                activity: {
                  ...room.activity,
                  messages: room.activity.messages + 1
                }
              };
            }
            return room;
          }));
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        const fallbackMessage: SubjectChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          senderName: 'AI Moderator',
          senderAvatar: '🤖',
          content: 'Great contribution! Keep the discussion going. Does anyone else have thoughts on this?',
          timestamp: new Date(),
          isAI: true
        };

        setChatRooms(prev => prev.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              messages: [...room.messages, fallbackMessage]
            };
          }
          return room;
        }));
      } finally {
        setIsLoading(false);
      }
    }
  }, [activeChatRoom]);

  return {
    chatRooms,
    activeChatRoom,
    setActiveChatRoom,
    filterChatRooms,
    createChatRoom,
    joinChatRoom,
    sendMessage,
    isLoading
  };
};
