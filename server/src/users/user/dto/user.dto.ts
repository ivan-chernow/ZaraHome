import { UserRole } from 'src/shared/shared.interfaces';
import { DeliveryAddress } from '../entity/delivery-address.entity';
import { ChangePasswordDto, ChangeEmailDto } from './validation.dto';
import { CreateDeliveryAddressDto } from './delivery-address.dto';

export class ChangeDeliveryAddressDto extends CreateDeliveryAddressDto {}

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
