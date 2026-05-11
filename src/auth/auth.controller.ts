import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';

@Controller('auth/google')
@UseGuards(GoogleAuthGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('login')
    async googleAuth(@Req() req: Request) { }

    @Get('callback')
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as any;
        const redirectUrl = `http://localhost:8081/onboarding-success?token=${user.jwt}`;
        return res.redirect(redirectUrl);
    }
}