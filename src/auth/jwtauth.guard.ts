import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private jwtService: JwtService,
      private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const skipGuard = this.reflector.get<boolean>('skipAuthGuard', context.getHandler());
      if (skipGuard) {
          return true;
      }
      const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}