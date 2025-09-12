import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { ResponseService } from 'src/shared/services/response.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/login/jwt/jwt-auth.guard';
import { UserRole } from 'src/shared/shared.interfaces';
import {
  CreatePromocodeDto,
  ValidatePromocodeDto,
  UpdatePromocodeDto,
} from './dto';
import { PromocodeCodeDto } from './dto/promocode-code.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PROMOCODES_CONSTANTS } from './promocodes.constants';

@ApiTags('promocodes')
@Controller('promocodes')
export class PromocodesController {
  private readonly promocodesService: PromocodesService;
  private readonly responseService: ResponseService;

  constructor(
    promocodesService: PromocodesService,
    responseService: ResponseService
  ) {
    this.promocodesService = promocodesService;
    this.responseService = responseService;
  }

  // Создание промокода (только для админа)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать промокод' })
  @ApiOkResponse({ description: 'Промокод успешно создан' })
  async createPromocode(@Body() createPromocodeDto: CreatePromocodeDto) {
    const promocode = await this.promocodesService.create(
      createPromocodeDto.code,
      createPromocodeDto.discount,
      {
        maxUsage: createPromocodeDto.maxUsage,
        minOrderAmount: createPromocodeDto.minOrderAmount,
        expiresAt: createPromocodeDto.expiresAt
          ? new Date(createPromocodeDto.expiresAt)
          : undefined,
        description: createPromocodeDto.description,
      }
    );
    return this.responseService.success(
      promocode,
      PROMOCODES_CONSTANTS.SUCCESS.PROMOCODE_CREATED
    );
  }

