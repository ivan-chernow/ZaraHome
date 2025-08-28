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
        private userRepository: Repository<User>,
        @InjectRepository(EmailVerification)
        private verificationRepository: Repository<EmailVerification>,
        private emailService: EmailService,
    ) { }

    private generateSixDigitCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async initiateRegistration(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email, isEmailVerified: true } });
        if (existingUser ) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }
        

        const lastVerification = await this.verificationRepository.findOne({
            where: { email },
            order: { createdAt: 'DESC' }
        });

        if (lastVerification) {
            const timeSinceLastAttempt = Date.now() - lastVerification.createdAt.getTime();
            const minutesSinceLastAttempt = timeSinceLastAttempt / (1000 * 60);

            if (minutesSinceLastAttempt < 5) {
                throw new BadRequestException(
                    `Пожалуйста, подождите ${Math.ceil(5 - minutesSinceLastAttempt)} минут перед следующей попыткой`
                );
            }
        }

        await this.verificationRepository.delete({ email });
        const code = this.generateSixDigitCode();
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const createdAt = new Date();
        await this.verificationRepository.save({ email, code, token, expiresAt, createdAt });
        await this.emailService.sendVerificationCodeEmail(email, code);
    }

    async verifyByCode(email: string, code: string): Promise<string> {
        const verification = await this.verificationRepository.findOne({ where: { email, code } });
        if (!verification || verification.expiresAt < new Date()) {
            throw new BadRequestException('Неверный или просроченный код');
        }

        verification.isVerified = true;
        await this.verificationRepository.save(verification);
        return verification.token;
    }

    async completeRegistration(sessionToken: string, password: string): Promise<User> {
        const verification = await this.verificationRepository.findOne({ where: { token: sessionToken, isVerified: true } });
        if (!verification) {
            throw new BadRequestException('Неверный или просроченный токен сессии');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await this.userRepository.findOne({ where: { email: verification.email } });
        if (!user) {
            user = this.userRepository.create({
                email: verification.email,
                password: hashedPassword,
                isEmailVerified: true,
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
