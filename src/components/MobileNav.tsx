
import { Heart, Home, MessageSquare, Search, User, Users, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Only show auth-required navigation items when authenticated
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around py-3">
        <Link 
          to="/" 
          className={`flex flex-col items-center ${isActive('/') && location.pathname === '/' ? 'text-love-500' : 'text-muted-foreground'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/discover" 
          className={`flex flex-col items-center ${isActive('/discover') ? 'text-love-500' : 'text-muted-foreground'}`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        
        {isAuthenticated && (
          <>
            <Link 
              to="/matches" 
              className={`flex flex-col items-center ${isActive('/matches') ? 'text-love-500' : 'text-muted-foreground'}`}
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Matches</span>
            </Link>
            
            <Link 
              to="/messages" 
              className={`flex flex-col items-center ${isActive('/messages') ? 'text-love-500' : 'text-muted-foreground'}`}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-xs mt-1">Messages</span>
            </Link>
          </>
        )}
        
        <Link 
          to="/games" 
          className={`flex flex-col items-center ${isActive('/games') ? 'text-love-500' : 'text-muted-foreground'}`}
        >
          <Gamepad2 className="h-6 w-6" />
          <span className="text-xs mt-1">Games</span>
        </Link>
        
        <Link 
          to={isAuthenticated ? `/profile/${user?.id || ''}` : "/sign-in"}
          className={`flex flex-col items-center ${location.pathname.includes('/profile') ? 'text-love-500' : 'text-muted-foreground'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
