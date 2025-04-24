
import React, { useState, useEffect } from "react";
import AdBanner from "@/components/AdBanner";
import CreatorSearch from "@/components/creators/CreatorSearch";
import CreatorFilters from "@/components/creators/CreatorFilters";
import CreatorGrid from "@/components/creators/CreatorGrid";
import { Creator } from "@/components/creators/CreatorCard";
import { getMockCreators } from "@/components/creators/mockCreatorsData";

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Get mock creator data from our new data file
    const mockCreators = getMockCreators();
    setCreators(mockCreators);
  }, []);

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    if (filter === "online") return matchesSearch && creator.isOnline;
    if (filter === "upcoming") return matchesSearch && creator.nextSession;
    
    return matchesSearch;
  });

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creators</h1>
          <p className="text-muted-foreground mt-1">Connect with relationship experts and coaches</p>
        </div>
      </div>
      
      <CreatorSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <AdBanner variant="small" position="top" />
      
      <CreatorFilters setFilter={setFilter} />
      
      <CreatorGrid creators={filteredCreators} />
    </div>
  );
};

export default Creators;
