
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-love-500" />
            <span className="font-bold text-lg">MatchMeadows</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-love-500 transition-colors">
              About
            </Link>
            <Link to="/terms" className="hover:text-love-500 transition-colors">
              Terms
            </Link>
            <Link to="/games" className="hover:text-love-500 transition-colors">
              Games
            </Link>
            <Link to="/verification" className="hover:text-love-500 transition-colors">
              Verification
            </Link>
            <Link to="/subscription" className="hover:text-love-500 transition-colors">
              Premium
            </Link>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MatchMeadows. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
