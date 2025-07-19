import { Injectable, NotFoundException, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/entity/user.entity';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class AdminService implements OnModuleInit {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly productsService: ProductsService
    ) { }

    async onModuleInit() {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

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
            throw new BadRequestException('No files uploaded');
        }

        // Process uploaded files and get their paths
        const imagePaths = files.map(file => `/uploads/products/${file.filename}`);
        
        // Create product data with image paths
        const productWithImages: CreateProductDto = {
            ...productData,
            img: imagePaths
        };
        
        // Use the products service to create the product
        return this.productsService.createProduct(productWithImages);
    }
} 