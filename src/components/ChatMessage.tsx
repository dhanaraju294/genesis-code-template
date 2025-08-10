import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Copy, Download, Volume2, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, Star } from "lucide-react";
import { ShareDialog } from "./ShareDialog";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { useLikedMessages } from "@/contexts/LikedMessagesContext";
import { useDislikedMessages } from "@/contexts/DislikedMessagesContext";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  hasChart?: boolean;
}

export function ChatMessage({ role, content, timestamp, hasChart }: ChatMessageProps) {
  const isUser = role === "user";
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [likedState, setLikedState] = useState(false);
  const [dislikedState, setDislikedState] = useState(false);
  const [starredState, setStarredState] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked, getBookmarkByContent } = useBookmarks();
  const { addLikedMessage, removeLikedMessage, isLiked, getLikedMessageByContent } = useLikedMessages();
  const { addDislikedMessage, removeDislikedMessage, isDisliked, getDislikedMessageByContent } = useDislikedMessages();
  const { toast } = useToast();
  const bookmarked = isBookmarked(content);

  const handleBookmark = () => {
    if (bookmarked) {
      const bookmarkToRemove = getBookmarkByContent(content);
      if (bookmarkToRemove) {
        removeBookmark(bookmarkToRemove.id);
        toast({
          title: "Bookmark removed",
          description: "Message removed from bookmarks",
        });
      }
    } else {
      addBookmark(content);
      toast({
        title: "Bookmark added",
        description: "Message saved to bookmarks",
      });
    }
  };

  const handleLike = () => {
    if (likedState) {
      const likedToRemove = getLikedMessageByContent(content);
      if (likedToRemove) {
        removeLikedMessage(likedToRemove.id);
      }
      setLikedState(false);
      if (dislikedState) setDislikedState(false);
    } else {
      addLikedMessage(content);
      setLikedState(true);
      if (dislikedState) {
        const dislikedToRemove = getDislikedMessageByContent(content);
        if (dislikedToRemove) {
          removeDislikedMessage(dislikedToRemove.id);
        }
        setDislikedState(false);
      }
    }
  };

  const handleDislike = () => {
    if (dislikedState) {
      const dislikedToRemove = getDislikedMessageByContent(content);
      if (dislikedToRemove) {
        removeDislikedMessage(dislikedToRemove.id);
      }
      setDislikedState(false);
      if (likedState) setLikedState(false);
    } else {
      addDislikedMessage(content);
      setDislikedState(true);
      if (likedState) {
        const likedToRemove = getLikedMessageByContent(content);
        if (likedToRemove) {
          removeLikedMessage(likedToRemove.id);
        }
        setLikedState(false);
      }
    }
  };

  const handleStar = () => {
    setStarredState(!starredState);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"} mb-6`}>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? "JG" : <MessageSquare className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-3xl ${isUser ? "text-right" : "text-left"}`}>
        <Card className={`p-4 ${isUser ? "bg-chat-user text-white ml-auto" : "bg-chat-assistant"} shadow-sm`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          
          {hasChart && !isUser && (
            <div className="mt-4 space-y-4">
              {/* Sales Comparison Chart */}
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium mb-3 text-foreground flex items-center gap-2">
                  📊 Monthly Sales Comparison
                </h4>
                <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-lg flex items-end justify-center gap-8 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary w-16 h-32 rounded-t-lg flex items-end justify-center text-white text-xs pb-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary-glow opacity-80"></div>
                      <span className="relative z-10">Previous</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Last Month</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary-glow w-16 h-36 rounded-t-lg flex items-end justify-center text-white text-xs pb-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-glow to-primary opacity-90"></div>
                      <span className="relative z-10">Current</span>
                    </div>
                    <span className="text-xs text-muted-foreground">This Month</span>
                  </div>
                </div>
              </div>

              {/* Department Breakdown Chart */}
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium mb-3 text-foreground flex items-center gap-2">
                  🏪 Department Performance
                </h4>
                <div className="w-full h-48 bg-gradient-to-r from-orange-400/20 to-blue-500/20 rounded-lg flex items-end justify-center gap-8 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-t from-orange-500 to-orange-400 w-20 h-32 rounded-t-lg flex items-end justify-center text-white text-xs pb-2">
                      Fashion
                    </div>
                    <span className="text-xs text-muted-foreground">60% of sales</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-t from-blue-600 to-blue-500 w-20 h-28 rounded-t-lg flex items-end justify-center text-white text-xs pb-2">
                      Food & Bev
                    </div>
                    <span className="text-xs text-muted-foreground">40% of sales</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-xs text-primary font-medium">Growth Rate</div>
                  <div className="text-lg font-bold text-primary">+12.3%</div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-xs text-green-700 font-medium">Customer Retention</div>
                  <div className="text-lg font-bold text-green-700">87.4%</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {!isUser && (
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
              onClick={handleCopy}
              title="Copy message"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600"
              title="Download message"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600"
              title="Listen to message"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 ${likedState ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'hover:bg-green-50 hover:text-green-600'}`}
              onClick={handleLike}
              title={likedState ? "Remove like" : "Like message"}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 ${dislikedState ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'hover:bg-red-50 hover:text-red-600'}`}
              onClick={handleDislike}
              title={dislikedState ? "Remove dislike" : "Dislike message"}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 ${bookmarked ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}
              onClick={handleBookmark}
              title={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 ${starredState ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'hover:bg-yellow-50 hover:text-yellow-600'}`}
              onClick={handleStar}
              title={starredState ? "Remove star" : "Star message"}
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>
        )}

        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1">
            {timestamp}
          </p>
        )}
      </div>

      <ShareDialog 
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        messageContent={content}
      />
    </div>
  );
}