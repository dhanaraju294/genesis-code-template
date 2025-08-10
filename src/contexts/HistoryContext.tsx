import React, { createContext, useContext, useState } from 'react';

interface HistoryItem {
  id: string;
  title: string;
  type: string;
  timestamp: string;
  duration: string;
  messageCount: number;
  summary: string;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (title: string, summary: string) => void;
  removeHistoryItem: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const addHistoryItem = (title: string, summary: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title,
      type: "Chat",
      timestamp: new Date().toLocaleString(),
      duration: "5 minutes",
      messageCount: 1,
      summary
    };
    setHistoryItems(prev => [...prev, newItem]);
  };

  const removeHistoryItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{
      historyItems,
      addHistoryItem,
      removeHistoryItem
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