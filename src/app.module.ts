import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { GmailModule } from './gmail/gmail.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URI,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: true
      }
    }),
    GmailModule,
    WhatsappModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
