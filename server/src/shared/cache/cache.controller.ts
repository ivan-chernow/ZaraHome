import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CacheService } from './cache.service';
import { ResponseService } from '../services/response.service';

@ApiTags('cache')
@Controller('cache')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CacheController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly responseService: ResponseService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Проверить состояние кеша' })
  @ApiOkResponse({ description: 'Статус кеша получен' })
  async getHealth() {
    const isHealthy = await this.cacheService.isHealthy();
    return this.responseService.success(
      { isHealthy },
      isHealthy ? 'Кеш работает нормально' : 'Проблемы с кешем'
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику кеша' })
  @ApiOkResponse({ description: 'Статистика кеша получена' })
  async getStats() {
    const stats = await this.cacheService.getStats();
    return this.responseService.success(stats, 'Статистика кеша получена');
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Очистить весь кеш' })
  @ApiOkResponse({ description: 'Кеш очищен' })
  async clearCache() {
    await this.cacheService.clear();
    return this.responseService.success(null, 'Весь кеш очищен');
  }

  @Delete('products')
  @ApiOperation({ summary: 'Очистить кеш продуктов' })
  @ApiOkResponse({ description: 'Кеш продуктов очищен' })
  async clearProductsCache() {
    await this.cacheService.deleteByPrefix('products');
    return this.responseService.success(null, 'Кеш продуктов очищен');
  }

  @Delete('categories')
  @ApiOperation({ summary: 'Очистить кеш категорий' })
  @ApiOkResponse({ description: 'Кеш категорий очищен' })
  async clearCategoriesCache() {
    await this.cacheService.deleteByPrefix('categories');
    return this.responseService.success(null, 'Кеш категорий очищен');
  }

  @Delete('cart')
  @ApiOperation({ summary: 'Очистить кеш корзин' })
  @ApiOkResponse({ description: 'Кеш корзин очищен' })
  async clearCartCache() {
    await this.cacheService.deleteByPrefix('cart');
    return this.responseService.success(null, 'Кеш корзин очищен');
  }

  @Delete('favorites')
  @ApiOperation({ summary: 'Очистить кеш избранного' })
  @ApiOkResponse({ description: 'Кеш избранного очищен' })
  async clearFavoritesCache() {
    await this.cacheService.deleteByPrefix('favorites');
    return this.responseService.success(null, 'Кеш избранного очищен');
  }

  @Delete('promocodes')
  @ApiOperation({ summary: 'Очистить кеш промокодов' })
  @ApiOkResponse({ description: 'Кеш промокодов очищен' })
  async clearPromocodesCache() {
    await this.cacheService.deleteByPrefix('promocodes');
    return this.responseService.success(null, 'Кеш промокодов очищен');
  }
}
