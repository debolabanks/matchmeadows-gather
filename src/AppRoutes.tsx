
import React from 'react';
import { Routes, Route } from "react-router-dom";

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
import LiveStreamPage from "@/pages/LiveStreamPage";
import BroadcastPage from "@/pages/BroadcastPage";
import TermsOfUse from "@/pages/TermsOfUse";

import Discover from "@/pages/discover";
import StreamsDiscovery from "@/pages/discover/streams";

import TicTacToe from "@/games/TicTacToe";
import RockPaperScissors from "@/games/RockPaperScissors";
import WordGuess from "@/games/WordGuess";

const AppRoutes = () => {
  return (
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
        <Footer />
      </div>
    </div>
  );
};

export default AppRoutes;
