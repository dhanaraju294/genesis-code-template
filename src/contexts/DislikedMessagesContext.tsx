import React, { createContext, useContext, useState } from 'react';

interface DislikedMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  context: string;
  reason: string;
}

interface DislikedMessagesContextType {
  dislikedMessages: DislikedMessage[];
  addDislikedMessage: (content: string) => void;
  removeDislikedMessage: (id: string) => void;
  isDisliked: (content: string) => boolean;
  getDislikedMessageByContent: (content: string) => DislikedMessage | undefined;
}

const DislikedMessagesContext = createContext<DislikedMessagesContextType | undefined>(undefined);

export function DislikedMessagesProvider({ children }: { children: React.ReactNode }) {
  const [dislikedMessages, setDislikedMessages] = useState<DislikedMessage[]>([]);

  const addDislikedMessage = (content: string) => {
    const newMessage: DislikedMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleString(),
      author: "AIVA Assistant",
      context: "Chat Session",
      reason: "Poor Quality"
    };
    setDislikedMessages(prev => [...prev, newMessage]);
  };

  const removeDislikedMessage = (id: string) => {
    setDislikedMessages(prev => prev.filter(message => message.id !== id));
  };

  const isDisliked = (content: string) => {
    return dislikedMessages.some(message => message.content === content);
  };

  const getDislikedMessageByContent = (content: string) => {
    return dislikedMessages.find(message => message.content === content);
  };

  return (
    <DislikedMessagesContext.Provider value={{
      dislikedMessages,
      addDislikedMessage,
      removeDislikedMessage,
      isDisliked,
      getDislikedMessageByContent
    }}>
      {children}
    </DislikedMessagesContext.Provider>
  );
}

export function useDislikedMessages() {
  const context = useContext(DislikedMessagesContext);
  if (context === undefined) {
    throw new Error('useDislikedMessages must be used within a DislikedMessagesProvider');
  }
  return context;
}