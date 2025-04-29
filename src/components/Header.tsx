
import { Heart, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-love-500 animate-pulse-heart" />
          <span className="font-bold text-xl text-love-700">MatchMeadows</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/discover" className="text-foreground hover:text-love-500 transition-colors">
            Discover
          </Link>
          <Link to="/matches" className="text-foreground hover:text-love-500 transition-colors">
            Matches
          </Link>
          <Link to="/messages" className="text-foreground hover:text-love-500 transition-colors">
            Messages
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link to="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-love-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
