import React, { useState } from "react";
import { useHistory } from "@/contexts/HistoryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Search, Calendar, MessageSquare, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const History = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const { chatSessions } = useHistory();

  const filteredHistory = chatSessions.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || filterType === "chat";
    
    const today = new Date();
    const itemDate = new Date(item.timestamp);
    let matchesDate = true;
    
    if (filterDate === "today") {
      matchesDate = itemDate.toDateString() === today.toDateString();
    } else if (filterDate === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = itemDate >= weekAgo;
    } else if (filterDate === "month") {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = itemDate >= monthAgo;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Report": "bg-blue-100 text-blue-800",
      "Chat": "bg-green-100 text-green-800",
      "Analysis": "bg-purple-100 text-purple-800",
      "Process": "bg-orange-100 text-orange-800",
      "Planning": "bg-red-100 text-red-800",
      "Documentation": "bg-yellow-100 text-yellow-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-blue p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            size="icon"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-white">History</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Conversation History</h2>
                <p className="text-muted-foreground">Browse your past conversations and activities</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                    <SelectItem value="chat">Chats</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="w-40">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="bg-white/95 backdrop-blur-sm shadow-elegant border-0 hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                       <Badge className={getTypeColor("Chat")}>
                        Chat
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {item.messages.length > 1 ? `${item.messages.length} messages` : "Welcome conversation"}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {item.timestamp}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {item.messages.length} messages
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredHistory.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No history found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== "all" || filterDate !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Your conversation history will appear here as you use AIVA"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-blue-50 border-blue-200 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Privacy Notice</h3>
                <p className="text-sm text-blue-700">
                  Your conversation history is stored securely and used only to improve your experience. 
                  You can delete individual conversations or clear your entire history at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;