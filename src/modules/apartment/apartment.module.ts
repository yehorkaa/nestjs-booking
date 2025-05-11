import { Module } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { ApartmentController } from './apartment.controller';
import { Apartment } from './entities/apartment.entity';
import { Address } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment, Address])],
  controllers: [ApartmentController],
  providers: [ApartmentService],
})
export class ApartmentModule {}
