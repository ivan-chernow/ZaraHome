import { MinLength } from "class-validator";

import { IsString } from "class-validator";

import { IsEmail } from "class-validator";
import { UserRole } from "../entity/user.entity";
import { DeliveryAddress } from "../entity/delivery-address.entity";

export class ChangePasswordDto {
    @IsString()
    @MinLength(12)
    newPassword: string;
}

export class ChangeEmailDto {
    @IsEmail()
    newEmail: string;
}

export class ChangeDeliveryAddressDto {
    @IsString()
    region: string;

    @IsString()
    city: string;

    @IsString()
    street: string;
}

export class ProfileDto {
    id: number;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    phone?: string;
    deliveryAddresses?: DeliveryAddress[];
}