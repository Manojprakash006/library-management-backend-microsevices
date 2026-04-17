import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Member } from '../../members/entities/member.entity';
import { MemberRegisterDto } from '../dto/member-register.dto';
import { MemberLoginDto } from '../dto/member-login.dto';
import { EmailService } from '../../notifications/service/email.service';

@Injectable()
export class MemberAuthService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: MemberRegisterDto) {
    const { email, password, name, phone, address } = registerDto;
    console.log("log from member auth service for registerDto :", registerDto);

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ConflictException('Valid email is required');
    }
    if (!password || password.length < 6) {
      throw new ConflictException('Password must be at least 6 characters');
    }
    if (!name || name.trim().length < 2) {
      throw new ConflictException('Name is required and must be at least 2 characters');
    }

    const existingMember = await this.memberModel.findOne({ email });
    if (existingMember) {
      throw new ConflictException('Email already registered');
    }

    // Password will be auto-hashed by Mongoose pre-save hook in entity
    const member = new this.memberModel({
      email,
      password: password,
      name,
      phoneNumber: phone,
      role: 'member',
      status: 'active',
      address,
    });

    await member.save();
    console.log("register log :", member.save());

    const token = this.jwtService.sign({
      userId: member._id,
      email: member.email,
      role: 'member',
    });

    return {
      token,
      user: {
        id: member._id,
        email: member.email,
        name: member.name,
        role: 'member',
      },
    };
  }

  async login(loginDto: MemberLoginDto) {
    const { email, password } = loginDto;

    const member = await this.memberModel.findOne({ email }).select('+password');
    if (!member) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password exists
    if (!member.password) {
      throw new UnauthorizedException('Account error - password not set');
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, member.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Password verification failed');
    }

    const token = this.jwtService.sign({
      userId: member._id,
      email: member.email,
      role: 'member',
    });

    return {
      token,
      user: {
        id: member._id,
        email: member.email,
        name: member.name,
        role: 'member',
      },
    };
  }

  async getProfile(userId: string) {
    const member = await this.memberModel.findById(userId).select('-password');
    if (!member) {
      throw new UnauthorizedException('Member not found');
    }
    return member;
  }

  async forgotPassword(email: string) {
    const member = await this.memberModel.findOne({ email });
    if (!member) {
      throw new UnauthorizedException('Email not found');
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Send password reset email
    await this.emailService.sendPasswordResetEmail(
      member.email,
      member.name,
      resetToken
    );
    
    return {
      message: 'Password reset instructions sent to email',
      email: member.email,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // In production, verify token against stored token
    // For now, simplified implementation
    
    // Validate password
    if (!newPassword || newPassword.length < 6) {
      throw new ConflictException('Password must be at least 6 characters');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update member password (in production, find by token)
    // For now, this is a simplified flow
    return {
      message: 'Password reset successfully',
    };
  }
}
