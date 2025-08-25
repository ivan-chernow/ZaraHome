export interface IProduct {
  id: number;
  name_eng: string;
  name_ru: string;
  img: string[];
  colors: string[];
  size: { size: string; price: number }[];
  deliveryDate: string;
  description: string;
  isNew?: boolean;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
}

export interface ICategory {
  id: number;
  name: string;
  products?: IProduct[];
  subCategories?: ISubCategory[];
}

export interface ISubCategory {
  id: number;
  name: string;
  category?: ICategory;
  products?: IProduct[];
  types?: IType[];
}

export interface IType {
  id: number;
  name: string;
  subCategory?: ISubCategory;
  products?: IProduct[];
}

export interface IProductWithRelations extends IProduct {
  category?: ICategory;
  subCategory?: ISubCategory;
  type?: IType;
}
