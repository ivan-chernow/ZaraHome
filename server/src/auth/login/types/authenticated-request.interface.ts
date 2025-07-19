import { Request } from 'express';
import { User } from '../../../users/user/entity/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
