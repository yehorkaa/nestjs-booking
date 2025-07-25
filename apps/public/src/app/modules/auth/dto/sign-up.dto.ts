import { IsEmail, MinLength } from "class-validator";

export class SignUpDto {
    @IsEmail()
    email: string;

    @MinLength(10)
    password: string;

    @MinLength(1)
    name: string;
}
