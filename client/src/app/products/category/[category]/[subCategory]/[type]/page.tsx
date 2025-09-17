'use client';
import React from 'react';
import { TypePageContent } from '@/widgets/type/ui/TypePageContent';

interface TypePageProps {
  params: Promise<{ category: string; subCategory: string; type: string }>;
}

const TypePage: React.FC<TypePageProps> = ({ params }) => (
  <TypePageContent params={params} />
);

export default TypePage;