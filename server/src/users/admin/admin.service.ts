import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { UserRole } from '../../shared/shared.interfaces';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { ProductsService } from '../../products/products.service';
import { ConfigService } from '@nestjs/config';
import { ImageOptimizationService } from '../../shared/services/image-optimization.service';
// import { IAdminService } from '../../shared/shared.interfaces';
import { FileUploadErrorHandlerService } from '../../shared/services/file-upload-error-handler.service';
import { UploadMonitoringService } from '../../shared/services/upload-monitoring.service';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);
  private userRepository: Repository<User>;
  private readonly productsService: ProductsService;
  private readonly config: ConfigService;
  private readonly imageOptimizationService: ImageOptimizationService;
  private readonly errorHandlerService: FileUploadErrorHandlerService;
  private readonly uploadMonitoringService: UploadMonitoringService;

  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    productsService: ProductsService,
    config: ConfigService,
    imageOptimizationService: ImageOptimizationService,
    errorHandlerService: FileUploadErrorHandlerService,
    uploadMonitoringService: UploadMonitoringService
  ) {
    this.userRepository = userRepository;
    this.productsService = productsService;
    this.config = config;
    this.imageOptimizationService = imageOptimizationService;
    this.errorHandlerService = errorHandlerService;
    this.uploadMonitoringService = uploadMonitoringService;
  }

  async onModuleInit() {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      return;
    }

    let admin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isEmailVerified: true,
      });
      await this.userRepository.save(admin);
      this.logger.log(`Администратор создан: ${adminEmail}`);
    } else {
      this.logger.log(`Администратор уже существует: ${adminEmail}`);
    }
  }

  async addProduct(
    files: Express.Multer.File[],
    productData: CreateProductDto
  ) {
    const startTime = Date.now();
    this.logger.log(
      `Начинаем создание продукта с ${files?.length || 0} файлами`
    );

    if (!files || files.length === 0) {
      this.logger.warn('Попытка создать продукт без изображений');
      throw new BadRequestException(
        'Необходимо загрузить хотя бы одно изображение'
      );
    }

    // Валидируем загруженные файлы с graceful fallback
    this.logger.log('Начинаем валидацию загруженных файлов');
    const validationResults = await Promise.all(
      files.map(async file => {
        try {
          return await this.errorHandlerService.validateFileWithFallback(file);
        } catch (error) {
          this.logger.error(
            `Ошибка валидации файла ${file.originalname}:`,
            error.message
          );
          return { valid: false, error: error.message };
        }
      })
    );

    const invalidFiles = validationResults.filter(result => !result.valid);
    if (invalidFiles.length > 0) {
      this.logger.warn(
        `Найдены некорректные файлы: ${invalidFiles.map(f => f.error).join(', ')}`
      );
    }

    // Фильтруем только валидные файлы
    const validFiles = files.filter(
      (_, index) => validationResults[index].valid
    );
    this.logger.log(`Валидных файлов: ${validFiles.length} из ${files.length}`);

    if (validFiles.length === 0) {
      this.logger.error('Нет валидных файлов для загрузки');
      throw new BadRequestException('Нет валидных файлов для загрузки');
    }

    try {
      this.logger.log('Начинаем обработку изображений с retry механизмом');

      // Обрабатываем изображения с обработкой ошибок, graceful fallback и retry
      const uploadResult =
        await this.errorHandlerService.handleUploadWithRollback(
          validFiles,
          async file => {
            // Используем retry механизм для обработки изображений
            const retryResult = await this.errorHandlerService.processWithRetry(
              file,
              async fileToProcess => {
                try {
                  const result =
                    await this.imageOptimizationService.processAndSave(
                      fileToProcess.buffer,
                      fileToProcess.originalname,
                      {
                        quality: 80,
                        width: 1600,
                        height: 1600,
                        format: 'webp',
                        generateThumbnail: true,
                        thumbnailSize: 300,
                      }
                    );
                  return result.mainPath;
                } catch (error) {
                  this.logger.error(
                    `Ошибка обработки изображения ${fileToProcess.originalname}:`,
                    error.message
                  );
                  throw error;
                }
              },
              3 // 3 попытки для каждого файла
            );

            if (!retryResult.success) {
              throw new Error(retryResult.error);
            }

            return retryResult.filePath!;
          },
          0.7 // 70% файлов должны быть успешно обработаны
        );

      if (!uploadResult.success) {
        this.logger.error(`Критическая ошибка загрузки: ${uploadResult.error}`);
        throw new BadRequestException(uploadResult.error);
      }

      // Получаем успешно загруженные файлы
      const successfulUploads = uploadResult.results.filter(r => r.success);
      const imagePaths = successfulUploads.map(r => r.filePath!);

      if (imagePaths.length === 0) {
        this.logger.error('Не удалось загрузить ни одного изображения');
        throw new BadRequestException(
          'Не удалось загрузить ни одного изображения'
        );
      }

      this.logger.log(
        `Успешно обработано ${imagePaths.length} изображений, создаем продукт`
      );

      // Создаем данные продукта с путями к изображениям
      const productWithImages: CreateProductDto = {
        ...productData,
        img: imagePaths,
      };

      // Используем сервис продуктов для создания продукта
      const product =
        await this.productsService.createProduct(productWithImages);

      // Логируем детальную статистику
      const stats = this.errorHandlerService.getUploadStatistics(
        uploadResult.results
      );
      this.logger.log(
        `✅ Продукт успешно создан: ID ${product.id} с ${imagePaths.length} изображениями`
      );
      this.logger.log(
        `📊 Статистика загрузки: ${stats.successful}/${stats.total} файлов обработано успешно (${Math.round(stats.successRate * 100)}%)`
      );

      if (stats.failed > 0) {
        this.logger.warn(`⚠️ Неудачные загрузки: ${stats.errors.join(', ')}`);
      }

      // Записываем результаты в систему мониторинга
      const uploadTime = Date.now() - startTime;
      this.uploadMonitoringService.recordUploadResults(
        uploadResult.results,
        uploadTime
      );

      // Проверяем предупреждения системы
      const warnings = this.uploadMonitoringService.getWarnings();
      if (warnings.length > 0) {
        this.logger.warn(`Системные предупреждения: ${warnings.join('; ')}`);
      }

      return product;
    } catch (error) {
      this.logger.error(
        `❌ Критическая ошибка при создании продукта:`,
        error.message
      );

      // Логируем детали ошибки для отладки
      if (error instanceof Error) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }

      // Перебрасываем ошибку с дополнительным контекстом
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Ошибка при создании продукта: ${error.message}. Обратитесь к администратору.`
      );
    }
  }

  /**
   * Получаем статистику загрузок для мониторинга
   */
  getUploadStatistics() {
    return this.uploadMonitoringService.exportMetrics();
  }

  /**
   * Получаем предупреждения системы
   */
  getSystemWarnings() {
    return this.uploadMonitoringService.getWarnings();
  }

  /**
   * Очищаем историю загрузок
   */
  clearUploadHistory() {
    this.uploadMonitoringService.clearHistory();
    this.logger.log('История загрузок очищена администратором');
  }
}
