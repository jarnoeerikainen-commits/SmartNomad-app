import { useState } from 'react';
import { useSubjectChat } from '@/hooks/useSubjectChat';
import { SubjectChatList } from './SubjectChatList';
import { SubjectChatCreation } from './SubjectChatCreation';
import { SubjectChatRoom } from './SubjectChatRoom';
import { ChatRoom } from '@/types/subjectChat';

interface SubjectChatViewProps {
  initialView?: 'list' | 'create';
  onViewChange?: (view: 'list' | 'create' | 'room') => void;
}

export const SubjectChatView = ({ initialView = 'list', onViewChange }: SubjectChatViewProps = {}) => {
  const [view, setView] = useState<'list' | 'create' | 'room'>(initialView);
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
    const newView = 'room';
    setView(newView);
    onViewChange?.(newView);
  };

  const handleSelectChat = (chat: ChatRoom) => {
    setActiveChatRoom(chat);
    const newView = 'room';
    setView(newView);
    onViewChange?.(newView);
  };

  const handleBack = () => {
    setActiveChatRoom(null);
    const newView = 'list';
    setView(newView);
    onViewChange?.(newView);
  };

  const handleStartCreate = () => {
    const newView = 'create';
    setView(newView);
    onViewChange?.(newView);
  };

  const handleCancelCreate = () => {
    const newView = 'list';
    setView(newView);
    onViewChange?.(newView);
  };

  if (view === 'create') {
    return (
      <SubjectChatCreation
        onCreateChat={handleCreateChat}
        onCancel={handleCancelCreate}
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
      onCreateNew={handleStartCreate}
    />
  );
};
