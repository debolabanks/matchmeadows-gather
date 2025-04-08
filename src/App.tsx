
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthProvider";
import { CallProvider } from "./contexts/CallContext";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { preloadSounds } from "./services/soundService";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Messages from "./pages/Messages";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Discover from "./pages/discover";
import StreamsDiscovery from "./pages/discover/streams";
import Matches from "./pages/Matches";
import About from "./pages/About";
import TermsOfUse from "./pages/TermsOfUse";
import Verification from "./pages/Verification";
import Games from "./pages/Games";
import Subscription from "./pages/Subscription";
import Creators from "./pages/Creators";
import CreatorChannel from "./pages/CreatorChannel";
import StreamPage from "./pages/StreamPage";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";
import TicTacToe from "./games/TicTacToe";
import WordGuess from "./games/WordGuess";
import RockPaperScissors from "./games/RockPaperScissors";

function App() {
  // Preload sounds when the app first loads
  useEffect(() => {
    preloadSounds();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CallProvider>
            <Header />
            <div className="pt-16 pb-20 md:pb-0 min-h-screen">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<TermsOfUse />} />
                
                {/* Former protected routes - now accessible to all */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/discover/streams" element={<StreamsDiscovery />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
                <Route path="/games/word-guess" element={<WordGuess />} />
                <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/creators/:creatorId" element={<CreatorChannel />} />
                <Route path="/streams/:streamId" element={<StreamPage />} />
                
                {/* Catch-all/404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <MobileNav />
            <Footer />
            <Toaster />
          </CallProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
