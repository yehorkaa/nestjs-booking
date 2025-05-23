import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { HashService } from './hash.service';


// There are many hash algorithms, but bcrypt is one of the most popular and secure ones.
// For example, sha256 is another popular hash algorithm, but it is not as secure as bcrypt.
// bcrypt is a hash algorithm that is used to hash passwords.
// It is a one-way function, which means that it is not possible to reverse the hash to get the original password.
// The salt is added to the password before the hash is created.
// The salt is stored in the database and is used to verify the password when the user logs in.

// The two-way function is a function that can be used to verify the password when the user logs in.
// The two-way function is the compare function.

@Injectable()
export class BcryptService implements HashService {
  async hash(data: Buffer | string): Promise<string> {
    const salt = await genSalt(); // salt is a random string of characters that is used to increase the security of the password
    return hash(data, salt);
  }

  async compare(data: Buffer | string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
