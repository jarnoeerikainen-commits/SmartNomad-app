import { useState } from 'react';
import { useSubjectChat } from '@/hooks/useSubjectChat';
import { SubjectChatList } from './SubjectChatList';
import { SubjectChatCreation } from './SubjectChatCreation';
import { SubjectChatRoom } from './SubjectChatRoom';
import { ChatRoom } from '@/types/subjectChat';

export const SubjectChatView = () => {
  const [view, setView] = useState<'list' | 'create' | 'room'>('list');
  const { 
    chatRooms, 
    activeChatRoom, 
    setActiveChatRoom,
    createChatRoom,
    sendMessage,
    isLoading 
  } = useSubjectChat();

  const handleCreateChat = (chatData: any) => {
    createChatRoom(chatData);
    setView('room');
  };

  const handleSelectChat = (chat: ChatRoom) => {
    setActiveChatRoom(chat);
    setView('room');
  };

  const handleBack = () => {
    setActiveChatRoom(null);
    setView('list');
  };

  if (view === 'create') {
    return (
      <SubjectChatCreation
        onCreateChat={handleCreateChat}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'room' && activeChatRoom) {
    return (
      <SubjectChatRoom
        chatRoom={activeChatRoom}
        onSendMessage={(content) => sendMessage(activeChatRoom.id, content)}
        onBack={handleBack}
        isLoading={isLoading}
      />
    );
  }

  return (
    <SubjectChatList
      chatRooms={chatRooms}
      onSelectChat={handleSelectChat}
      onCreateNew={() => setView('create')}
    />
  );
};
