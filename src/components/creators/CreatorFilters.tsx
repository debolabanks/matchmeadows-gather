
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreatorFiltersProps {
  setFilter: (filter: string) => void;
}

const CreatorFilters = ({ setFilter }: CreatorFiltersProps) => {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList>
        <TabsTrigger value="all" onClick={() => setFilter("all")}>All Creators</TabsTrigger>
        <TabsTrigger value="online" onClick={() => setFilter("online")}>Online Now</TabsTrigger>
        <TabsTrigger value="upcoming" onClick={() => setFilter("upcoming")}>Upcoming Sessions</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CreatorFilters;
