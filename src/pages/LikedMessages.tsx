import React, { useState } from "react";
import { useLikedMessages } from "@/contexts/LikedMessagesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search, Calendar, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LikedMessages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { likedMessages } = useLikedMessages();

  const filteredMessages = likedMessages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.context.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAuthorInitials = (author: string) => {
    return author.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-blue p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            size="icon"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-white">Liked Messages</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Your Favorite Messages</h2>
                <p className="text-muted-foreground">Messages you've marked as important or helpful</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search liked messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 hover:shadow-lg transition-all duration-300 hover-scale">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getAuthorInitials(message.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{message.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {message.timestamp}
                      </div>
                    </div>
                    <p className="text-foreground mb-3 leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {message.context}
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <Button variant="ghost" size="sm" className="text-xs">
                          View Thread
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredMessages.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No liked messages found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "Start liking messages to save them here for quick access"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedMessages;