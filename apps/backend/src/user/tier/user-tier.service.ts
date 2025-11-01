import { Injectable } from '@nestjs/common';
import { UserEventEmitter } from '../events/user-event.emitter';
import { UserWriteService } from '../write/user-write.service';
import { UserTier } from '../core/enum/user-tier.enum';
import { IUser } from '../core/entities/user.interface';

@Injectable()
export class UserTierService {
  constructor(
    private readonly userWriteService: UserWriteService,
    private readonly userEventEmitter: UserEventEmitter,
  ) {}

  public async updateUserTier(
    userId: string,
    newTier: UserTier,
  ): Promise<IUser> {
    const user = await this.userWriteService.update({
      id: userId,
      tier: newTier,
    });

    this.userEventEmitter.emitUserTierChanged({
      userId: userId,
      newTier: newTier,
    });

    return user;
  }
}
