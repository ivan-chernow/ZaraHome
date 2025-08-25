import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user/entity/user.entity';
import { RefreshToken } from './login/entity/refresh-token.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      select: ['id', 'email', 'password', 'isEmailVerified', 'role']
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findRefreshTokenByUser(userId: number): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({ 
      where: { user: { id: userId } } 
    });
  }

  async findRefreshTokenByToken(token: string, userId: number): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({ 
      where: { token, user: { id: userId } } 
    });
  }

  async deleteRefreshTokenByUser(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  async deleteRefreshTokenByToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async saveRefreshToken(token: string, user: User, expiresAt: Date): Promise<RefreshToken> {
    return this.refreshTokenRepository.save({ token, user, expiresAt });
  }
}
