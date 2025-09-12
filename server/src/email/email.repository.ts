import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EmailVerification } from './entity/email-verification.entity';

@Injectable()
export class EmailRepository {
  private readonly emailVerificationRepository: Repository<EmailVerification>;

  constructor(
    @InjectRepository(EmailVerification)
    emailVerificationRepository: Repository<EmailVerification>
  ) {
    this.emailVerificationRepository = emailVerificationRepository;
  }

  /**
   * Создать запись верификации email
   */
  async createVerification(
    email: string,
    code: string,
    token: string,
    expiresAt: Date
  ): Promise<EmailVerification> {
    const verification = this.emailVerificationRepository.create({
      email,
      code,
      token,
      expiresAt,
      isVerified: false,
    });

    return this.emailVerificationRepository.save(verification);
  }

  /**
   * Найти активную верификацию по email
   */
  async findActiveVerificationByEmail(
    email: string
  ): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findOne({
      where: {
        email,
        expiresAt: LessThan(new Date()),
        isVerified: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Найти верификацию по токену
   */
  async findVerificationByToken(
    token: string
  ): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findOne({
      where: { token },
    });
  }

  /**
   * Найти верификацию по коду
   */
  async findVerificationByCode(
    email: string,
    code: string
  ): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findOne({
      where: {
        email,
        code,
        isVerified: false,
      },
    });
  }

  /**
   * Отметить верификацию как подтвержденную
   */
  async markAsVerified(id: number): Promise<void> {
    await this.emailVerificationRepository.update(id, { isVerified: true });
  }

  /**
   * Удалить истекшие верификации
   */
  async deleteExpiredVerifications(): Promise<number> {
    const result = await this.emailVerificationRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    return result.affected || 0;
  }

  /**
   * Получить статистику верификаций
   */
  async getVerificationStats(): Promise<{
    total: number;
    verified: number;
    expired: number;
    pending: number;
  }> {
    const [total, verified, expired] = await Promise.all([
      this.emailVerificationRepository.count(),
      this.emailVerificationRepository.count({ where: { isVerified: true } }),
      this.emailVerificationRepository.count({
        where: { expiresAt: LessThan(new Date()) },
      }),
    ]);

    return {
      total,
      verified,
      expired,
      pending: total - verified - expired,
    };
  }

  /**
   * Удалить все верификации для email
   */
  async deleteAllForEmail(email: string): Promise<void> {
    await this.emailVerificationRepository.delete({ email });
  }

  /**
   * Проверить, есть ли активная верификация для email
   */
  async hasActiveVerification(email: string): Promise<boolean> {
    const count = await this.emailVerificationRepository.count({
      where: {
        email,
        expiresAt: LessThan(new Date()),
        isVerified: false,
      },
    });

    return count > 0;
  }
}
