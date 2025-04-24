
import { Heart, Home, MessageSquare, Search, User, Users, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 safe-area-bottom">
      <nav className="flex items-center justify-around py-3 max-w-md mx-auto">
        <NavItem 
          to="/" 
          icon={<Home />} 
          label="Home" 
          isActive={isActive('/') && location.pathname === '/'}
        />
        
        <NavItem 
          to="/discover" 
          icon={<Search />} 
          label="Discover" 
          isActive={isActive('/discover')}
        />
        
        {isAuthenticated && (
          <>
            <NavItem 
              to="/matches" 
              icon={<Heart />} 
              label="Matches" 
              isActive={isActive('/matches')}
            />
            
            <NavItem 
              to="/messages" 
              icon={<MessageSquare />} 
              label="Messages" 
              isActive={isActive('/messages')}
            />
          </>
        )}
        
        <NavItem 
          to="/games" 
          icon={<Gamepad2 />} 
          label="Games" 
          isActive={isActive('/games')}
        />
        
        <NavItem 
          to={isAuthenticated ? `/profile/${user?.id || ''}` : "/sign-in"}
          icon={<User />} 
          label="Profile" 
          isActive={location.pathname.includes('/profile')}
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center ${
        isActive ? 'text-love-500' : 'text-muted-foreground'
      }`}
    >
      <motion.div 
        whileTap={{ scale: 0.9 }}
        className={`h-6 w-6 ${isActive ? 'text-love-500' : 'text-muted-foreground'}`}
      >
        {icon}
      </motion.div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default MobileNav;
