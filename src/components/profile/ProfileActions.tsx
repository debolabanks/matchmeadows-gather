
import { motion } from "framer-motion";
import { Heart, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileActionsProps {
  id: string;
  name: string;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onBlock: () => void;
  isMatched?: boolean;
}

const ProfileActions = ({
  id,
  name,
  onLike,
  onDislike,
  onBlock,
  isMatched = false,
}: ProfileActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-center gap-4 p-4 bg-background/80 backdrop-blur-sm w-full">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full bg-white p-3 shadow-lg ${isMobile ? 'h-14 w-14' : ''}`}
        onClick={() => onDislike(id)}
        aria-label="Dislike"
      >
        <X className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} text-red-500`} />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full bg-white p-3 shadow-lg ${isMobile ? 'h-14 w-14' : ''}`}
        onClick={() => onLike(id)}
        aria-label="Like"
      >
        <Heart className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} text-green-500`} />
      </motion.button>

      <Button 
        variant="ghost" 
        size="icon"
        className={`rounded-full ${isMobile ? 'h-12 w-12' : 'h-10 w-10'}`}
        onClick={onBlock}
        title={`Block ${name}`}
        aria-label={`Block ${name}`}
      >
        <Flag className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default ProfileActions;
