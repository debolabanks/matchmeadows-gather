
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronRight, Heart, Image, MapPin, Settings, User, Shield, Users, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/user";
import { ProfileCompletion } from "@/components/ProfileCompletion";
import { VerificationBadge } from "@/components/VerificationBadge";
import { LocationPrivacy } from "@/components/LocationPrivacy";
import { LanguagePreferences } from "@/components/LanguagePreferences";
import { PrivacySettings, PrivacySettingsType } from "@/components/PrivacySettings";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Flag, Ban, ShieldAlert } from "lucide-react";
import ReportDialog from "@/components/ReportDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import InterestSelector from "@/components/InterestSelector";
import SettingsNavigation from "@/components/settings/SettingsNavigation";
import ProfileBadges from "@/components/profile/ProfileBadges";

const availableInterests = [
  "Hiking", "Coffee", "Coding", "Reading", "Photography", "Travel", "Music", 
  "Movies", "Cooking", "Art", "Dancing", "Yoga", "Gaming", "Sports", "Fashion",
  "Writing", "Gardening", "Pets", "DIY", "Technology", "Food", "Wine", "Fitness",
  "History", "Languages", "Science", "Politics", "Philosophy", "Volunteering", "Outdoors"
];

const userData = {
  name: "Alex Johnson",
  age: 29,
  gender: "non-binary",
  location: "San Francisco, CA",
  bio: "Coffee enthusiast, hiking lover, and software engineer. Looking for someone who enjoys outdoor adventures and quiet evenings with a good book.",
  interests: ["Hiking", "Coffee", "Coding", "Reading", "Photography", "Travel"],
  profileImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
  photos: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
    "https://images.unsplash.com/photo-1596635831807-46aac6ddb257?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
  ],
  preferences: {
    ageRange: [25, 35],
    distance: 25,
    lookingFor: "Relationship"
  },
  stats: {
    matches: 23,
    likes: 126,
    views: 354
  }
};

