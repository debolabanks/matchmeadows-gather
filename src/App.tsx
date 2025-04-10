
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
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

// Import discover pages correctly
import Discover from "@/pages/discover";
import StreamsDiscovery from "@/pages/discover/streams";

const queryClient = new QueryClient()

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <div className="pt-16 md:ml-16">
                <Header />
                <div className="flex h-full flex-1">
                  <MobileNav />
                  <div className="flex-1">
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
                      <Route path="/creators" element={<Creators />} />
                      <Route path="/creators/:creatorId" element={<CreatorChannel />} />
                      <Route path="/stream/:streamId" element={<LiveStreamPage />} />
                      <Route path="/broadcast" element={<ProtectedRoute>{<BroadcastPage />}</ProtectedRoute>} />
                      <Route path="/broadcast/:creatorId" element={<ProtectedRoute>{<BroadcastPage />}</ProtectedRoute>} />
                      <Route path="/discover/streams" element={<StreamsDiscovery />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                  </div>
                </div>
              </div>
              <Toaster />
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
