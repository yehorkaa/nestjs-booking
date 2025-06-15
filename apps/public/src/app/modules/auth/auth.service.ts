import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { BcryptService } from '../common/services/bcrypt.service';
import jwtUserConfig from './config/jwt-user.config';
import { SignUpDto } from './dto/sign-up.dto';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { SignInDto } from './dto/sign-in.dto';
import { UserRole } from '../user/user.type';
import { PG_ERROR_CODES } from '@nestjs-booking-clone/common';
import { BCRYPT_SERVICE } from '../common/const/service.const';
import { ActiveUserModel } from './decorators/active-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { randomUUID } from 'crypto';
import {
  InvalidRefreshTokenError,
  RefreshTokenIdsStorage,
} from './storages/refresh-token-ids.storage';
import { InvalidOtpError, OtpStorage } from './storages/otp.storage';
import { LogoutDto } from './dto/log-out.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(BCRYPT_SERVICE) private readonly bcryptService: BcryptService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(jwtUserConfig.KEY)
    private readonly jwtUserConfiguration: ConfigType<typeof jwtUserConfig>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly otpStorage: OtpStorage
  ) {}

  async signUp(signUpDto: SignUpDto, role: UserRole) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.passwordHash = await this.bcryptService.hash(signUpDto.password);
      user.role = role;

      const profile = new UserProfile();
      profile.name = signUpDto.name;
      user.profile = profile;

      await this.userRepository.save(user);

      const { accessToken, refreshToken } = await this.generateTokens(user);

      return { user, accessToken, refreshToken };
    } catch (err) {
      if (err.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) throw new UnauthorizedException('User does not exist');

    const isEqual = await this.bcryptService.compare(
      signInDto.password,
      user.passwordHash
    );
    if (!isEqual) throw new UnauthorizedException('Invalid password');

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub: userId, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserModel, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtUserConfiguration.secret,
        audience: this.jwtUserConfiguration.audience,
        issuer: this.jwtUserConfiguration.issuer,
      });
      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
      const userKey = `${userId}-${refreshTokenId}`;
      const isValid = await this.refreshTokenIdsStorage.validate(
        userKey,
        refreshTokenId
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(userKey);
      } else {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidRefreshTokenError) {
        throw new UnauthorizedException(err.message);
      }
      throw new UnauthorizedException();
    }
  }

  async requestOtp(requestOtpDto: RequestOtpDto) {
    try {
      const user = await this.userRepository.findOneBy({
        phoneNumber: requestOtpDto.phoneNumber,
      });
      if (!user) {
        throw new UnauthorizedException(
          'User with this phone number does not exist'
        );
      }

      const cachedOtp = await this.otpStorage.getOtp(user.phoneNumber);
      if (cachedOtp) {
        throw new Error('OTP already exists');
      }
      const { otp, expires } = await this.otpStorage.generateOtp();
      await this.otpStorage.insert(user.phoneNumber, otp);
      return { otp, expires };
    } catch (error) {
      if (error.message) {
        throw new Error(error);
      }
      throw new UnauthorizedException();
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
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
      const { accessToken, refreshToken } = await this.generateTokens(user);
      return { accessToken, refreshToken };
    } catch (err) {
      if (err instanceof InvalidOtpError) {
        throw new UnauthorizedException();
      }
      throw new UnauthorizedException();
    }
  }

  async logout(logoutDto: LogoutDto, userId: string) {
    try {
      const { refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserModel, 'sub'> & { refreshTokenId: string }
      >(
        logoutDto.refreshToken,
        {
          secret: this.jwtUserConfiguration.secret,
          audience: this.jwtUserConfiguration.audience,
          issuer: this.jwtUserConfiguration.issuer,
        }
      );
      const userKey = `${userId}-${refreshTokenId}`;
      const isValid = await this.refreshTokenIdsStorage.validate(
        userKey,
        refreshTokenId
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(userKey);
      } else {
        throw new Error('Invalid refresh token');
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signAsyncToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T
  ) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtUserConfiguration.audience,
        issuer: this.jwtUserConfiguration.issuer,
        secret: this.jwtUserConfiguration.secret,
        expiresIn,
      }
    );
    return accessToken;
  }

  private async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    
    const [accessToken, refreshToken] = await Promise.all([
      this.signAsyncToken<Partial<ActiveUserModel>>(
        user.id,
        this.jwtUserConfiguration.accessTokenTTL,
        {
          role: user.role,
          email: user.email,
        }
      ),
      this.signAsyncToken(user.id, this.jwtUserConfiguration.refreshTokenTTL, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(`${user.id}-${refreshTokenId}`, refreshTokenId);
    return { accessToken, refreshToken };
  }
}