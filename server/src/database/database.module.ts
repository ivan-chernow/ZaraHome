import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './seeds';
import { DatabaseService } from './database.service';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    providers: [DatabaseSeeder, DatabaseService],
    exports: [DatabaseSeeder, DatabaseService],
})
export class DatabaseModule {} 