
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthProvider";
import { CallProvider } from "./contexts/CallContext";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
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

// Include any additional imports needed for your app

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CallProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<TermsOfUse />} />
              
              {/* Protected routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <ProtectedRoute>
                    <Discover />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discover/streams" 
                element={
                  <ProtectedRoute>
                    <StreamsDiscovery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/matches" 
                element={
                  <ProtectedRoute>
                    <Matches />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/verification" 
                element={
                  <ProtectedRoute>
                    <Verification />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/games" 
                element={
                  <ProtectedRoute>
                    <Games />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription" 
                element={
                  <ProtectedRoute>
                    <Subscription />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creators" 
                element={
                  <ProtectedRoute>
                    <Creators />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creators/:creatorId" 
                element={
                  <ProtectedRoute>
                    <CreatorChannel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/streams/:streamId" 
                element={
                  <ProtectedRoute>
                    <StreamPage />
                  </ProtectedRoute>
                } 
              />
              
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
