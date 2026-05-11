import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly whatsappService: WhatsappService
    ) { }

    @Patch('/update-phone')
    @UseGuards(AuthGuard('jwt'))
    async UpdateMobile(@Req() req: Request, @Body() body: { phoneNumber: string }) {
        const { phoneNumber } = body;
        const userId = (req.user as any).sub;
        console.log("UpdatePhone:", { phoneNumber, userId })

        if (!userId || !phoneNumber) {
            throw new BadRequestException('Required details not found!')
        }

        const user = await this.userService.updatePhone(userId, phoneNumber);
        if (!user) {
            throw new InternalServerErrorException('Failed to update phone number!')
        }

        this.whatsappService.sendOtpMessage(phoneNumber);
        return { success: true, data: user, message: 'Phone number updated successfully!', statusCode: 200 }
    }

    @Get('/resend')
    @UseGuards(AuthGuard('jwt'))
    async resendOtp(@Req() req: Request) {
        const userId = (req.user as any).sub;

        if (!userId) {
            throw new BadRequestException('Required details not found!')
        }

        const user = await this.userService.findById(userId)
        if (!user) {
            throw new NotFoundException('User not found!')
        }

        this.whatsappService.sendOtpMessage(user.phoneNumber);
        return { success: true, data: user, message: 'OTP Resend Successfully!', statusCode: 200 }
    }

    @Post('/verify-otp')
    @UseGuards(AuthGuard('jwt'))
    async verifyOtp(@Req() req: Request, @Body() body: { otp: string }) {
        const { otp } = body;
        const userId = (req.user as any).sub;
        console.log("Veirfy:", { userId, otp })

        if (!userId || !otp) {
            throw new BadRequestException('Required details not found!')
        }

        const user = await this.userService.findById(userId)
        if (!user) {
            throw new NotFoundException('User not found!')
        }

        const isVerified = await this.whatsappService.verifyOtpToken(user.phoneNumber, otp);
        if (!isVerified) {
            throw new BadRequestException('Invalid OTP')
        }
        return { success: true, data: user, message: 'Phone number Verified Successfully!', statusCode: 200 }
    }

    @Get('/whoami')
    @UseGuards(AuthGuard('jwt'))
    async userDetails(@Req() req: Request) {
        const userId = (req.user as any).sub;
        console.log("Whoami:", { userId })
        const user = await this.userService.findById(userId)
        if (!user) {
            throw new NotFoundException('User not found!')
        }
        this.whatsappService.sendInitialMessage(user.phoneNumber);
        return { success: true, data: user, message: 'User Details Fetched Successfully!', statusCode: 200 }
    }
}