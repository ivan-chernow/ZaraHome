'use client';
import React from 'react';
import { SubCategoryPageWidget } from '@/widgets/subcategory/ui/SubCategoryPageWidget';

interface SubCategoryPageProps {
  params: Promise<{ category: string; subCategory: string }>;
}

const SubCategoryPage: React.FC<SubCategoryPageProps> = ({ params }) => (
  <SubCategoryPageWidget params={params} />
);

export default SubCategoryPage;
