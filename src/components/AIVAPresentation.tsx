import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  MessageSquare, 
  Heart, 
  HeartOff, 
  Bookmark, 
  History, 
  Users, 
  Database,
  Info,
  Play,
  Pause
} from 'lucide-react';

interface AIVAPresentationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  screenshot?: string;
  color: string;
}

const AIVAPresentation: React.FC<AIVAPresentationProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const slides: Slide[] = [
    {
      id: 'intro',
      title: 'Welcome to AIVA',
      description: 'Your AI-powered Virtual Assistant for Business Intelligence',
      icon: <MessageSquare className="w-16 h-16" />,
      features: [
        'Natural Language Processing',
        'Real-time Data Analysis',
        'Intelligent Insights',
        'Secure Enterprise Platform'
      ],
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'chat',
      title: 'Smart Chat Interface',
      description: 'Ask questions in plain English and get instant AI-powered answers',
      icon: <MessageSquare className="w-16 h-16" />,
      features: [
        'Natural language queries',
        'Real-time responses',
        'Data visualization',
        'Export capabilities',
        'Voice commands',
        'File attachments'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'bookmarks',
      title: 'Bookmarks System',
      description: 'Save and organize important conversations and insights',
      icon: <Bookmark className="w-16 h-16" />,
      features: [
        'Save important messages',
        'Organize by categories',
        'Quick access to insights',
        'Search bookmarked content',
        'Share with team members'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'liked',
      title: 'Liked Messages',
      description: 'Keep track of valuable responses and recommendations',
      icon: <Heart className="w-16 h-16" />,
      features: [
        'Mark helpful responses',
        'Build knowledge base',
        'Quick reference system',
        'Quality feedback mechanism'
      ],
      color: 'from-pink-500 to-red-500'
    },
    {
      id: 'disliked',
      title: 'Feedback System',
      description: 'Help improve AIVA by marking unhelpful responses',
      icon: <HeartOff className="w-16 h-16" />,
      features: [
        'Quality improvement',
        'Learning feedback',
        'Response optimization',
        'Continuous enhancement'
      ],
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'history',
      title: 'Conversation History',
      description: 'Access and review all your past conversations',
      icon: <History className="w-16 h-16" />,
      features: [
        'Complete chat history',
        'Search past conversations',
        'Export conversations',
        'Context preservation',
        'Timeline view'
      ],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'workspaces',
      title: 'Team Workspaces',
      description: 'Collaborate with your team on data analysis projects',
      icon: <Users className="w-16 h-16" />,
      features: [
        'Team collaboration',
        'Shared insights',
        'Project organization',
        'Role-based access',
        'Group discussions'
      ],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'about',
      title: 'About AIVA',
      description: 'Learn more about features, capabilities, and best practices',
      icon: <Info className="w-16 h-16" />,
      features: [
        'Feature documentation',
        'Usage guidelines',
        'Best practices',
        'Tips and tricks',
        'Support resources'
      ],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isOpen) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">AIVA Platform Overview</h2>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-full transition-colors ${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Slide Content */}
          <div className="flex-1 p-8">
            <div className={`bg-gradient-to-br ${currentSlideData.color} p-8 rounded-2xl text-white mb-8 shadow-xl`}>
              <div className="flex items-center space-x-6 mb-6">
                <div className="text-white/90">
                  {currentSlideData.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">{currentSlideData.title}</h3>
                  <p className="text-xl text-white/90">{currentSlideData.description}</p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {currentSlideData.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-700/50 backdrop-blur-sm p-4 rounded-xl border border-slate-600/50 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white font-medium">{feature}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Screenshot Placeholder */}
            <div className="mt-8 bg-slate-700/30 rounded-xl p-8 border-2 border-dashed border-slate-600">
              <div className="text-center">
                <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Interactive Demo Preview</p>
                <p className="text-slate-500 text-sm mt-2">Experience {currentSlideData.title} in action</p>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm p-6 border-l border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-6">Navigation</h4>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      {React.cloneElement(slide.icon as React.ReactElement, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{slide.title}</div>
                      <div className="text-xs opacity-75 truncate">{slide.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Progress</span>
                <span className="text-sm text-slate-400">{currentSlide + 1} / {slides.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700">
          <button
            onClick={prevSlide}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIVAPresentation;