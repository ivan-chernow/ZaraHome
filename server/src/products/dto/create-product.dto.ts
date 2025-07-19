export class CreateProductDto {
  name_eng: string;
  name_ru: string;
  img: string[];
  colors: string[];
  size: { size: string; price: number }[];
  deliveryDate: string;
  description: string;
  isNew?: boolean;
  discount?: number;
  isAvailable: boolean;
  categoryId: number;
  subCategoryId: number;
  typeId?: number;
} 