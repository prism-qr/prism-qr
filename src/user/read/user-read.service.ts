import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../core/entities/user.entity';
import { IUser } from '../core/entities/user.interface';
import { AccountClaimStatus } from '../core/enum/account-claim-status.enum';

@Injectable()
export class UserReadService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  public async readByIdOrThrow(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).lean<UserEntity>().exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return UserEntity.mapToInterface(user);
  }

  public async readByEmail(email: string): Promise<IUser | null> {
    const user = await this.userModel
      .findOne({ email })
      .lean<UserEntity>()
      .exec();

    return user ? UserEntity.mapToInterface(user) : null;
  }

  public async readByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<IUser | null> {
    const user = await this.userModel
      .findOne({ stripeCustomerId })
      .lean<UserEntity>()
      .exec();

    return user ? UserEntity.mapToInterface(user) : null;
  }

  public async *readUnclaimedUserIdsCreatedBeforeCursor(
    date: Date,
  ): AsyncGenerator<string> {
    const cursor = this.userModel
      .find({
        accountClaimStatus: AccountClaimStatus.Anonymous,
        createdAt: { $lt: date },
      })
      .lean<UserEntity>()
      .cursor();

    for await (const user of cursor) {
      yield user._id.toString();
    }
  }

  public async readAll(): Promise<IUser[]> {
    const users = await this.userModel.find().lean<UserEntity[]>().exec();

    return users.map((user) => UserEntity.mapToInterface(user));
  }
}
