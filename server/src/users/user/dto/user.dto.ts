import { UserRole } from "src/common/enums/user-role.enum";
import { DeliveryAddress } from "../entity/delivery-address.entity";
import { ChangePasswordDto, ChangeEmailDto, AddressDto } from "src/common/dto/validation.dto";

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