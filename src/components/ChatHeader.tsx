import React, { useState } from "react";
import { User, Plus, RotateCcw, Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CollaborationDialog } from "./CollaborationDialog";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  onShowCollaboration: () => void;
}

export function ChatHeader({ onShowCollaboration }: ChatHeaderProps) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddAccount = () => {
    // Simulate add account functionality
    alert("Add Account feature - Coming soon!");
  };

  const handleSwitchAccount = () => {
    navigate("/login");
  };

  return (
    <header className="text-white px-8 py-6 flex items-center justify-center relative border-b border-white/10 animate-fade-in" style={{backgroundColor: '#1e293b'}}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      {/* Logo and title - centered */}
      <div className="flex items-center gap-4 z-10 cursor-pointer" onClick={() => navigate("/")}>
        <div className="relative">
          <img 
            src="/lovable-uploads/1000088648-removebg-preview.png" 
            alt="AIVA Logo" 
            className="w-10 h-10 object-contain transition-transform duration-300 hover:scale-110"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">AIVA</h1>
      </div>

      {/* Profile menu - absolute positioned */}
      <div className="absolute top-6 right-8 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 rounded-full backdrop-blur-sm border border-white/20">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 backdrop-blur-sm bg-white/95 border-white/20">
            <DropdownMenuItem onClick={() => navigate("/login")} className="hover:bg-primary/10">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSwitchAccount} className="hover:bg-primary/10">
              <RotateCcw className="mr-2 h-4 w-4" />
              Switch Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShowCollaboration} className="hover:bg-primary/10">
              <Link2 className="mr-2 h-4 w-4" />
              Collaboration
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}