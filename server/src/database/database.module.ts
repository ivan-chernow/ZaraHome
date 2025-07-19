import { Module } from '@nestjs/common';
import { DatabaseSeeder } from './seeds';
import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseSeeder, DatabaseService],
    exports: [DatabaseSeeder, DatabaseService],
})
export class DatabaseModule {} 