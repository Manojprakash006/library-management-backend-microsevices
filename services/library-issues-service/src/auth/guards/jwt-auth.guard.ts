import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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
    } catch (error) {
      throw new UnauthorizedException('Not authorized, token failed');
    }
  }
}
