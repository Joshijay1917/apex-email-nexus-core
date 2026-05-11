import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async login(userId: number) {
        const { accessToken, refreshToken } = await this.getTokens(userId);

        const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateHashedRefreshToken(userId, hashRefreshToken);
        return {
            id: userId,
            accessToken,
            refreshToken
        }
    }

    async validateGoogleUser(googleUser: CreateUserDto, googleRefreshToken: string) {
        let user = await this.userService.findByEmail(googleUser.email) as User

        if (!user) {
            user = await this.userService.create({
                ...googleUser,
                googleRefreshToken
            });
        } else if (googleRefreshToken) {
            user = await this.userService.updateGoogleToken(user.id, googleRefreshToken);
        }

        const { accessToken } = await this.login(user.id);
        const { googleRefreshToken: _, ...safeUser } = user;

        return {
            ...safeUser,
            jwt: accessToken
        };
    }

    async getTokens(userId: number) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId },
                {
                    expiresIn: this.configService.get<any>('jwt.accessTokenExpiry'),
                    secret: this.configService.get<string>('jwt.accessTokenSecret'),
                }
            ),
            this.jwtService.signAsync(
                { sub: userId },
                {
                    expiresIn: this.configService.get<any>('jwt.refreshTokenExpiry'),
                    secret: this.configService.get<string>('jwt.refreshTokenSecret'),
                }
            ),
        ]);
        return { accessToken, refreshToken };
    }
}