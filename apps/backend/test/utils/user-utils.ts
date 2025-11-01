import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LinkEntity } from 'src/link/core/entities/link.entity';
import { CreateLinkDto } from 'src/link/write/dto/create-link.dto';
import { newDateUTC } from 'src/shared/utils/date.utils';
import { UserEntity } from 'src/user/core/entities/user.entity';
import { AuthMethod } from 'src/user/core/enum/auth-method.enum';
import { UserTier } from 'src/user/core/enum/user-tier.enum';
import { CreateUserParams } from 'src/user/write/dto/create-user.dto';
import * as request from 'supertest';

export class LinkUtils {
  private readonly userModel: Model<UserEntity>;

  constructor(private readonly app: INestApplication<any>) {
    this.userModel = this.app.get(getModelToken(UserEntity.name));
  }

  async createDefaultUser(params?: Partial<CreateUserParams>) {
    const user = await this.userModel.create({
      destination: params?.email || 'https://example.com',
      passwordHash: params?.passwordHash || 'password',
      authMethod: params?.authMethod || AuthMethod.Traditional,
      lastActivityDate: newDateUTC(),
      tier: UserTier.Free,
    });
    return UserEntity.mapToInterface(user.toObject());
  }
}