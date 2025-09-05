import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: (user as any).createdAt || new Date()
    };
  }

  // NEW ENDPOINT - Protected data list
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getUsersList(@Request() req: any) {
    try {
      const users = await this.usersService.findAll();
      return users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email.substring(0, 3) + '***@' + user.email.split('@')[1], // Partially hide email for privacy
        joinDate: (user as any).createdAt || new Date()
      }));
    } catch (error) {
      return { message: 'Failed to load users', error: (error as any).message };
    }
  }
}
