'use client';
import React from 'react';
import { CategoryPageContent } from '@/widgets/category/ui/CategoryPageContent';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => (
  <CategoryPageContent params={params} />
);

export default CategoryPage;