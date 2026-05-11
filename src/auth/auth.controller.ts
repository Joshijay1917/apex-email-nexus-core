import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import type { Response, Request } from 'express';
import type { ConfigType } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth-config';

@Controller('auth/google')
@UseGuards(GoogleAuthGuard)
export class AuthController {
    constructor(@Inject(googleOauthConfig.KEY) private googleConfiguration: ConfigType<typeof googleOauthConfig>) { }

    @Get('login')
    async googleAuth(@Req() req: Request) { }

    @Get('callback')
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as any;
        const redirectUrl = `${this.googleConfiguration.applicationRedirectUrl}?token=${user.jwt}`;
        return res.redirect(redirectUrl);
    }
}