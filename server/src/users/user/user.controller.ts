import { Controller, Get, Patch, Body, UseGuards, Request, Post, Put, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { ChangeDeliveryAddressDto, ChangeEmailDto, ChangePasswordDto } from './dto/user.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    async getProfile(@Request() req: AuthenticatedRequest) {
        return this.userService.getProfile(req.user.id);
    }

    @Patch('change-password')
    async changePassword(@Request() req: AuthenticatedRequest, @Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(req.user.id, dto);
    }

    @Patch('change-email')
    async changeEmail(@Request() req: AuthenticatedRequest, @Body() dto: ChangeEmailDto) {
        return this.userService.changeEmail(req.user.id, req.user.email, dto.newEmail);
    }

    @Patch('change-delivery-address')
    async changeDeliveryAddress(@Request() req: AuthenticatedRequest, @Body() dto: ChangeDeliveryAddressDto) {
        return this.userService.changeDeliveryAddress(req.user.id, dto);
    }

    @Get('delivery-addresses')
    async getDeliveryAddresses(@Request() req: AuthenticatedRequest) {
        return this.userService.getDeliveryAddresses(req.user.id);
    }

    @Post('delivery-addresses')
    async addDeliveryAddress(@Request() req: AuthenticatedRequest, @Body() dto: ChangeDeliveryAddressDto) {
        return this.userService.addDeliveryAddress(req.user.id, dto);
    }

    @Put('delivery-addresses/:id')
    async updateDeliveryAddress(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: number,
        @Body() dto: ChangeDeliveryAddressDto
    ) {
        return this.userService.updateDeliveryAddress(req.user.id, id, dto);
    }

    @Delete('delivery-addresses/:id')
    async deleteDeliveryAddress(
        @Request() req: AuthenticatedRequest,
        @Param('id') id: number
    ) {
        return this.userService.deleteDeliveryAddress(req.user.id, id);
    }
}
