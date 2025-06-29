import { Injectable } from '@nestjs/common';
// TODO: matbe create strategy pattern for otp services
@Injectable()
export abstract class OtpService {
  abstract request(dto: unknown): Promise<unknown>;
  abstract verify(dto: unknown): Promise<unknown>;
}
