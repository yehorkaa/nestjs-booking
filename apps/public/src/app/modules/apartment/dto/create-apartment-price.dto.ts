import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateApartmentPriceDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => (value ? new Date(value) : new Date()), {
    toClassOnly: true,
  })
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date | null;
}
