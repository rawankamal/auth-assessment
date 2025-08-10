import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  private blacklistedTokens = new Set<string>();

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async signup(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const user = new this.userModel({ name, email, password: hashedPassword });
    await user.save();
    return { message: 'User created successfully', userId: user._id };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, name: user.name };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async logout(token: string) {
    try {
      // Verify the token is valid before blacklisting
      await this.jwtService.verifyAsync(token);

      // Add token to blacklist
      this.blacklistedTokens.add(token);

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}
