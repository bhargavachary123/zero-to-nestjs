import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const skipGuard = this.reflector.get<boolean>('skipAuthGuard', context.getHandler());
        if (skipGuard) {
            return true;
        }
        const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
        if (!roles) {
            console.log('Inside RolesGuard',roles);
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        return roles.some((role) => user.role == role);
    }
}
