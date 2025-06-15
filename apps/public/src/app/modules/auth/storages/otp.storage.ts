import { Inject, Injectable } from '@nestjs/common';
import { OTP_DIGITS, OTP_TTL } from '../auth.const';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { TOTP as otpGenerator } from 'totp-generator';

export class InvalidOtpError extends Error {}

@Injectable()
export class OtpStorage {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async insert(phoneNumber: string, otp: string, ttl: number = OTP_TTL) {
    await this.cacheManager.set(this.getKey(phoneNumber), otp, ttl);
  }

  async validate(phoneNumber: string, otp: string) {
    const cachedOtp = await this.cacheManager.get(this.getKey(phoneNumber));
    if (!cachedOtp) {
      throw new Error('Invalid OTP');
    }
    return cachedOtp === otp;
  }

  async invalidate(phoneNumber: string) {
    await this.cacheManager.del(this.getKey(phoneNumber));
  }

  async getOtp(phoneNumber: string) {
    return await this.cacheManager.get(this.getKey(phoneNumber));
  }

  async generateOtp() {
    const { otp, expires } = otpGenerator.generate('JBSWY3DPEHPK3PXP', { digits: OTP_DIGITS });
    return { otp: otp.toString(), expires };
  }

  private getKey(phoneNumber: string) {
    return `otp-${phoneNumber}`;
  }
}
