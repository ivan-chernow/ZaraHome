import { Controller, Get, Patch, Body, UseGuards, Request, Post, Put, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/login/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { ChangeDeliveryAddressDto, ChangeEmailDto, ChangePasswordDto } from './dto/user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    async getProfile(@Request() req) {
        return this.userService.getProfile(req.user.userId);
    }

    @Patch('change-password')
    async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(req.user.userId, dto);
    }

    @Patch('change-email')
    async changeEmail(@Request() req, @Body() dto: ChangeEmailDto) {
        return this.userService.changeEmail(req.user.userId, req.user.email, dto.newEmail);
    }

    @Patch('change-delivery-address')
    async changeDeliveryAddress(@Request() req, @Body() dto: ChangeDeliveryAddressDto) {
        return this.userService.changeDeliveryAddress(req.user.userId, dto);
    }

    @Get('delivery-addresses')
    async getDeliveryAddresses(@Request() req) {
        return this.userService.getDeliveryAddresses(req.user.userId);
    }

    @Post('delivery-addresses')
    async addDeliveryAddress(@Request() req, @Body() dto: ChangeDeliveryAddressDto) {
        return this.userService.addDeliveryAddress(req.user.userId, dto);
    }

    @Put('delivery-addresses/:id')
    async updateDeliveryAddress(
        @Request() req,
        @Param('id') id: number,
        @Body() dto: ChangeDeliveryAddressDto
    ) {
        return this.userService.updateDeliveryAddress(req.user.userId, id, dto);
    }
}
