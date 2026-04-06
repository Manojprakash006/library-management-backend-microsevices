import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './public.decorator';

interface JwtPayload {
  id: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    let token: string | undefined;

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (request.cookies && request.cookies.token) {
      token = request.cookies.token;
    }

    if (!token) {
      throw new UnauthorizedException('Not authorized, token missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as JwtPayload;
      request['user'] = { id: decoded.id, role: decoded.role };
      return true;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({ message: 'Token expired', status: 'session_expired', error: 'Unauthorized' });
      }
      throw new UnauthorizedException('Not authorized, token failed');
    }
  }
}
