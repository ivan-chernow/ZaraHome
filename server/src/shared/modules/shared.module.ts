import { Module, Global } from '@nestjs/common';
import { ImageOptimizationService } from '../services/image-optimization.service';
import { ResponseService } from '../services/response.service';
import { FileUploadErrorHandlerService } from '../services/file-upload-error-handler.service';
import { UploadMonitoringService } from '../services/upload-monitoring.service';
import { ValidationService } from '../services/validation.service';
import { UtilityService } from '../services/utility.service';
import { MonitoringService } from '../services/monitoring.service';
import { RateLimitGuard } from '../guards/rate-limit.guard';

@Global()
@Module({
  providers: [
    // Существующие сервисы
    ImageOptimizationService,
    ResponseService,
    FileUploadErrorHandlerService,
    UploadMonitoringService,
    
    // Новые сервисы
    ValidationService,
    UtilityService,
    MonitoringService,
    
    // Guards
    RateLimitGuard,
  ],
  exports: [
    // Существующие сервисы
    ImageOptimizationService,
    ResponseService,
    FileUploadErrorHandlerService,
    UploadMonitoringService,
    
    // Новые сервисы
    ValidationService,
    UtilityService,
    MonitoringService,
    
    // Guards
    RateLimitGuard,
  ],
})
export class SharedModule {}
