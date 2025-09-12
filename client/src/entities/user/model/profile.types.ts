export interface ProfileDto {
  id: number;
  email: string;
  role: string;
  isEmailVerified: boolean;
  deliveryAddresses?: DeliveryAddressDto[];
}

export interface DeliveryAddressDto {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  region: string;
  city: string;
  street: string;
  building?: string;
  house: string;
  apartment?: string;
  additionalInfo?: string;
}

export interface ChangeDeliveryAddressDto {
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  region: string;
  city: string;
  street: string;
  building?: string;
  house: string;
  apartment?: string;
  additionalInfo?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailDto {
  newEmail: string;
}
