import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DatabaseSeeder } from './seeds';
import { Category } from '../products/entity/category.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        try {
            // Проверяем, есть ли уже данные в базе
            const categoryRepository = this.dataSource.getRepository(Category);
            const existingCategories = await categoryRepository.find();
            
            // Если категорий нет, запускаем сиды
            if (existingCategories.length === 0) {
                const seeder = new DatabaseSeeder(this.dataSource);
                await seeder.run();
                console.log('Database seeded successfully');
            } else {
                console.log('Database already contains data, skipping seeding');
            }
        } catch (error) {
            console.error('Error during database initialization:', error);
            throw error;
        }
    }
} 