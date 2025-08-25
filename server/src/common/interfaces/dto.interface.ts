export interface ICreateProductDto {
  name_eng: string;
  name_ru: string;
  img: string[];
  colors: string[];
  size: { size: string; price: number }[];
  deliveryDate: string;
  description: string;
  isNew?: boolean;
  discount?: number;
  isAvailable?: boolean;
  categoryId?: number;
  subCategoryId?: number;
  typeId?: number;
}

export interface IUpdateProductDto extends Partial<ICreateProductDto> {
  id: number;
}

export interface ICreateUserDto {
  email: string;
  password: string;
  role?: string;
}

export interface IUpdateUserDto {
  id: number;
  email?: string;
  password?: string;
  role?: string;
  isEmailVerified?: boolean;
}

export interface ICreateOrderDto {
  userId: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }>;
  deliveryAddress: string;
  totalAmount: number;
}

export interface IUpdateOrderDto {
  id: number;
  status?: string;
  deliveryAddress?: string;
  totalAmount?: number;
}

export interface ICreatePromocodeDto {
  code: string;
  discount: number;
  validFrom: Date;
  validTo: Date;
  maxUses: number;
}

export interface IUpdatePromocodeDto {
  id: number;
  code?: string;
  discount?: number;
  isActive?: boolean;
  validFrom?: Date;
  validTo?: Date;
  maxUses?: number;
}
