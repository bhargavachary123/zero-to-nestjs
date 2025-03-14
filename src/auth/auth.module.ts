import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {  APP_INTERCEPTOR } from '@nestjs/core';
import { Profile } from 'src/user/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { JwtExpiredFilter } from './passport/jwtExpired.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    PassportModule,
    JwtModule.register({
      secret: "thisisasecretkey",
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, 
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtExpiredFilter,
    },
  ],
})
export class AuthModule { }