// Типы для пользователей
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export type UserPreferences = {
  language: 'ru' | 'en';
  currency: 'RUB' | 'USD' | 'EUR';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
};

export type UserAddress = {
  id: number;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
  recipientName?: string;
};

export type UserProfile = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  bio?: string;
};

export type UserSecurity = {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockExpiresAt?: Date;
};

export type UserActivity = {
  lastLoginAt: Date;
  lastActivityAt: Date;
  loginCount: number;
  lastIpAddress?: string;
  userAgent?: string;
};

export type UserPermissions = {
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canManageOrders: boolean;
  canManagePromocodes: boolean;
};

export type UserFilters = {
  role?: string;
  status?: UserStatus;
  isEmailVerified?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  lastLoginFrom?: Date;
  lastLoginTo?: Date;
};

export type UserSortOptions = 
  | 'email_asc'
  | 'email_desc'
  | 'created_at_asc'
  | 'created_at_desc'
  | 'last_login_asc'
  | 'last_login_desc'
  | 'role_asc'
  | 'role_desc';
