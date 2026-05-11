import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth-config';
import { GoogleStrategy } from './strategies/google-strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import tokenConfig from './config/token-config';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(tokenConfig),
    PassportModule.register({ session: false }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: 60 * 60 * 15,
      },
    })
  ],
  providers: [GoogleStrategy, AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
