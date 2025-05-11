import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { HashService } from './hash.service';

@Injectable()
export class BcryptService implements HashService {
  async hash(data: Buffer | string): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  async compare(data: Buffer | string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
