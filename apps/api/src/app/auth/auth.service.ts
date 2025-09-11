import { ConflictException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from '../users/user.schema';

@Injectable()
export class AuthService {
  private blacklistedTokens = new Set<string>();
  private resetTokens = new Map<string, { email: string; expires: Date }>();

  constructor(
    @InjectModel('User') private userModel: Model<User>,
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
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify the token is valid before blacklisting
      await this.jwtService.verifyAsync(token);

      // Add token to blacklist
      this.blacklistedTokens.add(token);

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If email exists, reset instructions have been sent' };
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset token (in production, store in database)
    this.resetTokens.set(resetToken, { email, expires });

    // In production, send email here
    console.log(`Reset token for ${email}: ${resetToken}`);

    return {
      message: 'If email exists, reset instructions have been sent',
      // Remove this in production - only for testing
      resetToken: resetToken
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetData = this.resetTokens.get(token);

    if (!resetData || resetData.expires < new Date()) {
      this.resetTokens.delete(token);
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const user = await this.userModel.findOne({ email: resetData.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userModel.updateOne(
      { email: resetData.email },
      { password: hashedPassword }
    );

    // Remove used token
    this.resetTokens.delete(token);

    return { message: 'Password reset successfully' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
