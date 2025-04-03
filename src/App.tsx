
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthProvider";
import { CallProvider } from "./contexts/CallContext";
import { Toaster } from "./components/ui/toaster";
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
import { useEffect } from "react";
import { preloadSounds } from "./services/soundService";

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
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} /> {/* Alias for compatibility */}
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/signup" element={<SignUp />} /> {/* Alias for compatibility */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<TermsOfUse />} />
              
              {/* Previously protected routes - now accessible to all */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/discover/streams" element={<StreamsDiscovery />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/games" element={<Games />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/creators/:creatorId" element={<CreatorChannel />} />
              <Route path="/streams/:streamId" element={<StreamPage />} />
              
              {/* Catch-all/404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </CallProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
