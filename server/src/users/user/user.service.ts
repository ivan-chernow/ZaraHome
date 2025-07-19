import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { DeliveryAddress } from './entity/delivery-address.entity';
import { ChangePasswordDto, ProfileDto } from './dto/user.dto';
import { ChangeDeliveryAddressDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DeliveryAddress)
    private addressRepository: Repository<DeliveryAddress>,
  ) { }

  async getProfile(userId: number): Promise<ProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'isEmailVerified'],
      relations: ['deliveryAddresses']
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['password', 'updatedAt']
    });

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
    await this.userRepository.update(userId, {
      password: hashedPassword
    });

    return { message: 'Пароль успешно изменен' };
  }

  async changeEmail(userId: number, currentEmail: string, newEmail: string) {
    const currentEmailUser = await this.userRepository.findOne({
      where: { email: currentEmail },
      select: ['id', 'updatedAt']
    });

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

    await this.userRepository.update(userId, {
      email: newEmail,
      isEmailVerified: true // Сбрасываем верификацию при смене email
    });

    return { message: 'Email успешно изменен' };
  }

  async changeDeliveryAddress(userId: number, addressData: ChangeDeliveryAddressDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['deliveryAddresses']
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Если у пользователя уже есть адрес, обновляем его
    if (user.deliveryAddresses?.length > 0) {
      const existingAddress = user.deliveryAddresses[0];
      await this.addressRepository.update(existingAddress.id, addressData);
      return { message: 'Адрес доставки обновлен' };
    }

    // Если адреса нет, создаем новый
    const deliveryAddress = this.addressRepository.create({
      ...addressData,
      user
    });

    await this.addressRepository.save(deliveryAddress);
    return { message: 'Адрес доставки добавлен' };
  }

  async getDeliveryAddresses(userId: number): Promise<DeliveryAddress[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['deliveryAddresses']
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.deliveryAddresses;
  }

  async addDeliveryAddress(userId: number, addressData: ChangeDeliveryAddressDto): Promise<DeliveryAddress> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const deliveryAddress = this.addressRepository.create({
      ...addressData,
      user
    });

    return this.addressRepository.save(deliveryAddress);
  }

  async updateDeliveryAddress(userId: number, addressId: number, addressData: ChangeDeliveryAddressDto): Promise<DeliveryAddress> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['user']
    });

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    if (address.user.id !== userId) {
      throw new BadRequestException('У вас нет прав на изменение этого адреса');
    }

    Object.assign(address, addressData);
    return this.addressRepository.save(address);
  }
}
