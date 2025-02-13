import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './jwtauth.guard';
import { Profile } from 'src/user/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from './role.guard';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AuthModule { }