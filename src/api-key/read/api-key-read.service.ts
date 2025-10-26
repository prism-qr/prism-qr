import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKeyEntity } from '../core/entities/api-key.entity';
import { IApiKey } from '../core/entities/api-key.interface';

@Injectable()
export class ApiKeyReadService {
  constructor(
    @InjectModel(ApiKeyEntity.name) private apiKeyModel: Model<ApiKeyEntity>,
  ) {}

  // private async apiKeyMatchesHash(
  //   apiKey: string,
  //   apiKeyHash: string,
  // ): Promise<boolean> {
  //   return bcrypt.compare(apiKey, apiKeyHash);
  // }

  public async readApiKeysByUserId(userId: string): Promise<IApiKey[]> {
    const apiKeys = await this.apiKeyModel
      .find({ userId })
      .lean<ApiKeyEntity[]>()
      .exec();

    return apiKeys.map((apiKey) => ApiKeyEntity.mapToInterface(apiKey));
  }

  public async readApiKeyByHash(keyHash: string): Promise<IApiKey> {
    const apiKey = await this.apiKeyModel
      .find({ keyHash })
      .lean<ApiKeyEntity>()
      .exec();

    return ApiKeyEntity.mapToInterface(apiKey);
  }

  // public async readUserId(apiKeyValue: string): Promise<string | null> {
  //   const apiKey = await this.apiKeyReadService.readApiKeyByValue(apiKeyValue);

  //   if (!apiKey) {
  //     await this.redisService.set(cacheKey, NON_EXISTENT, cacheTtlSeconds);
  //     this.logger.error(`API key not found`, { apiKeyValue });
  //     return null;
  //   }

  //   await this.redisService.set(cacheKey, apiKey.projectId, cacheTtlSeconds);

  //   return apiKey.projectId;
  // }
}
