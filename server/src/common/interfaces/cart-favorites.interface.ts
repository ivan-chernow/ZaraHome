export interface ICartItem {
  id: number;
  userId: number;
  productId: number;
  product?: any;
  user?: any;
}

export interface IFavoriteItem {
  id: number;
  userId: number;
  productId: number;
  product?: any;
  user?: any;
}

export interface ICartItemWithProduct extends ICartItem {
  product: {
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
    isAvailable: boolean;
  };
}

export interface IFavoriteItemWithProduct extends IFavoriteItem {
  product: {
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
    isAvailable: boolean;
  };
}
