
import React from "react";
import CreatorCard, { Creator } from "./CreatorCard";

interface CreatorGridProps {
  creators: Creator[];
}

const CreatorGrid = ({ creators }: CreatorGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.length > 0 ? (
        creators.map(creator => (
          <CreatorCard key={creator.id} creator={creator} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-medium">No creators found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CreatorGrid;
