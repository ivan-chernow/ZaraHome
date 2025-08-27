import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { ResponseService } from 'src/shared/services/response.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreatePromocodeDto, ValidatePromocodeDto } from './dto';
import { PromocodeCodeDto } from './dto/promocode-code.dto';

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
    const promocode = await this.promocodesService.create(
      createPromocodeDto.code,
      createPromocodeDto.discount
    );
    return this.responseService.success(promocode, 'Промокод успешно создан');
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deactivatePromocode(@Param() params: PromocodeCodeDto) {
    await this.promocodesService.deactivate(params.code);
    return this.responseService.success(undefined, 'Промокод успешно деактивирован');
  }

  // Применение промокода (доступно всем пользователям)
  @Post('apply')
  async applyPromocode(@Body() applyPromocodeDto: ValidatePromocodeDto) {
    const result = await this.promocodesService.validateAndApply(
      applyPromocodeDto.code,
      applyPromocodeDto.orderAmount
    );
    return this.responseService.success(result, 'Промокод успешно применен');
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllActive() {
    const promocodes = await this.promocodesService.getAll();
    return this.responseService.success(promocodes, 'Активные промокоды загружены');
  }
} 