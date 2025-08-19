import { IsEmail, IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class OtpRequestCreatedDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsNumber()
  @IsOptional()
  attempt?: number;
}
