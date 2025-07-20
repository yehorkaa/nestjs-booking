import { IsOptional, IsString } from 'class-validator';

export class CreateApartmentAddressDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  buildingDetails?: string;
}
