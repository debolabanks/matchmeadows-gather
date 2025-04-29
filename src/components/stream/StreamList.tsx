
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Users, Clock } from "lucide-react";
import { Stream } from "@/types/stream";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StreamListProps {
  streams: Stream[];
  title?: string;
  description?: string;
  className?: string;
}

const StreamList = ({ streams, title = "Live Now", description, className = "" }: StreamListProps) => {
  const [filter, setFilter] = useState<"all" | "live" | "scheduled">("all");
  
  const filteredStreams = streams.filter(stream => {
    if (filter === "all") return true;
    if (filter === "live") return stream.status === "live";
    if (filter === "scheduled") return stream.status === "scheduled";
    return true;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "live" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("live")}
            >
              Live
            </Button>
            <Button 
              variant={filter === "scheduled" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("scheduled")}
            >
              Scheduled
            </Button>
          </div>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {filteredStreams.length === 0 ? (
        <div className="text-center py-8">
          <Video className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">No streams found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStreams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <Link to={`/streams/${stream.id}`}>
                <div className="relative">
                  <img
                    src={stream.thumbnailUrl}
                    alt={stream.title}
                    className="w-full aspect-video object-cover"
                  />
                  {stream.status === "live" ? (
                    <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse">
                      LIVE
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      {stream.status === "scheduled" ? "UPCOMING" : "ENDED"}
                    </Badge>
                  )}
                  {stream.isSubscriberOnly && (
                    <Badge variant="default" className="absolute top-2 right-2">
                      Subscribers
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {stream.viewerCount}
                  </div>
                </div>
              </Link>
              <CardHeader className="py-3">
                <Link to={`/streams/${stream.id}`}>
                  <CardTitle className="text-lg line-clamp-1">{stream.title}</CardTitle>
                </Link>
                <Link to={`/creators/${stream.creatorId}`} className="flex items-center gap-2 hover:underline">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={stream.creatorImage} />
                    <AvatarFallback>{stream.creatorName[0]}</AvatarFallback>
                  </Avatar>
                  <CardDescription className="line-clamp-1">
                    {stream.creatorName}
                  </CardDescription>
                </Link>
              </CardHeader>
              <CardFooter className="pt-0 pb-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {stream.status === "live" 
                    ? "Started " + new Date(stream.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : new Date(stream.startTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                  }
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamList;
