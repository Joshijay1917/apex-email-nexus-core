import { IsEmail, IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid Gmail address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  googleRefreshToken?: string;

  // This will be used in the second step of your onboarding
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  @IsOptional()
  phoneNumber?: string;
}