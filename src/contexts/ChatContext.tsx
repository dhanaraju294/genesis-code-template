import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  hasChart?: boolean;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  initializeMessages: (userName?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const initializeMessages = (userName?: string) => {
    // Only initialize if there are no messages
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "1",
        role: "assistant",
        content: `Hey ${userName || 'there'}! How can I assist you?`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      addMessage,
      clearMessages,
      initializeMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}