import { UserRole } from '../enums/user-role.enum';

export interface IUser {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  id: number;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeliveryAddress {
  id: number;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUserWithRelations extends IUser {
  deliveryAddresses?: IDeliveryAddress[];
  products?: any[];
  favorites?: any[];
  cart?: any[];
  orders?: any[];
}
