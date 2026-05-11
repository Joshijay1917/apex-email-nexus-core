
import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column()
    name: string;

    @Column({ unique: true, nullable: true })
    phoneNumber: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({ unique: true })
    googleId: string;

    @Column({ type: 'text', nullable: true })
    refreshToken: string;

    @Column({ type: 'text', nullable: true })
    googleRefreshToken: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}