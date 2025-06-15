import { GENDER, Gender } from "@nestjs-booking-clone/common";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, isPhoneNumber, Length } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserProfileDto {
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @IsOptional()
    @IsEnum(GENDER)
    gender: Gender;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date;

    @IsOptional()
    @IsPhoneNumber()
    phoneNumber: string;
}