import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { UserService } from 'src/user/user.service';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('gmail')
export class GmailController {

    constructor(
        private readonly gmailService: GmailService,
        private readonly userService: UserService
    ) { }

    @Get('sync')
    @UseGuards(AuthGuard('jwt'))
    async getSync(@Req() req: Request) {
        console.log("USER::", req.user)
        const userId = (req.user as any).sub;
        const user = await this.userService.findById(Number(userId));

        if (!user || !user.googleRefreshToken) {
            return { message: "No user or Google account linked" };
        }

        const emails = await this.gmailService.getLatestEmails(user.googleRefreshToken);
        return {
            status: 'success',
            data: emails
        };
    }
}