import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { ChangePasswordDto, ProfileDto } from './dto/user.dto';
import { ChangeDeliveryAddressDto } from './dto/user.dto';
import { IUserService } from 'src/common/interfaces/service.interface';
import { User } from './entity/user.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async findOne(userId: number) {
    return this.userRepository.findUserByIdBasic(userId);
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepository.findUserByIdWithPassword(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем, что новый пароль отличается от текущего
    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Новый пароль не может совпадать с текущим');
    }

    // Проверяем время последней смены пароля
    const timeSinceLastChange = Date.now() - user.updatedAt.getTime();
    const minutesSinceLastChange = timeSinceLastChange / (1000 * 60);

    if (minutesSinceLastChange < 10) {
      throw new BadRequestException(
        `Пожалуйста, подождите ${Math.ceil(10 - minutesSinceLastChange)} минут перед следующей сменой пароля`
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.updateUserPassword(userId, hashedPassword);

    return { message: 'Пароль успешно изменен' };
  }

  async changeEmail(userId: number, currentEmail: string, newEmail: string) {
    const currentEmailUser = await this.userRepository.findUserByEmail(currentEmail);

    if (!currentEmailUser) {
      throw new NotFoundException('Введите корректный текущий email');
    }

    if (currentEmailUser.id !== userId) {
      throw new BadRequestException('Этот email уже используется');
    }

    if (newEmail === currentEmail) {
      throw new BadRequestException('Новый email не может совпадать с текущим');
    }

    // Проверяем время с последнего обновления
    const timeSinceLastChange = Date.now() - currentEmailUser.updatedAt.getTime();
    const minutesSinceLastChange = timeSinceLastChange / (1000 * 60);

    if (minutesSinceLastChange < 10) {
      throw new BadRequestException(
        `Пожалуйста, подождите ${Math.ceil(10 - minutesSinceLastChange)} минут перед следующей сменой email`
      );
    }

    await this.userRepository.updateUserEmail(userId, newEmail);

    return { message: 'Email успешно изменен' };
  }

  async changeDeliveryAddress(userId: number, addressData: ChangeDeliveryAddressDto) {
    const user = await this.userRepository.findUserByIdWithAddresses(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Если у пользователя уже есть адрес, обновляем его
    if (user.deliveryAddresses?.length > 0) {
      const existingAddress = user.deliveryAddresses[0];
      await this.userRepository.updateAddress(existingAddress.id, addressData);
      return { message: 'Адрес доставки обновлен' };
    }

    // Если адреса нет, создаем новый
    const deliveryAddress = await this.userRepository.createAddress({
      ...addressData,
      user
    });

    return { message: 'Адрес доставки добавлен' };
  }

  async getDeliveryAddresses(userId: number) {
    const user = await this.userRepository.findUserByIdWithAddresses(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.deliveryAddresses;
  }

  async addDeliveryAddress(userId: number, addressData: ChangeDeliveryAddressDto) {
    const user = await this.userRepository.findUserByIdBasic(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.userRepository.createAddress({
      ...addressData,
      user
    });
  }

  async updateDeliveryAddress(userId: number, addressId: number, addressData: ChangeDeliveryAddressDto) {
    const address = await this.userRepository.findAddressById(addressId);

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    if (address.user.id !== userId) {
      throw new BadRequestException('У вас нет прав на изменение этого адреса');
    }

    await this.userRepository.updateAddress(addressId, addressData);
    return this.userRepository.findAddressById(addressId);
  }

  async deleteDeliveryAddress(userId: number, addressId: number): Promise<void> {
    const address = await this.userRepository.findAddressById(addressId);

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    if (address.user.id !== userId) {
      throw new BadRequestException('У вас нет прав на удаление этого адреса');
    }

    await this.userRepository.removeAddress(address);
  }

  // Реализация методов из IBaseService
  async create(data: unknown): Promise<unknown> {
    // Этот метод не используется в UserService, но требуется интерфейсом
    throw new Error('Method not implemented');
  }

  async findAll(): Promise<unknown[]> {
    // Этот метод не используется в UserService, но требуется интерфейсом
    throw new Error('Method not implemented');
  }

  async update(id: number, data: unknown): Promise<unknown> {
    // Этот метод не используется в UserService, но требуется интерфейсом
    throw new Error('Method not implemented');
  }

  async delete(id: number): Promise<void> {
    // Этот метод не используется в UserService, но требуется интерфейсом
    throw new Error('Method not implemented');
  }
}
