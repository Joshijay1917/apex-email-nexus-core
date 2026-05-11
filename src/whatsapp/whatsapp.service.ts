import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WhatsappService {
    private phoneNumberToTokenMapper = new Map();

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    async sendInitialMessage(userPhoneNumber: string) {
        const WAHA_API_URL = this.configService.get<string>('WAHA_API_URL') || "http://localhost:3001";
        const WAHA_API_KEY = this.configService.get<string>('WAHA_API_KEY') || '';
        const wahaResponse = await fetch(`${WAHA_API_URL}/api/sendText`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": WAHA_API_KEY
            },
            body: JSON.stringify({
                chatId: userPhoneNumber,
                text: "Hello, Welcome to Email Nexus App.",
                session: "default"
            }),
        });
        return wahaResponse;
    }

    async sendOtpMessage(userPhoneNumber: string) {
        const existingToken = this.phoneNumberToTokenMapper.get(userPhoneNumber);
        if (existingToken) {
            this.phoneNumberToTokenMapper.delete(userPhoneNumber)
        }
        const cleanNumber = userPhoneNumber.replace('+', '');
        const otp = await this.generateOtpToken(userPhoneNumber);
        const WAHA_API_URL = this.configService.get<string>('WAHA_API_URL') || "http://localhost:3001";
        const WAHA_API_KEY = this.configService.get<string>('WAHA_API_KEY') || '';
        try {
            const wahaResponse = await fetch(`${WAHA_API_URL}/api/sendText`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": WAHA_API_KEY
                },
                body: JSON.stringify({
                    chatId: `${cleanNumber}@c.us`,
                    text: `Your One-Time Password (OTP) for Email Nexus is: *${otp}*. 
                
                Please enter this code in the app to verify your identity.
                
                This code will expire in 10 minutes.`,
                    session: "default"
                }),
            });
            const result = await wahaResponse.json();
            if (!wahaResponse.ok) {
                console.error('WAHA API Error:', result);
                throw new Error(`WAHA failed with status ${wahaResponse.status}: ${JSON.stringify(result)}`);
            }
            return result;
        } catch (error) {
            console.error('Failed to bridge with Whatsapp:', error.message);
            throw error;
        }
    }

    async generateOtpToken(phoneNumber: string) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = this.jwtService.sign({ otp: otp })
        this.phoneNumberToTokenMapper.set(phoneNumber, token)
        return otp;
    }

    async verifyOtpToken(phoneNumber: string, userOtp: string) {
        const token = this.phoneNumberToTokenMapper.get(phoneNumber)
        if (!token) {
            return false;
        }
        try {
            const payload = this.jwtService.verify(token)
            const otp = payload.otp;

            if (otp && String(userOtp) === String(otp)) {
                this.phoneNumberToTokenMapper.delete(phoneNumber);
                await this.sendInitialMessage(phoneNumber);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to verify OTP:', error.message);
            return false;
        }
    }
}