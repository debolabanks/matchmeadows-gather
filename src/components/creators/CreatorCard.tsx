
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Star, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Creator type definition
export interface Creator {
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

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, devModeEnabled } = useAuth();
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Allow liking without login in development mode
    if (!isAuthenticated && !devModeEnabled) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this creator",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Creator liked",
      description: `You have liked ${creator.name}'s profile`,
    });
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Allow messaging without login in development mode
    if (!isAuthenticated && !devModeEnabled) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message this creator",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/messages?creatorId=${creator.id}`);
  };
  
  const handleViewProfile = () => {
    navigate(`/profile/${creator.id}`);
  };

  return (
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
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={handleLike}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={handleMessage}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatorCard;
