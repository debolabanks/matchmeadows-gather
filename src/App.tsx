
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Index from "@/pages/Index";
import About from "@/pages/About";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Matches from "@/pages/Matches";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Verification from "@/pages/Verification";
import Subscription from "@/pages/Subscription";
import Games from "@/pages/Games";
import Creators from "@/pages/Creators";
import CreatorChannel from "@/pages/CreatorChannel";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { AuthProvider } from "@/contexts/AuthContext";
import LiveStreamPage from "@/pages/LiveStreamPage";
import BroadcastPage from "@/pages/BroadcastPage";
import { CallProvider } from "@/contexts/CallContext";
import TermsOfUse from "@/pages/TermsOfUse";
import { preloadSounds } from "@/services/soundService";
import SplashScreen from "@/components/SplashScreen";

import Discover from "@/pages/discover";
import StreamsDiscovery from "@/pages/discover/streams";

import TicTacToe from "@/games/TicTacToe";
import RockPaperScissors from "@/games/RockPaperScissors";
import WordGuess from "@/games/WordGuess";

const queryClient = new QueryClient();

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    preloadSounds();
    
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);
    
    const statusBarMeta = document.createElement('meta');
    statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusBarMeta.content = 'black-translucent';
    document.head.appendChild(statusBarMeta);
    
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(statusBarMeta);
      clearTimeout(timer);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CallProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <div className="pt-16 md:ml-16">
                  <Header />
                  <div className="flex h-full flex-1">
                    <div className="flex-1 pb-16">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/matches" element={<ProtectedRoute>{<Matches />}</ProtectedRoute>} />
                        <Route path="/messages" element={<ProtectedRoute>{<Messages />}</ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute>{<Profile />}</ProtectedRoute>} />
                        <Route path="/verification" element={<ProtectedRoute>{<Verification />}</ProtectedRoute>} />
                        <Route path="/subscription" element={<Subscription />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/terms" element={<TermsOfUse />} />
                        
                        <Route path="/games/tic-tac-toe" element={<ProtectedRoute>{<TicTacToe />}</ProtectedRoute>} />
                        <Route path="/games/rock-paper-scissors" element={<ProtectedRoute>{<RockPaperScissors />}</ProtectedRoute>} />
                        <Route path="/games/word-guess" element={<ProtectedRoute>{<WordGuess />}</ProtectedRoute>} />
                        
                        <Route path="/creators" element={<Creators />} />
                        <Route path="/creators/:creatorId" element={<CreatorChannel />} />
                        <Route path="/stream/:streamId" element={<LiveStreamPage />} />
                        <Route path="/broadcast" element={<ProtectedRoute>{<BroadcastPage />}</ProtectedRoute>} />
                        <Route path="/broadcast/:creatorId" element={<ProtectedRoute>{<BroadcastPage />}</ProtectedRoute>} />
                        <Route path="/discover/streams" element={<StreamsDiscovery />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </div>
                  <MobileNav />
                  <Footer />
                </div>
                <Toaster />
              </div>
            </BrowserRouter>
          </QueryClientProvider>
        </CallProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
