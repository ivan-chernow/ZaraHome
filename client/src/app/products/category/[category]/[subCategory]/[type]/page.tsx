'use client';
import React from 'react';
import { TypePageWidget } from '@/widgets/type/ui/TypePageWidget';

interface TypePageProps {
  params: Promise<{ category: string; subCategory: string; type: string }>;
}

const TypePage: React.FC<TypePageProps> = ({ params }) => (
  <TypePageWidget params={params} />
);

export default TypePage;
