import { User } from './user/entity/user.entity';
import { DeliveryAddress } from './user/entity/delivery-address.entity';
import { CreateUserDto, UpdateUserDto } from './user/dto';

// Интерфейс для ответа с пагинацией
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Интерфейс для поиска пользователей
export interface UserSearchFilters {
  query?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Интерфейс для статистики пользователей
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  pendingVerificationUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
}

// Интерфейс для ответа поиска пользователей
export type UserSearchResponse = PaginatedResponse<User>;

// Интерфейс для создания пользователя
export interface CreateUserData extends CreateUserDto {
  password: string;
}

// Интерфейс для обновления пользователя
export interface UpdateUserData extends Partial<UpdateUserDto> {
  id: number;
}

// Интерфейс для адреса доставки
export interface DeliveryAddressData {
  id: number;
  firstName: string;
  lastName: string;
  patronymic?: string;
  phoneCode: string;
  phone: string;
  region: string;
  city: string;
  street: string;
  building?: string;
  house: string;
  apartment?: string;
  postalCode: string;
  additionalInfo?: string;
  isDefault: boolean;
  addressName: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для ответа с адресами доставки
export type DeliveryAddressesResponse = PaginatedResponse<DeliveryAddress>;

// Интерфейс для фильтров адресов
export interface AddressFilters {
  userId: number;
  isDefault?: boolean;
  city?: string;
  region?: string;
}

// Интерфейс для сервиса пользователей
export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findAll(filters?: UserSearchFilters): Promise<UserSearchResponse>;
  findOne(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getUserProfile(userId: number): Promise<User>;
  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;
  changeEmail(
    userId: number,
    currentEmail: string,
    newEmail: string,
    password: string
  ): Promise<{ message: string }>;
  getUserStatistics(): Promise<UserStatistics>;
  searchUsers(filters: UserSearchFilters): Promise<UserSearchResponse>;
  updateUserStatus(userId: number, status: string): Promise<User>;
  incrementLoginAttempts(userId: number): Promise<void>;
  resetLoginAttempts(userId: number): Promise<void>;
  lockUser(userId: number, duration?: number): Promise<void>;
  unlockUser(userId: number): Promise<void>;
}

// Интерфейс для сервиса адресов доставки
export interface IDeliveryAddressService {
  createAddress(
    userId: number,
    addressData: Partial<DeliveryAddress>
  ): Promise<DeliveryAddress>;
  findAllByUser(
    userId: number,
    filters?: AddressFilters
  ): Promise<DeliveryAddress[]>;
  findOne(id: number, userId: number): Promise<DeliveryAddress | null>;
  updateAddress(
    id: number,
    userId: number,
    addressData: Partial<DeliveryAddress>
  ): Promise<DeliveryAddress>;
  deleteAddress(id: number, userId: number): Promise<void>;
  setDefaultAddress(id: number, userId: number): Promise<void>;
  getDefaultAddress(userId: number): Promise<DeliveryAddress | null>;
}