const Profile = () => {
  const { user, updateProfile, requestVerification } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  
  const [name, setName] = useState(user?.name || userData.name);
  const [age, setAge] = useState<number | undefined>(user?.profile?.age || userData.age);
  const [gender, setGender] = useState<string>(user?.profile?.gender || userData.gender);
  const [location, setLocation] = useState(user?.profile?.location || userData.location);
  const [bio, setBio] = useState(user?.profile?.bio || userData.bio);
  const [locationPrivacy, setLocationPrivacy] = useState(user?.profile?.locationPrivacy || "public");
  const [language, setLanguage] = useState<string>(user?.profile?.language || "en");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.profile?.interests || userData.interests);
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsType>({
    showActivity: user?.profile?.privacySettings?.showActivity ?? true,
    showDistance: user?.profile?.privacySettings?.showDistance ?? true,
    showOnlineStatus: user?.profile?.privacySettings?.showOnlineStatus ?? true,
    profileVisibility: (user?.profile?.privacySettings?.profileVisibility as "public" | "matches-only" | "private") ?? "public"
  });
  
  const calculateCompletionPercentage = () => {
    const fields = [
      !!name, 
      !!age, 
      !!gender, 
      !!location, 
      !!bio, 
      !!(selectedInterests.length),
      !!(user?.profile?.photos?.length || userData.photos.length),
      !!user?.profile?.verificationStatus
    ];
    
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();
  
  const handleSaveProfile = async () => {
    try {
      const profileData: Partial<UserProfile> = {
        age: age,
        gender: gender as any,
        location,
        bio,
        locationPrivacy: locationPrivacy as any,
        language: language as any,
        interests: selectedInterests,
        privacySettings: privacySettings as any
      };
      
      if (updateProfile) {
        await updateProfile(profileData);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRequestVerification = async () => {
    try {
      if (requestVerification) {
        await requestVerification();
        toast({
          title: "Verification Requested",
          description: "Your verification request has been submitted. We'll review it shortly.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request verification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrivacySettingsChange = (settings: Partial<PrivacySettingsType>) => {
    setPrivacySettings(prev => ({ ...prev, ...settings }));
  };

  const handleBlockUser = (userId: string, userName: string) => {
    toast({
      title: "User Blocked",
      description: `You have blocked ${userName}. They will no longer be able to contact you.`,
    });
    // In a real implementation, this would call an API to block the user
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-24">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <ProfileCompletion 
          percentage={completionPercentage}
          className="max-w-4xl mx-auto mb-8"
        />
        
        <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 relative">
                    <img
                      src={user?.profile?.photos?.[0] || userData.profileImage}
                      alt="Profile"
                      className="rounded-full h-32 w-32 object-cover"
                    />
                    {!isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0"
                        onClick={() => setIsEditing(true)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-xl font-bold mb-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <CardTitle className="flex items-center gap-2">
                        {name}, {age}
                        {user?.profile?.verificationStatus && (
                          <VerificationBadge status={user.profile.verificationStatus} />
                        )}
                      </CardTitle>
                      
                      {user?.profile?.verificationStatus !== 'verified' && 
                       user?.profile?.verificationStatus !== 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={handleRequestVerification}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verify Profile
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="text-muted-foreground"
                        placeholder="Enter your location"
                      />
                    </div>
                  ) : (
                    <CardDescription className="flex items-center justify-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mb-6">
                    <ProfileBadges
                      compatibility={user?.profile?.compatibility || 78}
                      matchPoints={user?.profile?.matchPoints || 240}
                      badges={user?.profile?.badges || [
                        { id: 'chatty', name: 'Chatty', description: 'Exchanged 50+ messages', icon: '💬' },
                        { id: 'responsive', name: 'Responsive', description: 'Responds to 90% of messages', icon: '⚡' }
                      ]}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 mb-6">
                    <div className="p-3">
                      <div className="text-2xl font-bold text-love-600">{userData.stats.matches}</div>
                      <div className="text-xs text-muted-foreground">Matches</div>
                    </div>
                    <div className="p-3">
                      <div className="text-2xl font-bold text-love-600">{userData.stats.likes}</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div className="p-3">
                      <div className="text-2xl font-bold text-love-600">{userData.stats.views}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                  </div>
                  
                  <Link to="/discover">
                    <Button variant="outline" className="w-full">
                      <Heart className="h-4 w-4 mr-2 text-love-500" />
                      Continue Matching
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={age || ''}
                          onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                          min={18}
                          max={100}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <LocationPrivacy 
                        value={locationPrivacy as any} 
                        onChange={(value) => setLocationPrivacy(value)}
                      />
                      
                      <div>
                        <Label htmlFor="bio">About me</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={5}
                          placeholder="Tell others about yourself..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="interests">Interests</Label>
                        <InterestSelector
                          interests={availableInterests}
                          selectedInterests={selectedInterests}
                          onChange={setSelectedInterests}
                          maxSelections={10}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2">About</h3>
                        <p className="text-muted-foreground leading-relaxed">{bio}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Gender</h3>
                        <p className="text-muted-foreground capitalize">{gender?.replace('-', ' ')}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Location Privacy</h3>
                        <div className="flex items-center gap-2">
                          {locationPrivacy === "public" && <MapPin className="h-4 w-4 text-green-500" />}
                          {locationPrivacy === "friends" && <Users className="h-4 w-4 text-blue-500" />}
                          {locationPrivacy === "private" && <Lock className="h-4 w-4 text-red-500" />}
                          <p className="text-muted-foreground capitalize">
                            {locationPrivacy === "public" && "Public - Everyone can see"}
                            {locationPrivacy === "friends" && "Friends only"}
                            {locationPrivacy === "private" && "Private - Only you"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <h3 className="font-semibold mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Looking For</h3>
                    <p className="text-muted-foreground">
                      {userData.preferences.lookingFor} • 
                      Ages {userData.preferences.ageRange[0]}-{userData.preferences.ageRange[1]} • 
                      Within {userData.preferences.distance} miles
                    </p>
                  </div>
                </CardContent>
                
                {isEditing && (
                  <CardFooter className="justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Your Photos</CardTitle>
                <CardDescription>
                  Add up to 6 photos to show your best self
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-80 hover:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                  
                  <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="text-center p-4">
                      <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Add Photo
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="justify-between">
                <div className="text-sm text-muted-foreground">
                  {userData.photos.length} of 6 photos
                </div>
                <Button>Save Photos</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              
              <CardContent>
                <SettingsNavigation
                  activeSection={activeSettingsSection || undefined}
                  onNavigate={setActiveSettingsSection}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings 
              settings={privacySettings}
              onChange={handlePrivacySettingsChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default Profile;
