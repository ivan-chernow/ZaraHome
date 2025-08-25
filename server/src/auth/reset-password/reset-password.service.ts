import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../../email/email.service';
import { ResetPassword } from './entity/reset-password.entity';
import { User } from 'src/users/user/entity/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private resetRepository: Repository<ResetPassword>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) { }

  async requestReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ 
      where: { 
        email,
        isEmailVerified: true
      } 
    });

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден или email не верифицирован');
    }

    // Проверяем последний запрос на сброс
    const lastReset = await this.resetRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' }
    });

    if (lastReset) {
      const timeSinceLastAttempt = Date.now() - lastReset.createdAt.getTime();
      const minutesSinceLastAttempt = timeSinceLastAttempt / (1000 * 60);

      if (minutesSinceLastAttempt < 15) {
        throw new BadRequestException(
          `Пожалуйста, подождите ${Math.ceil(15 - minutesSinceLastAttempt)} минут перед следующей попыткой`
        );
      }
    }

    // Удаляем старые запросы на сброс
    await this.resetRepository.delete({ email });

    // Создаем новый запрос на сброс
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
    const createdAt = new Date();
    await this.resetRepository.save({ email, token, expiresAt, createdAt });
    
    // Отправляем email
    await this.emailService.sendResetPasswordEmail(email, token);
  }

  async verifyCode(email: string, token: string): Promise<string> {
    const reset = await this.resetRepository.findOne({ where: { email, token } });
    if (!reset || reset.expiresAt < new Date()) {
      throw new BadRequestException('Неверный или просроченный код');
    }
    reset.isVerified = true;
    await this.resetRepository.save(reset);
    return reset.token;
  }

  async setNewPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    const reset = await this.resetRepository.findOne({ where: { token, isVerified: true } });
    if (!reset) throw new BadRequestException('Недействительный токен');
    
    const user = await this.userRepository.findOne({ where: { email: reset.email } });
    if (!user) throw new BadRequestException('Пользователь не найден');
    
    user.password = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);
    await this.resetRepository.remove(reset);
    
    return { success: true, message: 'Пароль успешно изменен' };
  }
}
