import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Bookmark {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  type: string;
  content: string;
}

interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (content: string, title?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (content: string) => boolean;
  getBookmarkByContent: (content: string) => Bookmark | undefined;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

interface BookmarksProviderProps {
  children: ReactNode;
}

export const BookmarksProvider: React.FC<BookmarksProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: "1",
      title: "Monthly Sales Report - Q4 2024",
      description: "Comprehensive analysis of Q4 sales performance with visualizations",
      category: "Reports",
      date: "2024-01-15",
      type: "conversation",
      content: "Monthly sales report content..."
    },
    {
      id: "2",
      title: "Team Collaboration Best Practices",
      description: "Guidelines and tips for effective team collaboration using AIVA",
      category: "Documentation",
      date: "2024-01-12",
      type: "resource",
      content: "Team collaboration content..."
    },
    {
      id: "3",
      title: "Client Onboarding Process",
      description: "Step-by-step guide for onboarding new clients",
      category: "Process",
      date: "2024-01-10",
      type: "guide",
      content: "Client onboarding content..."
    },
    {
      id: "4",
      title: "Data Visualization Templates",
      description: "Collection of chart templates for different data types",
      category: "Templates",
      date: "2024-01-08",
      type: "resource",
      content: "Data visualization content..."
    }
  ]);

  const addBookmark = (content: string, title?: string) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: title || content.slice(0, 50) + (content.length > 50 ? '...' : ''),
      description: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      category: "Conversation",
      date: new Date().toISOString().split('T')[0],
      type: "conversation",
      content
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const isBookmarked = (content: string) => {
    return bookmarks.some(bookmark => bookmark.content === content);
  };

  const getBookmarkByContent = (content: string) => {
    return bookmarks.find(bookmark => bookmark.content === content);
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, getBookmarkByContent }}>
      {children}
    </BookmarksContext.Provider>
  );
};