'use client';
import React from 'react';
import { CategoryPageWidget } from '@/widgets/category/ui/CategoryPageWidget';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => (
  <CategoryPageWidget params={params} />
);

export default CategoryPage;
