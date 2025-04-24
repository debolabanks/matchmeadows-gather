
import { Creator } from "./CreatorCard";

export const getMockCreators = (): Creator[] => {
  return [
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
};
