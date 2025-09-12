import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/shared.interfaces';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
