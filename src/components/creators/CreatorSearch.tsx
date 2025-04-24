
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CreatorSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CreatorSearch = ({ searchQuery, setSearchQuery }: CreatorSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search creators..." 
          className="pl-10 text-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreatorSearch;
