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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(BCRYPT_SERVICE) private readonly bcryptService: BcryptService,
    @Inject(jwtUserConfig.KEY)
    private readonly jwtUserConfiguration: ConfigType<typeof jwtUserConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.passwordHash = await this.bcryptService.hash(signUpDto.password);

      const profile = new UserProfile();
      profile.name = signUpDto.name;
      user.profile = profile;

      await this.userRepository.save(user);

      return user;
    } catch (err) {
      if (err.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto, role: UserRole) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) throw new UnauthorizedException('User does not exist');

    const isEqual = await this.bcryptService.compare(
      signInDto.password,
      user.passwordHash,
    );
    if (!isEqual) throw new UnauthorizedException('Invalid password');

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role
      },
      {
        audience: this.jwtUserConfiguration.audience,
        issuer: this.jwtUserConfiguration.issuer,
        secret: this.jwtUserConfiguration.secret,
        expiresIn: this.jwtUserConfiguration.accessTokenTTL,
      },
    );

    return accessToken;
  }
}
