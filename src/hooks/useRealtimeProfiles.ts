
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ProfileWithId = UserProfile & { id: string };

export const useRealtimeProfiles = () => {
  const [profiles, setProfiles] = useState<ProfileWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProfile = convertToProfileWithId(payload.new);
            setProfiles(prev => [...prev, newProfile]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles(prev => 
              prev.map(profile => 
                profile.id === payload.new.id ? convertToProfileWithId(payload.new) : profile
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProfiles(prev => prev.filter(profile => profile.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProfiles = profilesData.map(convertToProfileWithId);
      setProfiles(formattedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error fetching profiles',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert Supabase profile to our app's UserProfile format with ID
  const convertToProfileWithId = (dbProfile: any): ProfileWithId => {
    return {
      id: dbProfile.id,
      bio: dbProfile.bio || '',
      location: dbProfile.location || '',
      photos: dbProfile.avatar_url ? [dbProfile.avatar_url] : [],
      name: dbProfile.full_name || dbProfile.username || 'Anonymous',
      lastActive: dbProfile.last_seen || new Date().toISOString(),
      interests: dbProfile.interests || [],
      status: dbProfile.status || 'offline',
      createdAt: dbProfile.created_at
    };
  };

  return { profiles, isLoading };
};
