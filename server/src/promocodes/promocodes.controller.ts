import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { ResponseService } from 'src/shared/services/response.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreatePromocodeDto, ValidatePromocodeDto } from './dto';

@Controller('promocodes')
export class PromocodesController {
  constructor(
    private readonly promocodesService: PromocodesService,
    private readonly responseService: ResponseService,
  ) { }

  // Создание промокода (только для админа)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPromocode(@Body() createPromocodeDto: CreatePromocodeDto) {
    try {
      const promocode = await this.promocodesService.create(
        createPromocodeDto.code,
        createPromocodeDto.discount
      );
      return this.responseService.success(promocode, 'Промокод успешно создан');
    } catch (error) {
      return this.responseService.error('Ошибка при создании промокода', error.message);
    }
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deactivatePromocode(@Param('code') code: string) {
    try {
      await this.promocodesService.deactivate(code);
      return this.responseService.success(undefined, 'Промокод успешно деактивирован');
    } catch (error) {
      return this.responseService.error('Ошибка при деактивации промокода', error.message);
    }
  }

  // Применение промокода (доступно всем пользователям)
  @Post('apply')
  async applyPromocode(@Body() applyPromocodeDto: ValidatePromocodeDto) {
    try {
      const result = await this.promocodesService.validateAndApply(
        applyPromocodeDto.code,
        applyPromocodeDto.orderAmount
      );
      return this.responseService.success(result, 'Промокод успешно применен');
    } catch (error) {
      return this.responseService.error('Ошибка при применении промокода', error.message);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllActive() {
    try {
      const promocodes = await this.promocodesService.getAll();
      return this.responseService.success(promocodes, 'Активные промокоды загружены');
    } catch (error) {
      return this.responseService.error('Ошибка при загрузке промокодов', error.message);
    }
  }
} 