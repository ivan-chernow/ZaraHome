import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards, 
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ApiResponse as CustomApiResponse } from '../interfaces';

/**
 * Базовый абстрактный класс для всех контроллеров
 * Предоставляет общие методы CRUD операций и базовую функциональность
 */
@ApiTags('Base')
export abstract class BaseController<T, CreateDto, UpdateDto> {
  
  /**
   * Получить все элементы с пагинацией
   */
  @Get()
  @ApiOperation({ summary: 'Получить все элементы' })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы' })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество элементов на странице' })
  @ApiResponse({ status: 200, description: 'Список элементов получен успешно' })
  @ApiResponse({ status: 400, description: 'Неверные параметры запроса' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<CustomApiResponse<T[]>> {
    throw new Error('Метод findAll должен быть реализован в дочернем классе');
  }

  /**
   * Получить элемент по ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Получить элемент по ID' })
  @ApiParam({ name: 'id', description: 'ID элемента' })
  @ApiResponse({ status: 200, description: 'Элемент найден успешно' })
  @ApiResponse({ status: 404, description: 'Элемент не найден' })
  @ApiResponse({ status: 400, description: 'Неверный ID' })
  async findOne(@Param('id') id: string): Promise<CustomApiResponse<T>> {
    throw new Error('Метод findOne должен быть реализован в дочернем классе');
  }

  /**
   * Создать новый элемент
   */
  @Post()
  @ApiOperation({ summary: 'Создать новый элемент' })
  @ApiBody({ type: Object, description: 'Данные для создания элемента' })
  @ApiResponse({ status: 201, description: 'Элемент создан успешно' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 409, description: 'Элемент уже существует' })
  async create(@Body() createDto: CreateDto): Promise<CustomApiResponse<T>> {
    throw new Error('Метод create должен быть реализован в дочернем классе');
  }

  /**
   * Обновить элемент по ID
   */
  @Put(':id')
  @ApiOperation({ summary: 'Обновить элемент по ID' })
  @ApiParam({ name: 'id', description: 'ID элемента' })
  @ApiBody({ type: Object, description: 'Данные для обновления элемента' })
  @ApiResponse({ status: 200, description: 'Элемент обновлен успешно' })
  @ApiResponse({ status: 404, description: 'Элемент не найден' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto
  ): Promise<CustomApiResponse<T>> {
    throw new Error('Метод update должен быть реализован в дочернем классе');
  }

  /**
   * Удалить элемент по ID
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить элемент по ID' })
  @ApiParam({ name: 'id', description: 'ID элемента' })
  @ApiResponse({ status: 200, description: 'Элемент удален успешно' })
  @ApiResponse({ status: 404, description: 'Элемент не найден' })
  @ApiResponse({ status: 400, description: 'Неверный ID' })
  async remove(@Param('id') id: string): Promise<CustomApiResponse<void>> {
    throw new Error('Метод remove должен быть реализован в дочернем классе');
  }

  /**
   * Загрузить файлы (если поддерживается)
   */
  @Post('upload')
  @ApiOperation({ summary: 'Загрузить файлы' })
  @ApiResponse({ status: 201, description: 'Файлы загружены успешно' })
  @ApiResponse({ status: 400, description: 'Неверные файлы' })
  @ApiResponse({ status: 413, description: 'Файл слишком большой' })
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif|pdf)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>
  ): Promise<CustomApiResponse<string[]>> {
    throw new Error('Метод uploadFiles должен быть реализован в дочернем классе');
  }

  /**
   * Поиск элементов
   */
  @Get('search')
  @ApiOperation({ summary: 'Поиск элементов' })
  @ApiQuery({ name: 'q', required: false, description: 'Поисковый запрос' })
  @ApiQuery({ name: 'filters', required: false, description: 'Фильтры' })
  @ApiResponse({ status: 200, description: 'Результаты поиска' })
  @ApiResponse({ status: 400, description: 'Неверные параметры поиска' })
  async search(
    @Query('q') query: string,
    @Query('filters') filters: string
  ): Promise<CustomApiResponse<T[]>> {
    throw new Error('Метод search должен быть реализован в дочернем классе');
  }

  /**
   * Получить статистику
   */
  @Get('stats/overview')
  @ApiOperation({ summary: 'Получить общую статистику' })
  @ApiResponse({ status: 200, description: 'Статистика получена успешно' })
  async getStats(): Promise<CustomApiResponse<any>> {
    throw new Error('Метод getStats должен быть реализован в дочернем классе');
  }
}
