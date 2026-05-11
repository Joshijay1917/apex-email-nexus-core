import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WhatsappModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule { }
