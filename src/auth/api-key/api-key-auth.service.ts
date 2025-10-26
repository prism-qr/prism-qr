import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiKeyReadService } from 'src/api-key/read/api-key-read.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyAuthService {
  constructor(private readonly apiKeyReadService: ApiKeyReadService) {}

  async validateApiKey(apiKey: string): Promise<any> {
    if (!apiKey) return null;

    const hashedKey = await this.hashApiKey(apiKey);

    const key = await this.apiKeyReadService.readApiKeyByHash(hashedKey);

    if (!key) return null;

    return {
      userId: key.userId,
    };
  }

  // async generateApiKey(clientId: string): Promise<string> {
  //   const apiKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
  //   const hashedKey = this.hashApiKey(apiKey);

  //   await this.apiKeyRepo.save({
  //     keyHash: hashedKey,
  //     client: { id: clientId },
  //     isActive: true,
  //   });

  //   return apiKey;
  // }

  private hashApiKey(apiKey: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(apiKey, saltRounds);
  }
}
