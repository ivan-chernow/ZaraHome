import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../shared.interfaces';
import { CacheService } from './cache.service';

@ApiTags('cache')
@Controller('cache')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CacheController {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Проверить состояние кеша' })
  @ApiOkResponse({ description: 'Статус кеша получен' })
  async getHealth() {
    const isHealthy = await this.cacheService.isHealthy();
    return {
      success: true,
      data: { isHealthy },
      message: isHealthy ? 'Кеш работает нормально' : 'Проблемы с кешем'
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику кеша' })
  @ApiOkResponse({ description: 'Статистика кеша получена' })
  async getStats() {
    const stats = await this.cacheService.getStats();
    return {
      success: true,
      data: stats,
      message: 'Статистика кеша получена'
    };
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Очистить весь кеш' })
  @ApiOkResponse({ description: 'Кеш очищен' })
  async clearCache() {
    await this.cacheService.clear();
    return {
      success: true,
      data: null,
      message: 'Весь кеш очищен'
    };
  }

  @Delete('products')
  @ApiOperation({ summary: 'Очистить кеш продуктов' })
  @ApiOkResponse({ description: 'Кеш продуктов очищен' })
  async clearProductsCache() {
    await this.cacheService.deleteByPrefix('products');
    return {
      success: true,
      data: null,
      message: 'Кеш продуктов очищен'
    };
  }

  @Delete('categories')
  @ApiOperation({ summary: 'Очистить кеш категорий' })
  @ApiOkResponse({ description: 'Кеш категорий очищен' })
  async clearCategoriesCache() {
    await this.cacheService.deleteByPrefix('categories');
    return {
      success: true,
      data: null,
      message: 'Кеш категорий очищен'
    };
  }

  @Delete('cart')
  @ApiOperation({ summary: 'Очистить кеш корзин' })
  @ApiOkResponse({ description: 'Кеш корзин очищен' })
  async clearCartCache() {
    await this.cacheService.deleteByPrefix('cart');
    return {
      success: true,
      data: null,
      message: 'Кеш корзин очищен'
    };
  }

  @Delete('favorites')
  @ApiOperation({ summary: 'Очистить кеш избранного' })
  @ApiOkResponse({ description: 'Кеш избранного очищен' })
  async clearFavoritesCache() {
    await this.cacheService.deleteByPrefix('favorites');
    return {
      success: true,
      data: null,
      message: 'Кеш избранного очищен'
    };
  }

  @Delete('promocodes')
  @ApiOperation({ summary: 'Очистить кеш промокодов' })
  @ApiOkResponse({ description: 'Кеш промокодов очищен' })
  async clearPromocodesCache() {
    await this.cacheService.deleteByPrefix('promocodes');
    return {
      success: true,
      data: null,
      message: 'Кеш промокодов очищен'
    };
  }
}
