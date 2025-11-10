import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { UserEntity } from '../core/entities/user.entity';
import { CreateUserParams } from './dto/create-user.dto';
import { IUser } from '../core/entities/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserTier } from '../core/enum/user-tier.enum';
import { UserEventEmitter } from '../events/user-event.emitter';
import { newDateUTC } from 'src/shared/utils/date.utils';
import { randomBytes } from 'crypto';

@Injectable()
export class UserWriteService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly userEventEmitter: UserEventEmitter,
  ) {}

  public async create(params: CreateUserParams): Promise<IUser> {
    try {
      const emailConfirmationToken = this.generateEmailConfirmationToken();

      const user = await this.userModel.create({
        email: params.email,
        passwordHash: params.passwordHash,
        emailConfirmed: false,
        emailConfirmationToken,
        authMethod: params.authMethod,
        lastActivityDate: newDateUTC(),
        tier: UserTier.Free,
      });

      return UserEntity.mapToInterface(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  public async update(dto: UpdateUserDto): Promise<IUser> {
    const updateQuery: UpdateQuery<UserEntity> = {};

    if (dto.email) {
      updateQuery.email = dto.email;
    }

    if (dto.authMethod) {
      updateQuery.authMethod = dto.authMethod;
    }

    if (dto.accountClaimStatus) {
      updateQuery.accountClaimStatus = dto.accountClaimStatus;
    }

    if (dto.tier) {
      updateQuery.tier = dto.tier;
    }

    if (dto.stripeCustomerId) {
      updateQuery.stripeCustomerId = dto.stripeCustomerId;
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(dto.id) },
      updateQuery,
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(
        `User with id ${dto.id} not found for update`,
      );
    }

    return UserEntity.mapToInterface(user);
  }

  public async updateLastActivityDate(
    userId: string,
    date: Date,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { lastActivityDate: date },
    );
  }

  public async delete(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: new Types.ObjectId(userId) });
  }

  public async updateTrialUsed(
    userId: string,
    trialUsed: boolean,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $set: { 'paymentsMetadata.trialUsed': trialUsed } },
    );
  }

  public async updateUserTier(
    userId: string,
    newTier: UserTier,
  ): Promise<IUser> {
    const user = await this.update({
      id: userId,
      tier: newTier,
    });

    this.userEventEmitter.emitUserTierChanged({
      userId: userId,
      newTier: newTier,
    });

    return user;
  }

  public async confirmEmail(token: string): Promise<IUser | null> {
    const user = await this.userModel.findOne({
      emailConfirmationToken: token,
    });

    if (!user) {
      return null;
    }

    user.emailConfirmed = true;
    user.emailConfirmationToken = undefined;
    await user.save();

    return UserEntity.mapToInterface(user);
  }

  private generateEmailConfirmationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
