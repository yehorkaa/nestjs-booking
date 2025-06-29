import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTP_DIGITS } from '../auth.const';
import { TOTP as otpGenerator } from 'totp-generator';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { PhoneOtpDto } from '../dto/request-otp.dto';
import { InvalidOtpError, OtpStorage } from '../storages/otp.storage';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

// TODO: maybe implement it in auth service
@Injectable()
export class PhoneOtpService implements OtpService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly otpStorage: OtpStorage
  ) {}

 async generate() {
    const { otp } = otpGenerator.generate('JBSWY3DPEHPK3PXP', {
      digits: OTP_DIGITS,
    });
    return otp.toString();
  }

  async request(requestOtpDto: PhoneOtpDto) {
    try {
      const user = await this.userRepository.findOneBy({
        phoneNumber: requestOtpDto.phoneNumber,
      });
      if (!user) {
        throw new UnauthorizedException('User with this email does not exist');
      }

      const cachedOtp = await this.otpStorage.getOtp(user.phoneNumber);
      if (cachedOtp) {
        throw new Error('OTP already exists');
      }
      const otp = await this.generate();
      await this.otpStorage.insert(user.phoneNumber, otp);
      return { otp };
    } catch (error) {
      if (error.message) {
        throw new Error(error);
      }
      throw new UnauthorizedException();
    }
  }

  async verify(verifyOtpDto: VerifyOtpDto) {
    try {
      const isValid = await this.otpStorage.validate(
        verifyOtpDto.phoneNumber,
        verifyOtpDto.otp
      );
      if (!isValid) {
        throw new Error('Invalid OTP');
      }
      
      await this.otpStorage.invalidate(verifyOtpDto.phoneNumber);
      
      const user = await this.userRepository.findOneBy({
        phoneNumber: verifyOtpDto.phoneNumber,
      });

      if (!user) {
        throw new Error('User does not exist');
      }
      
      return user;
    } catch (err) {
      if (err instanceof InvalidOtpError) {
        throw new UnauthorizedException('Invalid OTP');
      }
      throw new UnauthorizedException(err.message || 'OTP verification failed');
    }
  }
}
