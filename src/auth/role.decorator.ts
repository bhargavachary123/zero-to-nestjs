import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/user/entities/user.entity';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);