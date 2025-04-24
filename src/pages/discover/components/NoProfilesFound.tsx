
import { Button } from "@/components/ui/button";
import { Filter, Users } from "lucide-react";

interface NoProfilesFoundProps {
  onShowFilters: () => void;
}

const NoProfilesFound = ({ onShowFilters }: NoProfilesFoundProps) => {
  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No profiles match your criteria</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your preferences to see more people
      </p>
      <Button 
        variant="default" 
        onClick={onShowFilters}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Adjust Filters
      </Button>
    </div>
  );
};

export default NoProfilesFound;
