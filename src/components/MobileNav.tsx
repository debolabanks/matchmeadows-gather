
import { Heart, Home, MessageSquare, Search, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around py-3">
        <Link 
          to="/" 
          className={`flex flex-col items-center ${isActive('/') ? 'text-love-500' : 'text-muted-foreground'}`}
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
        
        <Link 
          to="/creators" 
          className={`flex flex-col items-center ${isActive('/creators') ? 'text-love-500' : 'text-muted-foreground'}`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs mt-1">Creators</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
