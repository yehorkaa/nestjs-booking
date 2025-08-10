import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class OtpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
} 