
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Search, Star, Users, Video, Clock } from "lucide-react";
import AdBanner from "@/components/AdBanner";

// Creator type definition
interface Creator {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  followers: number;
  category: string;
  rating: number;
  isOnline: boolean;
  isVerified: boolean;
  tags: string[];
  nextSession?: string;
}

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulated creator data
    const mockCreators: Creator[] = [
      {
        id: "1",
        name: "Sophie Chen",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        bio: "Relationship coach specializing in dating advice and building meaningful connections.",
        followers: 12500,
        category: "Dating Coach",
        rating: 4.8,
        isOnline: true,
        isVerified: true,
        tags: ["Dating", "Relationships", "Self-improvement"],
        nextSession: "Tomorrow at 7:00 PM"
      },
      {
        id: "2",
        name: "James Wilson",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        bio: "Confidence coach helping you overcome social anxiety and build authentic connections.",
        followers: 8700,
        category: "Confidence Coach",
        rating: 4.6,
        isOnline: false,
        isVerified: true,
        tags: ["Confidence", "Social Skills", "Anxiety"],
        nextSession: "Friday at 6:30 PM"
      },
      {
        id: "3",
        name: "Olivia Martinez",
        imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        bio: "Licensed therapist specializing in relationship counseling and emotional well-being.",
        followers: 15200,
        category: "Therapist",
        rating: 4.9,
        isOnline: true,
        isVerified: true,
        tags: ["Therapy", "Emotional Health", "Relationships"],
        nextSession: "Today at 5:00 PM"
      },
      {
        id: "4",
        name: "David Kim",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        bio: "Dating strategist helping busy professionals find meaningful relationships.",
        followers: 6300,
        category: "Dating Strategist",
        rating: 4.5,
        isOnline: false,
        isVerified: true,
        tags: ["Online Dating", "Busy Professionals", "Strategy"],
      }
    ];
    
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
        <div className="flex items-center gap-2">
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
      </div>
      
      <AdBanner variant="small" position="top" />
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter("all")}>All Creators</TabsTrigger>
          <TabsTrigger value="online" onClick={() => setFilter("online")}>Online Now</TabsTrigger>
          <TabsTrigger value="upcoming" onClick={() => setFilter("upcoming")}>Upcoming Sessions</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.length > 0 ? (
          filteredCreators.map(creator => (
            <Card key={creator.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <img 
                    src={creator.imageUrl} 
                    alt={creator.name}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-love-500 text-white">
                        {creator.category}
                      </Badge>
                      {creator.isVerified && (
                        <Badge variant="outline" className="bg-primary/10 border-primary/30">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{creator.rating}</span>
                    </div>
                  </div>
                  {creator.isOnline && (
                    <Badge className="absolute top-4 right-4 bg-green-500">Live</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={creator.imageUrl} alt={creator.name} />
                      <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{creator.name}</CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" /> 
                        {creator.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {creator.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {creator.nextSession && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Next session: {creator.nextSession}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 pt-0">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  asChild
                >
                  <Link to={`/creators/${creator.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium">No creators found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creators;
