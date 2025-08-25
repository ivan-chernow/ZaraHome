// Типы для продуктов
export type ProductSize = {
  size: string;
  price: number;
};

export type ProductColors = string[];

export type ProductImages = string[];

export type ProductStatus = 'available' | 'unavailable' | 'out_of_stock';

export type ProductCondition = 'new' | 'used' | 'refurbished';

export type ProductDiscount = {
  percentage: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
};

export type ProductMetadata = {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  material?: string;
  brand?: string;
  model?: string;
};

export type ProductVariants = {
  color: string;
  size: string;
  stock: number;
  price: number;
  sku: string;
};

export type ProductFilters = {
  categoryId?: number;
  subCategoryId?: number;
  typeId?: number;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  hasDiscount?: boolean;
  isAvailable?: boolean;
};

export type ProductSortOptions = 
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'created_at_asc'
  | 'created_at_desc'
  | 'popularity_asc'
  | 'popularity_desc';
