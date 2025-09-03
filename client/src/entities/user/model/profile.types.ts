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
    phoneCode: string;
    phone: string; // E.164, напр. +79991234567
    region: string;
    city: string;
    street: string;
    building?: string;
    house: string;
    apartment?: string;
    additionalInfo?: string;
    isDefault: boolean;
}

export interface ChangeDeliveryAddressDto {
    firstName: string;
    lastName: string;
    patronymic: string;
    phoneCode: string;
    phone: string; // E.164, напр. +79991234567
    region: string;
    city: string;
    street: string;
    building?: string;
    house: string;
    apartment?: string;
    additionalInfo?: string;
    isDefault: boolean;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface ChangeEmailDto {
    newEmail: string;
}
