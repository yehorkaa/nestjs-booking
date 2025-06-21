import { IsNotEmpty, IsPhoneNumber, Length } from "class-validator";
import { OTP_DIGITS } from "../auth.const";

export class VerifyOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @Length(OTP_DIGITS, OTP_DIGITS)
    otp: string;
}