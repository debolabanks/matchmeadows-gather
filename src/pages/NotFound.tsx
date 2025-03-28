
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-love-500 mb-4">404</h1>
        <p className="text-2xl text-foreground mb-8">Oops! Page not found</p>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto">
          We couldn't find the page you're looking for. Perhaps you're meant to find love, not this page.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
