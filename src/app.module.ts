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
import { postgresDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(postgresDataSource.options),
    GmailModule,
    WhatsappModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
