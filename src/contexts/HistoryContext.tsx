import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Message } from './ChatContext';

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

interface HistoryContextType {
  chatSessions: ChatSession[];
  addChatSession: (session: ChatSession) => void;
  removeChatSession: (id: string) => void;
  clearHistory: () => void;
  loadChatSession: (id: string) => ChatSession | undefined;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('aiva-chat-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aiva-chat-history', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const addChatSession = (session: ChatSession) => {
    setChatSessions(prev => [session, ...prev]);
  };

  const removeChatSession = (id: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== id));
  };

  const clearHistory = () => {
    setChatSessions([]);
    localStorage.removeItem('aiva-chat-history');
  };

  const loadChatSession = (id: string) => {
    return chatSessions.find(session => session.id === id);
  };

  return (
    <HistoryContext.Provider value={{
      chatSessions,
      addChatSession,
      removeChatSession,
      clearHistory,
      loadChatSession
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}