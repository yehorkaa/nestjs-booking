import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class RequestOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;
}

// TODO: maybe use in diff routes
export class PhoneOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;
}

export class EmailOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}