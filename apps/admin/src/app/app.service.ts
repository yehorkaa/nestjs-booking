import { Injectable } from '@nestjs/common';
import { PG_ERROR_CODES } from '@nestjs-booking-clone/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: `Hello API ${PG_ERROR_CODES.UNIQUE_VIOLATION}` };
  }
}
