import { UserRole } from "src/shared/shared.interfaces";
import { DeliveryAddress } from "../entity/delivery-address.entity";
import { ChangePasswordDto, ChangeEmailDto, AddressDto } from "./validation.dto";

export class ChangeDeliveryAddressDto extends AddressDto {}

export class ProfileDto {
    id: number;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    phone?: string;
    deliveryAddresses?: DeliveryAddress[];
}

// Re-export common DTOs
export { ChangePasswordDto, ChangeEmailDto };