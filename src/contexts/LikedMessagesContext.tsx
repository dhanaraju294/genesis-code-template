import React, { createContext, useContext, useState } from 'react';

interface LikedMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  context: string;
}

interface LikedMessagesContextType {
  likedMessages: LikedMessage[];
  addLikedMessage: (content: string) => void;
  removeLikedMessage: (id: string) => void;
  isLiked: (content: string) => boolean;
  getLikedMessageByContent: (content: string) => LikedMessage | undefined;
}

const LikedMessagesContext = createContext<LikedMessagesContextType | undefined>(undefined);

export function LikedMessagesProvider({ children }: { children: React.ReactNode }) {
  const [likedMessages, setLikedMessages] = useState<LikedMessage[]>([]);

  const addLikedMessage = (content: string) => {
    const newMessage: LikedMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleString(),
      author: "AIVA Assistant",
      context: "Chat Session"
    };
    setLikedMessages(prev => [...prev, newMessage]);
  };

  const removeLikedMessage = (id: string) => {
    setLikedMessages(prev => prev.filter(message => message.id !== id));
  };

  const isLiked = (content: string) => {
    return likedMessages.some(message => message.content === content);
  };

  const getLikedMessageByContent = (content: string) => {
    return likedMessages.find(message => message.content === content);
  };

  return (
    <LikedMessagesContext.Provider value={{
      likedMessages,
      addLikedMessage,
      removeLikedMessage,
      isLiked,
      getLikedMessageByContent
    }}>
      {children}
    </LikedMessagesContext.Provider>
  );
}

export function useLikedMessages() {
  const context = useContext(LikedMessagesContext);
  if (context === undefined) {
    throw new Error('useLikedMessages must be used within a LikedMessagesProvider');
  }
  return context;
}