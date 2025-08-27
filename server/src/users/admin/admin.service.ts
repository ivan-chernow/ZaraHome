import { Injectable, NotFoundException, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { ProductsService } from 'src/products/products.service';
import { ConfigService } from '@nestjs/config';
import { ImageOptimizationService } from 'src/shared/services/image-optimization.service';
import { IAdminService } from 'src/common/interfaces/service.interface';
import { validateUploadedFiles } from 'src/shared/upload/file-upload.helper';

@Injectable()
export class AdminService implements OnModuleInit, IAdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly productsService: ProductsService,
        private readonly config: ConfigService,
        private readonly imageOptimizationService: ImageOptimizationService,
    ) { }

    async onModuleInit() {
        const adminEmail = this.config.get<string>('ADMIN_EMAIL');
        const adminPassword = this.config.get<string>('ADMIN_PASSWORD');

        if (!adminEmail || !adminPassword) {
            return;
        }

        let admin = await this.userRepository.findOne({
            where: { email: adminEmail }
        });

        if (!admin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = this.userRepository.create({
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
                isEmailVerified: true
            });
            await this.userRepository.save(admin);
            this.logger.log(`Администратор создан: ${adminEmail}`);
        } else {
            this.logger.log(`Администратор уже существует: ${adminEmail}`);
        }
    }

    async addProduct(files: Express.Multer.File[], productData: CreateProductDto) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Необходимо загрузить хотя бы одно изображение');
        }

        // Валидируем загруженные файлы
        validateUploadedFiles(files, {
            maxCount: 12,
            maxSizeMB: 10,
            allowedExt: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            allowedMime: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        });

        try {
            // Обрабатываем изображения с улучшенными настройками
            const imagePaths = await this.imageOptimizationService.processMany(files, {
                quality: 80,
                maxWidth: 1600,
                maxHeight: 1600,
                format: 'webp',
                generateThumbnail: true,
                thumbnailSize: 300
            });
            
            // Создаем данные продукта с путями к изображениям
            const productWithImages: CreateProductDto = {
                ...productData,
                img: imagePaths
            };
            
            // Используем сервис продуктов для создания продукта
            const product = await this.productsService.createProduct(productWithImages);
            
            this.logger.log(`Product created successfully: ${product.id} with ${imagePaths.length} images`);
            
            return product;
        } catch (error) {
            this.logger.error(`Failed to create product: ${error.message}`);
            throw error;
        }
    }
} 