  // Обновление промокода (только для админа)
  @Put(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить промокод' })
  @ApiOkResponse({ description: 'Промокод успешно обновлен' })
  @ApiParam({ name: 'code', description: 'Код промокода' })
  async updatePromocode(
    @Param() params: PromocodeCodeDto,
    @Body() updatePromocodeDto: UpdatePromocodeDto
  ) {
    const updateData = {
      ...updatePromocodeDto,
      expiresAt: updatePromocodeDto.expiresAt
        ? new Date(updatePromocodeDto.expiresAt)
        : undefined,
    };
    const promocode = await this.promocodesService.update(
      params.code,
      updateData
    );
    return this.responseService.success(
      promocode,
      PROMOCODES_CONSTANTS.SUCCESS.PROMOCODE_UPDATED
    );
  }

  // Деактивация промокода (только для админа)
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Деактивировать промокод' })
  @ApiOkResponse({ description: 'Промокод успешно деактивирован' })
  @ApiParam({ name: 'code', description: 'Код промокода' })
  async deactivatePromocode(@Param() params: PromocodeCodeDto) {
    await this.promocodesService.deactivate(params.code);
    return this.responseService.success(
      undefined,
      PROMOCODES_CONSTANTS.SUCCESS.PROMOCODE_DEACTIVATED
    );
  }

  // Массовая деактивация промокодов (только для админа)
  @Delete('batch/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Деактивировать несколько промокодов' })
  @ApiOkResponse({ description: 'Промокоды успешно деактивированы' })
  @ApiBody({
    description: 'Массив кодов промокодов для деактивации',
    schema: {
      type: 'object',
      properties: {
        codes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Массив кодов промокодов',
        },
      },
    },
  })
  async deactivateMultiplePromocodes(@Body() body: { codes: string[] }) {
    const result = await this.promocodesService.deactivateMultiple(body.codes);
    return this.responseService.success(
      result,
      PROMOCODES_CONSTANTS.SUCCESS.PROMOCODES_DEACTIVATED
    );
  }

  // Применение промокода (доступно всем пользователям)
  @Post('apply')
  @ApiOperation({ summary: 'Применить промокод' })
  @ApiOkResponse({ description: 'Промокод успешно применен' })
  async applyPromocode(@Body() applyPromocodeDto: ValidatePromocodeDto) {
    const result = await this.promocodesService.validateAndApply(
      applyPromocodeDto.code,
      applyPromocodeDto.orderAmount,
      applyPromocodeDto.userId
    );
    return this.responseService.success(
      result,
      PROMOCODES_CONSTANTS.SUCCESS.PROMOCODE_APPLIED
    );
  }

  // Получение всех промокодов с пагинацией (только для админа)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все промокоды с пагинацией' })
  @ApiOkResponse({ description: 'Промокоды успешно загружены' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице',
  })
  async getAllPromocodes(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const result = await this.promocodesService.getAll(
      page || 1,
      limit || PROMOCODES_CONSTANTS.DEFAULT_PAGE_SIZE
    );
    return this.responseService.success(
      result,
      PROMOCODES_CONSTANTS.SUCCESS.PROMOCODES_LOADED
    );
  }

  // Получение активных промокодов с пагинацией
  @Get('active')
  @ApiOperation({ summary: 'Получить активные промокоды с пагинацией' })
  @ApiOkResponse({ description: 'Активные промокоды загружены' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице',
  })
  async getActivePromocodes(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const result = await this.promocodesService.getAllActive(
      page || 1,
      limit || PROMOCODES_CONSTANTS.DEFAULT_PAGE_SIZE
    );
    return this.responseService.success(result, 'Активные промокоды загружены');
  }

  // Поиск промокодов (только для админа)
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поиск промокодов' })
  @ApiOkResponse({ description: 'Поиск завершен' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Поисковый запрос',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество результатов',
  })
  async searchPromocodes(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const result = await this.promocodesService.searchPromocodes(
      query,
      page || 1,
      limit || PROMOCODES_CONSTANTS.DEFAULT_PAGE_SIZE
    );
    return this.responseService.success(
      result,
      PROMOCODES_CONSTANTS.SUCCESS.SEARCH_COMPLETED
    );
  }

  // Получение статистики промокодов (только для админа)
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить статистику промокодов' })
  @ApiOkResponse({ description: 'Статистика получена' })
  async getPromocodeStats() {
    const stats = await this.promocodesService.getPromocodeStats();
    return this.responseService.success(
      stats,
      'Статистика промокодов получена'
    );
  }

  // Получение промокода по коду
  @Get(':code')
  @ApiOperation({ summary: 'Получить промокод по коду' })
  @ApiOkResponse({ description: 'Промокод найден' })
  @ApiParam({ name: 'code', description: 'Код промокода' })
  async getPromocodeByCode(@Param() params: PromocodeCodeDto) {
    const promocode = await this.promocodesService[
      'promocodesRepository'
    ].findByCode(params.code);
    if (!promocode) {
      return this.responseService.success(null, 'Промокод не найден');
    }
    return this.responseService.success(promocode, 'Промокод найден');
  }

  // Получение промокодов по диапазону скидок (только для админа)
  @Get('filter/discount-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить промокоды по диапазону скидок' })
  @ApiOkResponse({ description: 'Промокоды по диапазону скидок загружены' })
  @ApiQuery({
    name: 'minDiscount',
    required: true,
    type: Number,
    description: 'Минимальная скидка',
  })
  @ApiQuery({
    name: 'maxDiscount',
    required: true,
    type: Number,
    description: 'Максимальная скидка',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов',
  })
  async getPromocodesByDiscountRange(
    @Query('minDiscount') minDiscount: number,
    @Query('maxDiscount') maxDiscount: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const result = await this.promocodesService[
      'promocodesRepository'
    ].getPromocodesByDiscountRange(
      minDiscount,
      maxDiscount,
      page || 1,
      limit || PROMOCODES_CONSTANTS.DEFAULT_PAGE_SIZE
    );
    return this.responseService.success(
      result,
      'Промокоды по диапазону скидок загружены'
    );
  }

  // Получение промокодов по диапазону дат (только для админа)
  @Get('filter/date-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить промокоды по диапазону дат' })
  @ApiOkResponse({ description: 'Промокоды по диапазону дат загружены' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Начальная дата (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'Конечная дата (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов',
  })
  async getPromocodesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const result = await this.promocodesService[
      'promocodesRepository'
    ].getPromocodesByDateRange(
      new Date(startDate),
      new Date(endDate),
      page || 1,
      limit || PROMOCODES_CONSTANTS.DEFAULT_PAGE_SIZE
    );
    return this.responseService.success(
      result,
      'Промокоды по диапазону дат загружены'
    );
  }
}
