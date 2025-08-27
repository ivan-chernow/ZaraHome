import { Module } from '@nestjs/common';
import { ImageOptimizationService } from '../services/image-optimization.service';
import { ResponseService } from '../services/response.service';
import { FileUploadErrorHandlerService } from '../services/file-upload-error-handler.service';

@Module({
  providers: [ImageOptimizationService, ResponseService, FileUploadErrorHandlerService],
  exports: [ImageOptimizationService, ResponseService, FileUploadErrorHandlerService],
})
export class SharedModule {}
