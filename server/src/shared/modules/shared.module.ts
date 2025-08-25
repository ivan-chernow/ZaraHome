import { Module } from '@nestjs/common';
import { ImageOptimizationService } from '../services/image-optimization.service';
import { ResponseService } from '../services/response.service';

@Module({
  providers: [ImageOptimizationService, ResponseService],
  exports: [ImageOptimizationService, ResponseService],
})
export class SharedModule {}
