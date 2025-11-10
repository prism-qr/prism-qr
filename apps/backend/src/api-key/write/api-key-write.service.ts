import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiKeyEntity } from '../core/entities/api-key.entity';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { IApiKey } from '../core/entities/api-key.interface';
@Injectable()
export class ApiKeyWriteService {
  constructor(
    @InjectModel(ApiKeyEntity.name) private apiKeyModel: Model<ApiKeyEntity>,
  ) {}

  async create(linkId: string): Promise<{ apiKey: string; entity: IApiKey }> {
    const { plain, hash } = await this.generateAndHashApiKey();

    const apiKey = await this.apiKeyModel.create({
      keyHash: hash,
      prefix: plain.substring(0, 18),
      linkId,
    });

    return {
      apiKey: plain,
      entity: ApiKeyEntity.mapToInterface(apiKey.toObject()),
    };
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.apiKeyModel.deleteMany({ userId });
  }

  public async deleteById(keyId: string, linkId: string): Promise<void> {
    await this.apiKeyModel.deleteOne({ _id: keyId, linkId });
  }

  private async generateAndHashApiKey(): Promise<{
    plain: string;
    hash: string;
  }> {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const plainApiKey = `sk_live_${randomBytes}`; // Add prefix before hashing

    const saltRounds = 10;
    const hash = await bcrypt.hash(plainApiKey, saltRounds);

    return { plain: plainApiKey, hash };
  }
}
