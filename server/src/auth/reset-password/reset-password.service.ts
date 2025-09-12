import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../../email/email.service';
import { ResetPassword } from './entity/reset-password.entity';
import { User } from '../../users/user/entity/user.entity';

@Injectable()
export class ResetPasswordService {
  private readonly resetRepository: Repository<ResetPassword>;
  private readonly userRepository: Repository<User>;
  private readonly emailService: EmailService;

  constructor(
    @InjectRepository(ResetPassword) resetRepository: Repository<ResetPassword>,
    @InjectRepository(User) userRepository: Repository<User>,
    emailService: EmailService
  ) {
    this.resetRepository = resetRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private calculateExpirationTime(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private async checkUserExists(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Пользователь с таким email не найден или email не верифицирован'
      );
    }

    return user;
  }

  private async checkRateLimit(email: string): Promise<void> {
    const lastReset = await this.resetRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });

    if (lastReset) {
      const timeSinceLastAttempt = Date.now() - lastReset.createdAt.getTime();
      const minutesSinceLastAttempt = timeSinceLastAttempt / (1000 * 60);

      if (minutesSinceLastAttempt < 15) {
        const remainingMinutes = Math.ceil(15 - minutesSinceLastAttempt);
        throw new BadRequestException(
          `Пожалуйста, подождите ${remainingMinutes} минут перед следующей попыткой`
        );
      }
    }
  }

  async requestReset(email: string): Promise<void> {
    await this.checkUserExists(email);
    await this.checkRateLimit(email);

    await this.resetRepository.delete({ email });

    const token = this.generateResetToken();
    const expiresAt = this.calculateExpirationTime(15);
    const createdAt = new Date();

    await this.resetRepository.save({
      email,
      token,
      expiresAt,
      createdAt,
    });

    await this.emailService.sendResetPasswordEmail(email, token);
  }

  async verifyCode(token: string): Promise<string> {
    const reset = await this.resetRepository.findOne({
      where: { token },
    });

    if (!reset || reset.expiresAt < new Date()) {
      throw new BadRequestException('Неверный или просроченный код');
    }

    reset.isVerified = true;
    await this.resetRepository.save(reset);

    return reset.token;
  }

  async setNewPassword(
    token: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    const reset = await this.resetRepository.findOne({
      where: { token, isVerified: true },
    });

    if (!reset) {
      throw new BadRequestException('Недействительный токен');
    }

    const user = await this.userRepository.findOne({
      where: { email: reset.email },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
    await this.resetRepository.remove(reset);

    return {
      success: true,
      message: 'Пароль успешно изменен',
    };
  }
}
