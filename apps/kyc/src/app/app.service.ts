import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ActiveUserModel } from './modules/auth/decorators/active-user.decorator';
import { RequestPropertyOwnerDto } from './dto/request-property-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { KYC_REQUEST_STATUS, MulterFile } from '@nestjs-booking-clone/common';
import { KycRequest } from './entities/kyc-request.entity';
import { TransactionHelper } from './helpers/transaction.helper';
import { OutboxEvent } from './modules/outbox/entities/outbox.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(KycRequest)
    private readonly kycRequestRepository: Repository<KycRequest>,
    private readonly transactionHelper: TransactionHelper
  ) {}

  getData(): { message: string } {
    return { message: 'Hello FROM KYC SERVICE' };
  }

  async findAllUsers() {
    return this.userRepository.find({
      relations: ['kycRequests'],
    });
  }

  async requestPropertyOwnerRole(
    activeUser: ActiveUserModel,
    dto: RequestPropertyOwnerDto,
    passportFile: MulterFile // TODO: add amazon module
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: activeUser.sub,
      },
    });

    if (!user) {
      try {
        const queryRunner = await this.transactionHelper.start();
        try {
          const userRepo = queryRunner.manager.getRepository(User);
          const newUser = userRepo.create({
            id: activeUser.sub,
            email: activeUser.email,
            roles: activeUser.roles,
          });
          await userRepo.save(newUser);

          const kycRequestRepo = queryRunner.manager.getRepository(KycRequest);
          const newKycRequest = kycRequestRepo.create({
            user: newUser,
            status: KYC_REQUEST_STATUS.PENDING,
            firstName: dto.firstName,
            lastName: dto.lastName,
            taxNumber: dto.taxNumber,
          });
          await kycRequestRepo.save(newKycRequest);

          const outboxRepo = queryRunner.manager.getRepository(OutboxEvent);
          const outboxEvent = outboxRepo.create({
            aggregateType: 'kyc-request-user',
            aggregateId: newUser.id,
            eventType: 'kyc.request.created',
            payload: {
              email: newUser.email,
              status: newKycRequest.status,
            },
          });
          await outboxRepo.save(outboxEvent);

          await queryRunner.commitTransaction();
        } catch (e) {
          await queryRunner.rollbackTransaction();
          throw e;
        } finally {
          await queryRunner.release();
        }

        return {
          message: 'Your request is being processed',
          status: KYC_REQUEST_STATUS.PENDING,
        };
      } catch (e) {
        Logger.error('Failed to create user and KYC request', e.stack);
        throw new InternalServerErrorException('Failed to create user');
      }
    }

    const hasPendingKycRequest = await this.kycRequestRepository.findOne({
      where: {
        user: {
          id: activeUser.sub,
        },
        status: KYC_REQUEST_STATUS.PENDING,
      },
      relations: ['user'],
    });

    if (hasPendingKycRequest) {
      const errorMessage =
        'You already have a pending request for getting property owner role, please wait for the admin to review your request or contact support';
      Logger.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
    try {
      const queryRunner = await this.transactionHelper.start();
      try {
        const kycRequestRepo = queryRunner.manager.getRepository(KycRequest);
        const newKycRequest = kycRequestRepo.create({
          user: user,
          status: KYC_REQUEST_STATUS.PENDING,
          firstName: dto.firstName,
          lastName: dto.lastName,
          taxNumber: dto.taxNumber,
        });
        await kycRequestRepo.save(newKycRequest);

        const outboxRepo = queryRunner.manager.getRepository(OutboxEvent);
        const outboxEvent = outboxRepo.create({
          aggregateType: 'kyc-request',
          aggregateId: user.id,
          eventType: 'kyc.request.created',
          payload: {
            email: user.email,
            status: newKycRequest.status,
          },
        });
        await outboxRepo.save(outboxEvent);
        await queryRunner.commitTransaction();

        return {
          message: 'Your request is being processed',
          status: KYC_REQUEST_STATUS.PENDING,
        };
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw e;
      } finally {
        await queryRunner.release();
      }
    } catch (e) {
      Logger.error('Failed to create KYC request', e.stack);
      throw new InternalServerErrorException('Failed to create kyc request');
    }
  }

  async deleteAllUsers() {
    await this.userRepository.deleteAll();
  }
}
