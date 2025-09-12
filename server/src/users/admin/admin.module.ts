import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entity/user.entity';
import { ProductsModule } from '../../products/products.module';
import { ImageOptimizationService } from '../../shared/services/image-optimization.service';
import { FileUploadErrorHandlerService } from '../../shared/services/file-upload-error-handler.service';
import { UploadMonitoringService } from '../../shared/services/upload-monitoring.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProductsModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    ImageOptimizationService,
    FileUploadErrorHandlerService,
    UploadMonitoringService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
