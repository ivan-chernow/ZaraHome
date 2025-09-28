'use client';
import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { ProfilePageContent } from '@/widgets/profile/ui/ProfilePageContent';

const ProfilePage: React.FC = () => (
  <MainLayout>
    <ProfilePageContent />
  </MainLayout>
);

export default ProfilePage;
