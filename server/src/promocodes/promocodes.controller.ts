import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { UserRole } from 'src/users/user/entity/user.entity';

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) { }

  // Создание промокода (только для админа)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPromocode(
    @Body() createPromocodeDto: { code: string; discount: number }
  ) {
    return await this.promocodesService.create(
      createPromocodeDto.code,
      createPromocodeDto.discount
    );
  }
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deactivatePromocode(@Param('code') code: string) {
    await this.promocodesService.deactivate(code);
    return { message: 'Промокод успешно деактивирован' };
  }

  // Применение промокода
  @Post('apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async applyPromocode(
    @Body() applyPromocodeDto: { code: string; orderAmount: number }
  ) {
    return await this.promocodesService.validateAndApply(
      applyPromocodeDto.code,
      applyPromocodeDto.orderAmount
    );
  }



  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllActive() {
    return await this.promocodesService.getAllActive();
  }

  // Деактивация промокода (только для админа)

} 