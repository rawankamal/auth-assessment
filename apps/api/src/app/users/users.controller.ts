import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile() {
    return { message: 'You are authenticated' };
  }
}
