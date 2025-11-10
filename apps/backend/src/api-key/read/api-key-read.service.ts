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

  public async readApiKeysByLinkId(linkId: string): Promise<IApiKey[]> {
    const apiKeys = await this.apiKeyModel
      .find({ linkId })
      .lean<ApiKeyEntity[]>()
      .exec();

    return apiKeys.map((apiKey) => ApiKeyEntity.mapToInterface(apiKey));
  }

  public async readApiKeysWithHashByLinkId(
    linkId: string,
  ): Promise<Array<IApiKey & { keyHash: string }>> {
    const apiKeys = await this.apiKeyModel
      .find({ linkId })
      .lean<ApiKeyEntity[]>()
      .exec();

    return apiKeys.map((apiKey) => ({
      ...ApiKeyEntity.mapToInterface(apiKey),
      keyHash: apiKey.keyHash,
    }));
  }

  public async readApiKeyByHash(keyHash: string): Promise<IApiKey | null> {
    const apiKey = await this.apiKeyModel
      .findOne({ keyHash })
      .lean<ApiKeyEntity>()
      .exec();

    if (!apiKey) return null;

    return ApiKeyEntity.mapToInterface(apiKey);
  }

  public async countByLinkId(linkId: string): Promise<number> {
    return await this.apiKeyModel.countDocuments({ linkId }).exec();
  }
}
