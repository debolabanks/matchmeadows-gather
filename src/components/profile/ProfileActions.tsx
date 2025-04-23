
import { motion } from "framer-motion";
import { Heart, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex justify-center gap-4 p-4 bg-background/80 backdrop-blur-sm">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="rounded-full bg-white p-3 shadow-lg"
        onClick={() => onDislike(id)}
      >
        <X className="h-8 w-8 text-red-500" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="rounded-full bg-white p-3 shadow-lg"
        onClick={() => onLike(id)}
      >
        <Heart className="h-8 w-8 text-green-500" />
      </motion.button>

      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={onBlock}
        title={`Block ${name}`}
      >
        <Flag className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default ProfileActions;
