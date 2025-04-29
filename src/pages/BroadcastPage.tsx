
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CreatorBroadcast from '@/components/stream/CreatorBroadcast';

const BroadcastPage = () => {
  const { user } = useAuth();
  const { creatorId } = useParams<{ creatorId: string }>();
  
  // Use user ID if creatorId is not provided
  const effectiveCreatorId = creatorId || user?.id || 'default-creator';
  const creatorName = user?.name || 'Creator';
  
  return (
    <div className="container mx-auto py-8 pt-20 md:pt-24">
      <h1 className="text-3xl font-bold mb-6">Go Live</h1>
      <CreatorBroadcast creatorId={effectiveCreatorId} creatorName={creatorName} />
    </div>
  );
};

export default BroadcastPage;
