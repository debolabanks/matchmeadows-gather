
export interface Stream {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorImage: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  status: "live" | "scheduled" | "ended";
  viewerCount: number;
  startTime: string;
  endTime?: string;
  category?: string;
  tags?: string[];
  isSubscriberOnly?: boolean;
}

export interface StreamComment {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
  isCreator?: boolean;
}

export interface StreamSubscription {
  userId: string;
  creatorId: string;
  tier: "basic" | "premium" | "vip";
  startDate: string;
  nextBillingDate: string;
  status: "active" | "cancelled" | "paused";
  price: number;
}

export interface StreamReaction {
  type: "like" | "love" | "wow" | "support";
  count: number;
}
