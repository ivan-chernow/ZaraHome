import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { DeliveryAddress } from './entity/delivery-address.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DeliveryAddress)
    private addressRepository: Repository<DeliveryAddress>,
  ) {}

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'isEmailVerified'],
      relations: ['deliveryAddresses']
    });
  }

  async findUserByIdWithPassword(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password', 'updatedAt']
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'updatedAt']
    });
  }

  async findUserByIdWithAddresses(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['deliveryAddresses']
    });
  }

  async findUserByIdBasic(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId }
    });
  }

  async findAddressById(addressId: number): Promise<DeliveryAddress | null> {
    return this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['user']
    });
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword
    });
  }

  async updateUserEmail(userId: number, newEmail: string): Promise<void> {
    await this.userRepository.update(userId, {
      email: newEmail,
      isEmailVerified: true
    });
  }

  async updateAddress(addressId: number, addressData: any): Promise<void> {
    await this.addressRepository.update(addressId, addressData);
  }

  async createAddress(addressData: any): Promise<DeliveryAddress> {
    const deliveryAddress = this.addressRepository.create(addressData);
    return this.addressRepository.save(deliveryAddress);
  }

  async removeAddress(address: DeliveryAddress): Promise<void> {
    await this.addressRepository.remove(address);
  }
}
