import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(
        @Request() req,
    ) {
        return await this.authService.login(req.user);
    }
}