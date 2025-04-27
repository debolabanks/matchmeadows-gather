
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/match';

export const getMatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      matched_user:matched_user_id(id)
    `)
    .eq('user_id', userId)
    .order('matched_at', { ascending: false });

  if (error) throw error;
  
  // Get profiles for matched users
  const matchedUserIds = data.map(match => match.matched_user_id);
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', matchedUserIds);
  
  if (profilesError) throw profilesError;
  
  // Convert database matches to our app's Match format
  const formattedMatches: Match[] = data.map(match => {
    const matchedUserProfile = profilesData?.find(profile => profile.id === match.matched_user_id) || {};
    
    return {
      id: match.id,
      userId: match.user_id,
      matchedUserId: match.matched_user_id,
      name: matchedUserProfile.full_name || matchedUserProfile.username || 'Anonymous',
      imageUrl: matchedUserProfile.avatar_url || '/placeholder.svg',
      lastActive: matchedUserProfile.last_seen || match.updated_at,
      matchDate: match.matched_at,
      hasUnread: !!match.has_unread_message,
      hasUnreadMessage: !!match.has_unread_message,
      compatibilityScore: match.compatibility_percentage || 0
    };
  });
  
  return formattedMatches;
};

export const subscribeToMatches = (
  userId: string,
  onUpdate: (matches: Match[]) => void
) => {
  return supabase
    .channel('matches')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        // Fetch updated matches when changes occur
        const matches = await getMatches(userId);
        onUpdate(matches);
      }
    )
    .subscribe();
};
