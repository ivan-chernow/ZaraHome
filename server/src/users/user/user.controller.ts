import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { ResponseService } from 'src/shared/services/response.service';
import {
  ChangeDeliveryAddressDto,
  ChangeEmailDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { AuthenticatedRequest } from 'src/shared/shared.interfaces';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly _userService: UserService;
  private readonly _responseService: ResponseService;

  constructor(userService: UserService, responseService: ResponseService) {
    this._userService = userService;
    this._responseService = responseService;
  }

  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const profile = await this._userService.getProfile(req.user.id);
    return this._responseService.success(
      profile,
      'Профиль пользователя загружен'
    );
  }

  @Patch('change-password')
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto
  ) {
    const result = await this._userService.changePassword(req.user.id, dto);
    return this._responseService.success(result, 'Пароль успешно изменен');
  }

  @Patch('change-email')
  async changeEmail(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ChangeEmailDto
  ) {
    const result = await this._userService.changeEmail(
      req.user.id,
      req.user.email,
      dto.newEmail
    );
    return this._responseService.success(result, 'Email успешно изменен');
  }

  @Patch('change-delivery-address')
  async changeDeliveryAddress(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ChangeDeliveryAddressDto
  ) {
    const result = await this._userService.changeDeliveryAddress(
      req.user.id,
      dto
    );
    return this._responseService.success(
      result,
      'Адрес доставки успешно изменен'
    );
  }

  @Get('delivery-addresses')
  async getDeliveryAddresses(@Request() req: AuthenticatedRequest) {
    const addresses = await this._userService.getDeliveryAddresses(req.user.id);
    return this._responseService.success(
      addresses,
      'Адреса доставки загружены'
    );
  }

  @Post('delivery-addresses')
  async addDeliveryAddress(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ChangeDeliveryAddressDto
  ) {
    const result = await this._userService.addDeliveryAddress(req.user.id, dto);
    return this._responseService.success(
      result,
      'Адрес доставки успешно добавлен'
    );
  }

  @Put('delivery-addresses/:id')
  async updateDeliveryAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: number,
    @Body() dto: ChangeDeliveryAddressDto
  ) {
    const result = await this._userService.updateDeliveryAddress(
      req.user.id,
      id,
      dto
    );
    return this._responseService.success(
      result,
      'Адрес доставки успешно обновлен'
    );
  }

  @Delete('delivery-addresses/:id')
  async deleteDeliveryAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: number
  ) {
    await this._userService.deleteDeliveryAddress(req.user.id, id);
    return this._responseService.success(
      undefined,
      'Адрес доставки успешно удален'
    );
  }
}
