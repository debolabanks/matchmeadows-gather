
export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  matchDate: string;
  hasUnread?: boolean;
  hasUnreadMessage?: boolean; // Add this property to fix the type error
  compatibilityScore: number;
}
