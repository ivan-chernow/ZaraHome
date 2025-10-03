'use client';

import React, { Suspense } from 'react';
import { ProfileSkeleton } from '@/shared/ui/skeletons/ProfileSkeleton';
import { ProfilePageContent } from './ProfilePageContent';

export const ProfilePageWidget: React.FC = () => {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePageWidget;
