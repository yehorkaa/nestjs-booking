import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashService {
  abstract hash(data: Buffer | string): Promise<string>;
  abstract compare(data: Buffer | string, encrypted: string): Promise<boolean>;
}
