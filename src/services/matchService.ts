
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/match';

export const getMatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      matched_user:matched_user_id(
        id,
        profiles!inner(*)
      )
    `)
    .eq('user_id', userId)
    .order('matched_at', { ascending: false });

  if (error) throw error;
  return data as Match[];
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
