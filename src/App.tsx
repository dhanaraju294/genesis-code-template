import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Bookmarks from "./pages/Bookmarks";
import Projects from "./pages/Projects";
import LikedMessages from "./pages/LikedMessages";
import DislikedMessages from "./pages/DislikedMessages";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import { UserProvider } from "./contexts/UserContext";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { LikedMessagesProvider } from "./contexts/LikedMessagesContext";
import { DislikedMessagesProvider } from "./contexts/DislikedMessagesContext";
import { HistoryProvider } from "./contexts/HistoryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BookmarksProvider>
        <LikedMessagesProvider>
          <DislikedMessagesProvider>
            <HistoryProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/chat" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/liked" element={<LikedMessages />} />
                  <Route path="/disliked" element={<DislikedMessages />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
            </HistoryProvider>
          </DislikedMessagesProvider>
        </LikedMessagesProvider>
      </BookmarksProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
