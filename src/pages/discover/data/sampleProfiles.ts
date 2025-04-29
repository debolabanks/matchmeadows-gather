
import { format, formatDistanceToNow } from "date-fns";
import { ProfileCardProps } from "@/components/ProfileCard";

// Enhanced sample data for profiles
export const sampleProfiles: Omit<ProfileCardProps, 'onLike' | 'onDislike'>[] = [
  {
    id: "1",
    name: "Emma",
    age: 28,
    gender: "female",
    location: "New York",
    bio: "Passionate about photography, hiking, and trying new recipes. Looking for someone who enjoys outdoor adventures and quiet evenings with a good book.",
    interests: ["Photography", "Hiking", "Cooking", "Reading"],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "5 miles",
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: "2",
    name: "James",
    age: 32,
    gender: "male",
    location: "Boston",
    bio: "Software engineer by day, musician by night. I love finding new coffee shops, attending local concerts, and exploring the city on my bike.",
    interests: ["Music", "Coding", "Coffee", "Cycling"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "12 miles",
    coordinates: { latitude: 42.3601, longitude: -71.0589 }
  },
  {
    id: "3",
    name: "Sophia",
    age: 26,
    gender: "female",
    location: "San Francisco",
    bio: "Yoga instructor and avid traveler. I've visited 20 countries so far and always planning my next adventure. Looking for someone with wanderlust and a positive outlook.",
    interests: ["Yoga", "Travel", "Languages", "Meditation"],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    distance: "8 miles",
    coordinates: { latitude: 37.7749, longitude: -122.4194 }
  },
  {
    id: "4",
    name: "Michael",
    age: 30,
    gender: "male",
    location: "Chicago",
    bio: "Chef at a local restaurant. Passionate about food, wine, and exploring farmers markets. When I'm not cooking, you can find me at sports events or trying new restaurants.",
    interests: ["Cooking", "Wine", "Sports", "Food"],
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "3 miles",
    coordinates: { latitude: 41.8781, longitude: -87.6298 }
  },
  {
    id: "5",
    name: "Olivia",
    age: 27,
    gender: "female",
    location: "Los Angeles",
    bio: "Film industry professional with a passion for storytelling. Love hiking in the canyons, beach days, and finding the best tacos in the city. Looking for genuine connections.",
    interests: ["Movies", "Hiking", "Beach", "Arts"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    distance: "7 miles",
    coordinates: { latitude: 34.0522, longitude: -118.2437 }
  },
  {
    id: "6",
    name: "Ethan",
    age: 29,
    gender: "male",
    location: "Denver",
    bio: "Mountain enthusiast and craft beer lover. When I'm not hiking or skiing, I'm trying new breweries or playing with my dog in the park.",
    interests: ["Hiking", "Skiing", "Beer", "Dogs"],
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=776&q=80",
    distance: "15 miles",
    coordinates: { latitude: 39.7392, longitude: -104.9903 }
  },
  {
    id: "7",
    name: "Ava",
    age: 25,
    gender: "female",
    location: "Seattle",
    bio: "Environmental scientist by day, indie music fan by night. I enjoy kayaking, exploring coffee shops, and attending local art exhibitions.",
    interests: ["Nature", "Music", "Coffee", "Art"],
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=776&q=80",
    distance: "10 miles",
    coordinates: { latitude: 47.6062, longitude: -122.3321 }
  }
];
