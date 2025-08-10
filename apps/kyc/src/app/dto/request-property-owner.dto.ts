import { IsString, MaxLength, MinLength } from 'class-validator';

export class RequestPropertyOwnerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  lastName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  taxNumber: string;
}
