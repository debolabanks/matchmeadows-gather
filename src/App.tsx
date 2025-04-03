
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import Discover from "./pages/discover";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatorChannel from "./pages/CreatorChannel";
import Creators from "./pages/Creators";
import About from "./pages/About";
import Subscription from "./pages/Subscription";
import Games from "./pages/Games";
import TicTacToe from "./games/TicTacToe";
import WordGuess from "./games/WordGuess";
import RockPaperScissors from "./games/RockPaperScissors";
import Verification from "./pages/Verification";
import TermsOfUse from "./pages/TermsOfUse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CallProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Redirect landing page to sign in if not authenticated */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected routes */}
                  <Route path="/subscription" element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } />
                  <Route path="/verification" element={
                    <ProtectedRoute>
                      <Verification />
                    </ProtectedRoute>
                  } />
                  <Route path="/terms-of-use" element={
                    <ProtectedRoute>
                      <TermsOfUse />
                    </ProtectedRoute>
                  } />
                  <Route path="/discover" element={
                    <ProtectedRoute>
                      <Discover />
                    </ProtectedRoute>
                  } />
                  <Route path="/matches" element={
                    <ProtectedRoute>
                      <Matches />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/games" element={
                    <ProtectedRoute>
                      <Games />
                    </ProtectedRoute>
                  } />
                  <Route path="/games/tic-tac-toe" element={
                    <ProtectedRoute>
                      <TicTacToe />
                    </ProtectedRoute>
                  } />
                  <Route path="/games/word-guess" element={
                    <ProtectedRoute>
                      <WordGuess />
                    </ProtectedRoute>
                  } />
                  <Route path="/games/rock-paper-scissors" element={
                    <ProtectedRoute>
                      <RockPaperScissors />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/creators" element={
                    <ProtectedRoute>
                      <Creators />
                    </ProtectedRoute>
                  } />
                  <Route path="/creators/:creatorId" element={
                    <ProtectedRoute>
                      <CreatorChannel />
                    </ProtectedRoute>
                  } />
                  
                  {/* Not found route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <MobileNav />
            </div>
          </BrowserRouter>
        </CallProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
