
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
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
            setProfiles(prev => [...prev, payload.new as UserProfile]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles(prev => 
              prev.map(profile => 
                profile.id === payload.new.id ? { ...profile, ...payload.new } : profile
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
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProfiles(profiles);
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

  return { profiles, isLoading };
};
