import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create(user: CreateUserDto) {
        return await this.userRepository.save(user);
    }

    async updateHashedRefreshToken(userId: number, hashRefreshToken: string) {
        return await this.userRepository.update(userId, { refreshToken: hashRefreshToken });
    }

    async updateGoogleToken(userId: number, googleRefreshToken: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) throw new NotFoundException('User not found');

        user.googleRefreshToken = googleRefreshToken;

        return await this.userRepository.save(user);
    }

    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }

    async updatePhone(userId: number, phoneNumber: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) throw new NotFoundException('User not found');

        user.phoneNumber = phoneNumber;

        return await this.userRepository.save(user);
    }

    async validateUser(userId: number) {
        const user = await this.findById(userId)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user;
    }
}