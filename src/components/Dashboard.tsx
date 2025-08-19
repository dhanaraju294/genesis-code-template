import React, { useState, useRef, useEffect } from 'react';
import DataQueryPanel from './DataQueryPanel';
import AboutAIVA from './AboutAIVA';
import BookmarksPage from './BookmarksPage';
import LikedMessagesPage from './LikedMessagesPage';
import DislikedMessagesPage from './DislikedMessagesPage';
import HistoryPage from './HistoryPage';
import WorkspacesPage from './WorkspacesPage';
import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, Packer, OnOffElement } from 'docx';
import { saveAs } from 'file-saver';
import { 
  Menu, 
  Building2, 
  Bookmark, 
  User, 
  Heart, 
  HeartOff, 
  History, 
  MessageSquare,
  Copy,
  Download,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Star,
  Send,
  Mic,
  Plus,
  ChevronDown,
  UserPlus,
  RefreshCw,
  Users,
  LogOut,
  X,
  Image,
  File,
  Paperclip,
  Share2,
  Mail
} from 'lucide-react';
import { Database, BarChart3, Table } from 'lucide-react';

interface DashboardProps {
  user?: any;
  onLogout: () => void;
  onSwitchAccount: () => void;
  onNavigateToHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onSwitchAccount, onNavigateToHome, user}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<'chat' | 'about' | 'bookmarks' | 'liked' | 'disliked' | 'history' | 'workspaces' | 'data'>('chat');
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: string}>>([
    {
      id: '1',
      text: 'Hey Sodadasiswaroop! How can I assist you?',
      isUser: false,
      timestamp: '3:42:31 PM'
    }
  ]);
  const generateAvatar = (name: string): string => {
  if (!name) return 'U';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase();
};

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadingMessage, setDownloadingMessage] = useState<{id: string, text: string} | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingMessage, setSharingMessage] = useState<{id: string, text: string} | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [messageActions, setMessageActions] = useState<{[key: string]: {
    liked: boolean;
    disliked: boolean;
    starred: boolean;
    bookmarked: boolean;
  }}>({});
  const [copyingMessageId, setCopyingMessageId] = useState<string | null>(null);
  
  // Chat scroll reference
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Data-related state
  const [availableDatasets, setAvailableDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [useDataAgent, setUseDataAgent] = useState(false);
  const [dataQueryResults, setDataQueryResults] = useState<any>(null);

  // Chat history state
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    messageCount: number;
    lastMessage: string;
    messages: Array<{id: string, text: string, isUser: boolean, timestamp: string}>;
  }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Function to handle new chat creation
  const handleNewChat = () => {
    // Save current chat to history if it has more than just the initial message
    if (messages.length > 1 && currentChatId) {
      const lastUserMessage = messages.filter(msg => msg.isUser).pop();
      const lastAIMessage = messages.filter(msg => !msg.isUser).pop();
      
      const chatToSave = {
        id: currentChatId,
        title: lastUserMessage ? `Chat: ${lastUserMessage.text.substring(0, 50)}...` : 'New Chat',
        description: `Conversation with ${messages.filter(msg => msg.isUser).length} user messages`,
        date: new Date().toISOString(),
        messageCount: messages.length,
        lastMessage: lastAIMessage ? lastAIMessage.text.substring(0, 100) + '...' : 'No messages',
        messages: [...messages]
      };
      
      setChatHistory(prev => [chatToSave, ...prev]);
    }
    
    // Generate new chat ID
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    
    // Reset messages to initial state
    setMessages([
      {
        id: '1',
        text: 'Hey Sodadasiswaroop! How can I assist you?',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
    
    // Clear all message actions
    setMessageActions({});
    
    // Clear current message input
    setMessage('');
    
    // Stop any ongoing speech synthesis
    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  // Function to navigate to a specific message and highlight it
  const navigateToMessage = (messageId: string) => {
    setCurrentView('chat');
    
    // Scroll to the message and highlight it
    setTimeout(() => {
      const messageElement = document.getElementById(`message-${messageId}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        messageElement.classList.add('bg-yellow-100', 'border-2', 'border-yellow-400');
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          messageElement.classList.remove('bg-yellow-100', 'border-2', 'border-yellow-400');
        }, 3000);
      }
    }, 100);
  };

  // Function to load a chat from history
  const loadChatFromHistory = (chatId: string) => {
    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if (!chatToLoad) return;
    
    // Load the chat messages
    setMessages(chatToLoad.messages);
    setCurrentChatId(chatToLoad.id);
    
    // Reset message actions for the loaded chat
    const newMessageActions: {[key: string]: {
      liked: boolean;
      disliked: boolean;
      starred: boolean;
      bookmarked: boolean;
    }} = {};
    
    chatToLoad.messages.forEach(message => {
      newMessageActions[message.id] = {
        liked: false,
        disliked: false,
        starred: false,
        bookmarked: false
      };
    });
    
    setMessageActions(newMessageActions);
    
    // Switch to chat view
    setCurrentView('chat');
    
    // Stop any ongoing speech synthesis
    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  // Workspace management functions
  const handleCreateWorkspace = (workspaceData: Omit<typeof workspaces[0], 'id' | 'createdDate' | 'chatCount' | 'lastActivity'>) => {
    const newWorkspace = {
      ...workspaceData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
      chatCount: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    };
    setWorkspaces(prev => [newWorkspace, ...prev]);
  };

  const handleSelectWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    setCurrentView('chat');
    // You could filter chats by workspace here
  };

  const handleEditWorkspace = (workspaceId: string, updates: Partial<typeof workspaces[0]>) => {
    setWorkspaces(prev => prev.map(workspace => 
      workspace.id === workspaceId 
        ? { ...workspace, ...updates, lastActivity: new Date().toISOString().split('T')[0] }
        : workspace
    ));
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(workspace => workspace.id !== workspaceId));
    if (currentWorkspaceId === workspaceId) {
      setCurrentWorkspaceId(workspaces.length > 1 ? workspaces[0].id : null);
    }
  };

  // Bookmarked messages state
  const [bookmarkedMessages, setBookmarkedMessages] = useState<Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: string;
    category: 'Reports' | 'Documentation' | 'Process' | 'Templates' | 'Conversation';
  }>>([
    {
      id: '1',
      title: 'Monthly Sales Report - Q4 2024',
      description: 'Comprehensive analysis of Q4 sales performance with visualizations',
      date: '2024-01-15',
      type: 'Conversation',
      category: 'Reports'
    },
    {
      id: '2',
      title: 'Team Collaboration Best Practices',
      description: 'Guidelines and tips for effective team collaboration using AIVA',
      date: '2024-01-12',
      type: 'Resource',
      category: 'Documentation'
    },
    {
      id: '3',
      title: 'Client Onboarding Process',
      description: 'Step-by-step guide for onboarding new clients',
      date: '2024-01-10',
      type: 'Guide',
      category: 'Process'
    },
    {
      id: '4',
      title: 'Data Visualization Templates',
      description: 'Collection of chart templates for different data types',
      date: '2024-01-08',
      type: 'Template',
      category: 'Templates'
    }
  ]);

  // Liked messages state
  const [likedMessages, setLikedMessages] = useState<Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: string;
    category: 'Reports' | 'Documentation' | 'Process' | 'Templates' | 'Conversation';
  }>>([]);

  // Disliked messages state
  const [dislikedMessages, setDislikedMessages] = useState<Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: string;
    category: 'Reports' | 'Documentation' | 'Process' | 'Templates' | 'Conversation';
  }>>([]);

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    createdDate: string;
    chatCount: number;
    lastActivity: string;
    isShared: boolean;
  }>>([
    {
      id: '1',
      name: 'Personal Projects',
      description: 'My personal development and learning projects',
      color: '#3B82F6',
      createdDate: '2024-01-01',
      chatCount: 5,
      lastActivity: '2024-01-15',
      isShared: false
    },
    {
      id: '2',
      name: 'Work Tasks',
      description: 'Professional work and client projects',
      color: '#10B981',
      createdDate: '2024-01-05',
      chatCount: 12,
      lastActivity: '2024-01-14',
      isShared: true
    },
    {
      id: '3',
      name: 'Research & Learning',
      description: 'Educational content and research topics',
      color: '#F59E0B',
      createdDate: '2024-01-10',
      chatCount: 8,
      lastActivity: '2024-01-13',
      isShared: false
    }
  ]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>('1');

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  React.useEffect(() => {
    // Initialize with a new chat ID when component mounts
    if (!currentChatId) {
      setCurrentChatId(Date.now().toString());
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        
        // Auto-send the voice message
        setTimeout(() => {
          if (transcript.trim()) {
            sendMessage(transcript.trim());
            setMessage(''); // Clear the input after sending
          }
        }, 500); // Small delay to show the transcribed text briefly
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const handleDownloadMessage = (messageId: string, messageText: string) => {
    setDownloadingMessage({ id: messageId, text: messageText });
    setDownloadModalOpen(true);
  };

  const handleDownloadFormat = (format: 'pdf' | 'word') => {
    if (!downloadingMessage) return;
    
    const { text: messageText } = downloadingMessage;
    const timestamp = new Date().toLocaleString();
    const filename = `AIVA_Message_${Date.now()}`;
    
    setDownloadModalOpen(false);
    setDownloadingMessage(null);
    
    if (format === 'pdf') {
      // Create proper PDF using jsPDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('AIVA Message', 20, 30);
      
      // Add timestamp
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Downloaded on: ${timestamp}`, 20, 45);
      
      // Add separator line
      doc.line(20, 55, 190, 55);
      
      // Add message content
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      
      // Split text into lines that fit the page width
      const splitText = doc.splitTextToSize(messageText, 170);
      doc.text(splitText, 20, 70);
      
      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated by AIVA Chat System', 20, pageHeight - 20);
      
      // Save the PDF
      doc.save(`${filename}.pdf`);
    } else {
      // Create proper DOCX using docx library
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "AIVA Message",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Downloaded on: ${timestamp}`,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Message Content:",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: messageText,
                  size: 22,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Generated by AIVA Chat System",
                  italics: true,
                  size: 18,
                }),
              ],
            }),
          ],
        }],
      });
      
      // Generate and save the DOCX file
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${filename}.docx`);
      });
    }
  };

  const handleShareMessage = (messageId: string, messageText: string) => {
    setSharingMessage({ id: messageId, text: messageText });
    setShareModalOpen(true);
  };

  const handleShareViaTeams = () => {
    if (!sharingMessage) return;
    
    const { text: messageText } = sharingMessage;
    const timestamp = new Date().toLocaleString();
    
    // Create Teams sharing URL with pre-filled message
    const teamsMessage = `AIVA Chat Response (${timestamp}):\n\n${messageText}\n\n---\nShared from AIVA Chat System`;
    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=&topicName=AIVA%20Chat%20Response&message=${encodeURIComponent(teamsMessage)}`;
    
    // Open Teams in new window
    window.open(teamsUrl, '_blank', 'width=800,height=600');
    
    setShareModalOpen(false);
    setSharingMessage(null);
  };

  const handleShareViaOutlook = () => {
    if (!sharingMessage) return;
    
    const { text: messageText } = sharingMessage;
    const timestamp = new Date().toLocaleString();
    
    // Create Outlook email with pre-filled content
    const subject = `AIVA Chat Response - ${timestamp}`;
    const body = `Hi,\n\nI wanted to share this response from AIVA:\n\n---\n\n${messageText}\n\n---\n\nGenerated on: ${timestamp}\nShared from AIVA Chat System\n\nBest regards`;
    
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Outlook in new window
    window.open(outlookUrl, '_blank', 'width=800,height=600');
    
    setShareModalOpen(false);
    setSharingMessage(null);
  };

  const handleCopyForSharing = async () => {
    if (!sharingMessage) return;
    
    const { text: messageText } = sharingMessage;
    const timestamp = new Date().toLocaleString();
    const shareText = `AIVA Chat Response (${timestamp}):\n\n${messageText}\n\n---\nShared from AIVA Chat System`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Response copied to clipboard! You can now paste it anywhere.');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Response copied to clipboard! You can now paste it anywhere.');
    }
    
    setShareModalOpen(false);
    setSharingMessage(null);
  };

  const handleFileAttachment = (type: 'image' | 'file' | 'document') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    switch (type) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'file':
        input.accept = '*/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt,.rtf';
        break;
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log(`Selected ${type}:`, file.name);
        // Handle file upload logic here
      }
    };
    
    input.click();
    setAttachmentModalOpen(false);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const sendMessage = (messageText: string) => {
    if (!messageText.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: timestamp
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Scroll to bottom immediately after user message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // Initialize actions for the new message
    setMessageActions(prev => ({
      ...prev,
      [userMessage.id]: {
        liked: false,
        disliked: false,
        starred: false,
        bookmarked: false
      }
    }));
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `I understand you said: "${messageText}". How can I help you with that?`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Initialize actions for AI response
      setMessageActions(prev => ({
        ...prev,
        [aiResponse.id]: {
          liked: false,
          disliked: false,
          starred: false,
          bookmarked: false
        }
      }));
      
      // Scroll to bottom after AI response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  const handleMessageAction = (messageId: string, action: 'liked' | 'disliked' | 'starred' | 'bookmarked') => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.isUser) return;

    // If bookmarking a message, add it to bookmarked messages
    if (action === 'bookmarked' && !messageActions[messageId]?.bookmarked) {
      const newBookmark = {
        id: messageId,
        title: `AI Response - ${message.timestamp}`,
        description: message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text,
        date: new Date().toISOString().split('T')[0],
        type: 'Conversation',
        category: 'Conversation' as const
      };
      setBookmarkedMessages(prev => [newBookmark, ...prev]);
    }
    
    // If unbookmarking, remove from bookmarked messages
    if (action === 'bookmarked' && messageActions[messageId]?.bookmarked) {
      setBookmarkedMessages(prev => prev.filter(bookmark => bookmark.id !== messageId));
    }

    // If liking a message, add it to liked messages
    if (action === 'liked' && !messageActions[messageId]?.liked) {
      const newLikedMessage = {
        id: messageId,
        title: `AI Response - ${message.timestamp}`,
        description: message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text,
        date: new Date().toISOString().split('T')[0],
        type: 'Conversation',
        category: 'Conversation' as const
      };
      setLikedMessages(prev => [newLikedMessage, ...prev]);
    }
    
    // If unliking, remove from liked messages
    if (action === 'liked' && messageActions[messageId]?.liked) {
      setLikedMessages(prev => prev.filter(liked => liked.id !== messageId));
    }

    // If disliking a message, add it to disliked messages
    if (action === 'disliked' && !messageActions[messageId]?.disliked) {
      const newDislikedMessage = {
        id: messageId,
        title: `AI Response - ${message.timestamp}`,
        description: message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text,
        date: new Date().toISOString().split('T')[0],
        type: 'Conversation',
        category: 'Conversation' as const
      };
      setDislikedMessages(prev => [newDislikedMessage, ...prev]);
    }
    
    // If removing dislike, remove from disliked messages
    if (action === 'disliked' && messageActions[messageId]?.disliked) {
      setDislikedMessages(prev => prev.filter(disliked => disliked.id !== messageId));
    }

    setMessageActions(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [action]: !prev[messageId]?.[action],
        // If liking, remove dislike and vice versa
        ...(action === 'liked' && prev[messageId]?.disliked ? { disliked: false } : {}),
        ...(action === 'disliked' && prev[messageId]?.liked ? { liked: false } : {})
      }
    }));
  };

  const handleSpeakMessage = (messageId: string, text: string) => {
    // Stop any currently speaking message
    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Set up event listeners
    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };
    
    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    
    utterance.onerror = () => {
      setSpeakingMessageId(null);
      alert('Speech synthesis failed. Please try again or check if your browser supports text-to-speech.');
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };
  

  const handleCopyMessage = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyingMessageId(messageId);
      // Remove the blink effect after animation completes
      setTimeout(() => {
        setCopyingMessageId(null);
      }, 300);
    } catch (error) {
      console.error('Failed to copy message:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopyingMessageId(messageId);
      setTimeout(() => {
        setCopyingMessageId(null);
      }, 300);
    }
  };

  return (
    <>
      {currentView === 'about' && (
        <AboutAIVA onBack={() => setCurrentView('chat')} />
      )}
      
      {currentView === 'bookmarks' && (
        <BookmarksPage 
          onBack={() => setCurrentView('chat')} 
          bookmarkedMessages={bookmarkedMessages}
          onNavigateToMessage={navigateToMessage}
        />
      )}
      
      {currentView === 'liked' && (
        <LikedMessagesPage 
          onBack={() => setCurrentView('chat')} 
          likedMessages={likedMessages}
          onNavigateToMessage={navigateToMessage}
        />
      )}
      
      {currentView === 'disliked' && (
        <DislikedMessagesPage 
          onBack={() => setCurrentView('chat')} 
          dislikedMessages={dislikedMessages}
          onNavigateToMessage={navigateToMessage}
        />
      )}
      
      {currentView === 'history' && (
        <HistoryPage 
          onBack={() => setCurrentView('chat')} 
          chatHistory={chatHistory}
          onLoadChat={loadChatFromHistory}
          onNavigateToMessage={navigateToMessage}
        />
      )}
      
      {currentView === 'workspaces' && (
        <WorkspacesPage 
          onBack={() => setCurrentView('chat')} 
          workspaces={workspaces}
          onCreateWorkspace={handleCreateWorkspace}
          onSelectWorkspace={handleSelectWorkspace}
          onEditWorkspace={handleEditWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
        />
      )}
      
      {currentView === 'chat' && (
      <div className="h-screen bg-slate-100 flex overflow-hidden flex-shrink-0">
      {/* Sidebar */}
      <div className={`bg-slate-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col h-screen fixed left-0 top-0 z-10`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div 
            onClick={() => setCurrentView('about')}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <Building2 className="w-5 h-5" />
            {sidebarOpen && <span>About AIVA</span>}
          </div>
          
          <div 
            onClick={() => setCurrentView('bookmarks')}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            {sidebarOpen && <span>Bookmarks</span>}
          </div>
          
          <div 
            onClick={() => setCurrentView('workspaces')}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Workspaces</span>}
          </div>
          
          <div 
            onClick={() => setCurrentView('liked')}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <Heart className="w-5 h-5" />
            {sidebarOpen && <span>Liked messages</span>}
          </div>
          
          <div 
            onClick={() => setCurrentView('disliked')}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <HeartOff className="w-5 h-5" />
            {sidebarOpen && <span>Disliked messages</span>}
          </div>
          
          <div 
            onClick={() => setCurrentView('history')}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <History className="w-5 h-5" />
            {sidebarOpen && <span>History</span>}
          </div>
          
          <div 
            onClick={() => setShowDataPanel(!showDataPanel)}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <Database className="w-5 h-5" />
            {sidebarOpen && <span>Data Insights</span>}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?generateAvatar(user.name):'U'}
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-medium">{user?.name || 'Guest User'}</div>
                <div className="text-sm text-slate-400">{user?.email || 'No email'}</div>


              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
<div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-16'} h-screen transition-all duration-300`}>
        {/* Header */}
        <header className="bg-slate-800 text-white p-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center space-x-3" onClick={onNavigateToHome}>
            <img src="/alyasra-logo.png" alt="Alyasra Logo" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">AIVA</h1>
              {currentWorkspaceId && (
                <p className="text-sm text-slate-300">
                  {workspaces.find(w => w.id === currentWorkspaceId)?.name || 'Workspace'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
            
            <button
              onClick={() => setUseDataAgent(!useDataAgent)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                useDataAgent ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{useDataAgent ? 'Data Mode ON' : 'Data Mode OFF'}</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              
              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout(); // ← Change this line
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-3 text-gray-700"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Account</span>
                </button>

                  
                 <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout(); // ← Change this line
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-3 text-gray-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Switch Account</span>
                  </button>

                  
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-3 text-gray-700"
                  >
                    <Users className="w-4 h-4" />
                    <span>Collaboration</span>
                  </button>
                  
                  <hr className="my-2 border-gray-200" />
                  
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-3 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Overlay to close dropdown when clicking outside */}
        {profileMenuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setProfileMenuOpen(false)}
          />
        )}

        {/* Data Query Panel */}
        {showDataPanel && (
          <DataQueryPanel 
            onClose={() => setShowDataPanel(false)}
          />
        )}

      {/* Share Message Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Share Response</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Choose how you want to share this response:</p>
            
            <div className="space-y-3">
              <button
                onClick={handleShareViaTeams}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Share via Microsoft Teams</div>
                  <div className="text-sm text-gray-500">Open Teams with pre-filled message</div>
                </div>
              </button>
              
              <button
                onClick={handleShareViaOutlook}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Share via Outlook Email</div>
                  <div className="text-sm text-gray-500">Open Outlook with pre-filled email</div>
                </div>
              </button>
              
              <button
                onClick={handleCopyForSharing}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <Copy className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Copy to Clipboard</div>
                  <div className="text-sm text-gray-500">Copy formatted text for sharing anywhere</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto scroll-smooth">
            <div className="max-w-4xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} id={`message-${msg.id}`} className="mb-6 transition-all duration-300 rounded-lg p-2">
                  <div className={`flex items-start space-x-3 ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.isUser ? 'bg-blue-600' : 'bg-slate-600'
                    }`}>
                      {msg.isUser ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-lg p-4 mb-2 ${
                        msg.isUser 
                          ? 'bg-blue-600 text-white ml-12' 
                          : 'bg-slate-200 text-slate-800 mr-12'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                      
                      {/* Message Actions - only for AI messages */}
                      {!msg.isUser && (
                        <div className={`flex items-center space-x-2 ${msg.isUser ? 'justify-end' : ''}`}>
                          <button 
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className={`p-2 rounded transition-all duration-300 ${
                              copyingMessageId === msg.id
                                ? 'bg-green-500 text-white animate-pulse' 
                                : 'text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadMessage(msg.id, msg.text)}
                            className="p-2 text-slate-500 hover:bg-slate-200 rounded transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            className={`p-2 rounded transition-colors ${
                              speakingMessageId === msg.id
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleMessageAction(msg.id, 'liked')}
                            className={`p-2 rounded transition-colors ${
                              messageActions[msg.id]?.liked 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleMessageAction(msg.id, 'disliked')}
                            className={`p-2 rounded transition-colors ${
                              messageActions[msg.id]?.disliked 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleMessageAction(msg.id, 'starred')}
                            className={`p-2 rounded transition-colors ${
                              messageActions[msg.id]?.starred 
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                : 'text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleMessageAction(msg.id, 'bookmarked')}
                            className={`p-2 rounded transition-colors ${
                              messageActions[msg.id]?.bookmarked 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleShareMessage(msg.id, msg.text)}
                            className="p-2 text-slate-500 hover:bg-slate-200 rounded transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-slate-400 ml-2">{msg.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Scroll anchor for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 flex-shrink-0 sticky bottom-0 bg-white z-20">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type something..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors ${
                      isListening ? 'bg-red-100 text-red-600' : 'text-slate-500'
                    }`}
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachmentModalOpen(true)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Plus className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* File Attachment Modal */}
      {attachmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Attach Files</h3>
              <button
                onClick={() => setAttachmentModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleFileAttachment('image')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Image className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Attach Image</span>
              </button>
              
              <button
                onClick={() => handleFileAttachment('file')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <File className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Attach File</span>
              </button>
              
              <button
                onClick={() => handleFileAttachment('document')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Attach Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Format Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Download Message</h3>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Choose the format you want to download this message in:</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDownloadFormat('pdf')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <File className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-800">PDF Document</div>
                  <div className="text-sm text-gray-500">Download as PDF file</div>
                </div>
              </button>
              
              <button
                onClick={() => handleDownloadFormat('word')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <File className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-800">Word Document</div>
                  <div className="text-sm text-gray-500">Download as DOCX file</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      )}
    </>
  );
};

export default Dashboard;