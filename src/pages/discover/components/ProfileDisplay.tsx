import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { MatchCriteria } from "@/utils/matchingAlgorithm";
import { ProfileCardProps } from "@/components/ProfileCard";

interface ProfileDisplayProps {
  currentProfiles: Omit<ProfileCardProps, 'onLike' | 'onDislike'>[];
  handleLike: (id: string) => void;
  handleDislike: (id: string) => void;
  preferences: MatchCriteria;
  isPremium: boolean;
}

const ProfileDisplay = ({ 
  currentProfiles, 
  handleLike, 
  handleDislike, 
  preferences,
  isPremium
}: ProfileDisplayProps) => {
  return (
    <div className="max-w-md mx-auto">
      {currentProfiles.length > 0 ? (
        <>
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing profiles within {preferences.maxDistance} miles
            </span>
          </div>
          
          <AnimatePresence>
            <motion.div
              key={currentProfiles[0].id}
              initial={{ scale: 0.8, opacity: 0, rotateZ: -5 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateZ: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100) {
                  handleLike(currentProfiles[0].id);
                } else if (offset.x < -100) {
                  handleDislike(currentProfiles[0].id);
                }
              }}
            >
              <ProfileCard
                {...currentProfiles[0]}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div className="profile-card flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
            <p className="text-muted-foreground mb-4">
              Check back soon for more matches
            </p>
            <div className="animate-pulse bg-love-100 text-love-500 p-2 rounded-full inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                <path d="M12 3a9 9 0 0 1 9 9" />
                <path d="M9 9h.01" />
                <path d="M15 9h.01" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;
