import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateApartmentPriceDto } from './create-apartment-price.dto';
import { CreateApartmentAddressDto } from './create-apartment-address.dto';

export class CreateApartmentDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateApartmentPriceDto)
  prices: CreateApartmentPriceDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateApartmentAddressDto)
  address: CreateApartmentAddressDto;

  // images are added in the controller because they are files
  // so we don't include them in the dto

  @IsArray()
  @IsOptional()
  tags: string[];
}
