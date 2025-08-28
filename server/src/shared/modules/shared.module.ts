import { Module } from '@nestjs/common';
import { ImageOptimizationService } from '../services/image-optimization.service';
import { ResponseService } from '../services/response.service';
import { FileUploadErrorHandlerService } from '../services/file-upload-error-handler.service';
import { UploadMonitoringService } from '../services/upload-monitoring.service';

@Module({
  providers: [ImageOptimizationService, ResponseService, FileUploadErrorHandlerService, UploadMonitoringService],
  exports: [ImageOptimizationService, ResponseService, FileUploadErrorHandlerService, UploadMonitoringService],
})
export class SharedModule {}
