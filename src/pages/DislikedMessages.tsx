import React, { useState } from "react";
import { useDislikedMessages } from "@/contexts/DislikedMessagesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HeartCrack, Search, Calendar, MessageSquare, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const DislikedMessages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { dislikedMessages } = useDislikedMessages();

  const filteredMessages = dislikedMessages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAuthorInitials = (author: string) => {
    return author.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
  };

  const getReasonColor = (reason: string) => {
    const colors: { [key: string]: string } = {
      "Inaccurate Information": "bg-red-100 text-red-800",
      "Unhelpful Suggestion": "bg-orange-100 text-orange-800",
      "Poor Quality": "bg-yellow-100 text-yellow-800",
      "Negative Attitude": "bg-purple-100 text-purple-800"
    };
    return colors[reason] || "bg-gray-100 text-gray-800";
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
          <h1 className="text-4xl font-bold text-white">Disliked Messages</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <HeartCrack className="h-6 w-6 text-destructive" />
              <div>
                <h2 className="text-xl font-semibold">Messages You've Flagged</h2>
                <p className="text-muted-foreground">Track problematic or unhelpful messages for improvement</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search disliked messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 border-l-4 border-l-destructive hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-destructive text-destructive-foreground text-sm">
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
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <p className="text-foreground mb-3 leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {message.context}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getReasonColor(message.reason)}>
                          {message.reason}
                        </Badge>
                        <HeartCrack className="h-4 w-4 text-destructive fill-current" />
                        <Button variant="ghost" size="sm" className="text-xs">
                          Report Issue
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
                <HeartCrack className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No disliked messages found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "Messages you dislike will appear here to help improve the system"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-yellow-50 border-yellow-200 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Help Us Improve</h3>
                <p className="text-sm text-yellow-700">
                  Your feedback on disliked messages helps us understand issues and improve AIVA's performance. 
                  Consider providing specific feedback when you mark messages as unhelpful.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DislikedMessages;