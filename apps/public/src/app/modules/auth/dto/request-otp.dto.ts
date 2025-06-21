import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class RequestOtpDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;
}