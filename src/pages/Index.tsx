import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { CollaborationDialog } from "@/components/CollaborationDialog";
import { useUser } from "@/contexts/UserContext";
import { useChat, type Message } from "@/contexts/ChatContext";
import { useHistory } from "@/contexts/HistoryContext";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const { user } = useUser();
  const { messages, setMessages, initializeMessages, clearMessages } = useChat();
  const { addChatSession } = useHistory();

  useEffect(() => {
    initializeMessages(user?.firstName);
  }, [user?.firstName, initializeMessages]);

  const handleSendMessage = (content: string, includeVisualization?: boolean) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let assistantContent = "I'm processing your request...";
      let hasChart = false;

      // Enhanced detection for monthly reports and data queries
      const isMonthlyReport = /\b(month|monthly|report|reports|data|sales|revenue|performance|analytics|statistics|stats|summary|overview)\b/i.test(content);
      const isDataQuery = /\b(show|display|give|get|provide|tell|what|how)\b.*\b(data|information|info|numbers|figures|metrics)\b/i.test(content);
      
      if (isMonthlyReport || isDataQuery || includeVisualization) {
        // Generate random monthly data
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = months[new Date().getMonth()];
        const previousMonth = months[new Date().getMonth() - 1] || "December";
        
        const currentSales = Math.floor(Math.random() * 500000) + 200000;
        const previousSales = Math.floor(Math.random() * 450000) + 180000;
        const growthRateNum = ((currentSales - previousSales) / previousSales) * 100;
        const growthRate = growthRateNum.toFixed(1);
        
        const totalOrders = Math.floor(Math.random() * 2000) + 800;
        const avgOrderValue = Math.floor(currentSales / totalOrders);
        const customerAcquisition = Math.floor(Math.random() * 300) + 150;
        const customerRetention = (Math.random() * 20 + 75).toFixed(1);

        assistantContent = `📊 **${currentMonth} Monthly Report Summary**

**Sales Performance:**
• Total Revenue: $${currentSales.toLocaleString()}
• Previous Month (${previousMonth}): $${previousSales.toLocaleString()}
• Growth Rate: ${growthRateNum > 0 ? '+' : ''}${growthRate}%

**Key Metrics:**
• Total Orders: ${totalOrders.toLocaleString()}
• Average Order Value: $${avgOrderValue}
• New Customers: ${customerAcquisition}
• Customer Retention: ${customerRetention}%

**Department Breakdown:**
• Fashion: $${Math.floor(currentSales * 0.6).toLocaleString()} (60%)
• Food & Beverages: $${Math.floor(currentSales * 0.4).toLocaleString()} (40%)

The visual chart below shows the detailed breakdown by category.`;
        
        hasChart = true;
      } else if (content.toLowerCase().includes("hello") || content.toLowerCase().includes("hi")) {
        assistantContent = "Hello! I'm here to help you with data analysis, monthly reports, visualizations, and any questions you might have. How can I assist you today?";
      } else {
        assistantContent = "I can help you with monthly reports, data analysis, and visualizations. Try asking about 'monthly sales report' or 'show me this month's data' to see detailed analytics with charts!";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString(),
        hasChart,
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleNewChat = () => {
    // Save current chat to history if it has messages beyond the welcome message
    if (messages.length > 1) {
      const firstUserMessage = messages.find(m => m.role === "user");
      const title = firstUserMessage?.content.slice(0, 50) + (firstUserMessage?.content.length > 50 ? "..." : "") || "New Chat";
      
      addChatSession({
        id: Date.now().toString(),
        title,
        timestamp: new Date().toLocaleString(),
        messages: [...messages]
      });
    }
    
    // Clear current chat and reinitialize
    clearMessages();
    setTimeout(() => initializeMessages(user?.firstName), 0);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {!sidebarCollapsed && (
          <ChatSidebar 
            collapsed={sidebarCollapsed} 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNewChat={handleNewChat}
          />
        )}
        
        <div className={`flex flex-col transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'w-full' : 'flex-1'}`}>
          <ChatHeader 
            onShowCollaboration={() => setShowCollaboration(true)}
          />
          
          {sidebarCollapsed && (
            <div className="fixed top-4 left-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(false)}
                className="bg-background border border-border shadow-lg hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  hasChart={message.hasChart}
                />
              ))}
            </div>
          </main>
          
          <ChatInput onSendMessage={handleSendMessage} />
        </div>

        <CollaborationDialog 
          open={showCollaboration}
          onOpenChange={setShowCollaboration}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
