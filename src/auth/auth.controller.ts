import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    /*
      @Throttle({ default: { limit: 3, ttl: 1000 } })
      Override the throttler configuration like above for specifc routes
    */
    @SkipThrottle({ default: true })
    async login(
        @Request() req,
    ) {
        return await this.authService.login(req.user);
    }
}