import { Body, Controller, Post, Response } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { SkipAuthGuard } from './skipauth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('login')
    @SkipAuthGuard()
    async login(
        @Body() loginDto: LoginDto,
        @Response({ passthrough: true }) res,
    ) {
        return await this.authService.login(loginDto, res);
    }
}