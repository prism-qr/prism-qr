import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiKeyEntity } from '../core/entities/api-key.entity';
import { Model } from 'mongoose';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { IApiKey } from '../core/entities/api-key.interface';
@Injectable()
export class ApiKeyWriteService {
  constructor(
    @InjectModel(ApiKeyEntity.name) private apiKeyModel: Model<ApiKeyEntity>,
  ) {}

  async generateApiKey(
    userId: string,
  ): Promise<{ apiKey: string; entity: IApiKey }> {
    const { plain, hash } = await this.createRandomApiKey();

    const apiKey = await this.apiKeyModel.create({
      keyHash: hash,
      keyPrefix: plain.substring(0, 18), // "sk_live_a1b2c3d4e5"
      userId,
    });

    return { apiKey: plain, entity: ApiKeyEntity.mapToInterface(apiKey) };
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.apiKeyModel.deleteMany({ userId });
  }

  private async createRandomApiKey(): Promise<{ plain: string; hash: string }> {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const plainApiKey = `sk_live_${randomBytes}`; // Add prefix before hashing

    const saltRounds = 10;
    const hash = await bcrypt.hash(plainApiKey, saltRounds);

    return { plain: plainApiKey, hash };
  }
}
