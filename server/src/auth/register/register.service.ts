import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../../email/email.service';
import { EmailVerification } from 'src/email/entity/email-verification.entity';
import { User } from '../../users/user/entity/user.entity';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly verificationRepository: Repository<EmailVerification>,
    private readonly emailService: EmailService,
  ) {}

  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private calculateExpirationTime(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private async checkExistingUser(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ 
      where: { email, isEmailVerified: true } 
    });
    
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
  }

  private async checkRateLimit(email: string): Promise<void> {
    const lastVerification = await this.verificationRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' }
    });

    if (lastVerification) {
      const timeSinceLastAttempt = Date.now() - lastVerification.createdAt.getTime();
      const minutesSinceLastAttempt = timeSinceLastAttempt / (1000 * 60);

      if (minutesSinceLastAttempt < 5) {
        const remainingMinutes = Math.ceil(5 - minutesSinceLastAttempt);
        throw new BadRequestException(
          `Пожалуйста, подождите ${remainingMinutes} минут перед следующей попыткой`
        );
      }
    }
  }

  async initiateRegistration(email: string): Promise<void> {
    await this.checkExistingUser(email);
    await this.checkRateLimit(email);

    await this.verificationRepository.delete({ email });
    
    const code = this.generateSixDigitCode();
    const token = this.generateSessionToken();
    const expiresAt = this.calculateExpirationTime(5);
    const createdAt = new Date();
    
    await this.verificationRepository.save({ 
      email, 
      code, 
      token, 
      expiresAt, 
      createdAt 
    });
    
    await this.emailService.sendVerificationCodeEmail(email, code);
  }

  async verifyByCode(email: string, code: string): Promise<string> {
    const verification = await this.verificationRepository.findOne({ 
      where: { email, code } 
    });
    
    if (!verification || verification.expiresAt < new Date()) {
      throw new BadRequestException('Неверный или просроченный код');
    }

    verification.isVerified = true;
    await this.verificationRepository.save(verification);
    
    return verification.token;
  }

  async completeRegistration(sessionToken: string, password: string): Promise<User> {
    const verification = await this.verificationRepository.findOne({ 
      where: { token: sessionToken, isVerified: true } 
    });
    
    if (!verification) {
      throw new BadRequestException('Неверный или просроченный токен сессии');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let user = await this.userRepository.findOne({ 
      where: { email: verification.email } 
    });
    
    if (!user) {
      user = this.userRepository.create({
        email: verification.email,
        password: hashedPassword,
        isEmailVerified: true,
        role: 'user',
      });
    } else {
      user.password = hashedPassword;
      user.isEmailVerified = true;
    }
    
    await this.userRepository.save(user);
    await this.verificationRepository.remove(verification);
    await this.emailService.sendWelcomeUser(user.email);
    
    return user;
  }
}
