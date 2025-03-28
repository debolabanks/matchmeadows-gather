
import { Heart, LogOut, MessageSquare, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-love-500 animate-pulse-heart" />
          <span className="font-bold text-xl text-love-700">MatchMeadows</span>
        </Link>
        
        {isAuthenticated && (
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
        )}
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-love-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-3 py-2 text-sm font-medium border-b">
                    {user?.name}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
