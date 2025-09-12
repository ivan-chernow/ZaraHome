import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user/entity/user.entity';
import { RefreshToken } from './login/entity/refresh-token.entity';

@Injectable()
export class AuthRepository {
  private readonly userRepository: Repository<User>;
  private readonly refreshTokenRepository: Repository<RefreshToken>;

  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    refreshTokenRepository: Repository<RefreshToken>
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();

    return this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: ['id', 'email', 'password', 'isEmailVerified', 'role'],
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async findRefreshTokenByUser(userId: number): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async findRefreshTokenByToken(
    token: string,
    userId: number
  ): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token, user: { id: userId } },
    });
  }

  async deleteRefreshTokenByUser(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({
      user: { id: userId },
    });
  }

  async deleteRefreshTokenByToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async saveRefreshToken(
    token: string,
    user: User,
    expiresAt: Date
  ): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      token,
      user,
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async isUserExists(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    const count = await this.userRepository.count({
      where: { email: normalizedEmail },
    });

    return count > 0;
  }
}
