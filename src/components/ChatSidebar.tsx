import React, { useState } from "react";
import { Search, MessageSquare, Bookmark, User, Clock, Heart, HeartCrack, Building2, ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useUser } from "@/contexts/UserContext";

const menuItems = [
  { title: "About company", icon: Building2, href: "/about" },
  { title: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { title: "Personal Projects", icon: User, href: "/projects" },
  { title: "Liked messages", icon: Heart, href: "/liked" },
  { title: "Disliked messages", icon: HeartCrack, href: "/disliked" },
  { title: "History", icon: Clock, href: "/history" },
];

interface ChatSidebarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export function ChatSidebar({ collapsed, onToggleSidebar }: ChatSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { user } = useUser();

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} bg-sidebar border-sidebar-border transition-all duration-500 ease-in-out`}>
      <SidebarContent className="p-4">
        {!collapsed && (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
        
        <Collapsible open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent mb-2"
            >
              {!collapsed && <span className="text-sm font-medium">Menu</span>}
              {collapsed ? (
                <MessageSquare className="h-5 w-5" />
              ) : (
                isMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="animate-fade-in">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <SidebarMenuButton asChild className="text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300 hover-scale">
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 transition-transform duration-200" />
                          {!collapsed && <span className="transition-opacity duration-300">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </CollapsibleContent>
        </Collapsible>

        {!collapsed && (
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sidebar-foreground text-sm font-medium">
                {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
              </span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}