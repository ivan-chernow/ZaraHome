'use client';
import React from 'react';
import { SubCategoryPageContent } from '@/widgets/subcategory/ui/SubCategoryPageContent';

interface SubCategoryPageProps {
  params: Promise<{ category: string; subCategory: string }>;
}

const SubCategoryPage: React.FC<SubCategoryPageProps> = ({ params }) => (
  <SubCategoryPageContent params={params} />
);

export default SubCategoryPage;
