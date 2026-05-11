import { Module } from '@nestjs/common';
import { GmailController } from './gmail.controller';
import { GmailService } from './gmail.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from 'src/auth/config/google-oauth-config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forFeature(googleOauthConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [GmailController],
  providers: [GmailService, JwtStrategy]
})
export class GmailModule { }
