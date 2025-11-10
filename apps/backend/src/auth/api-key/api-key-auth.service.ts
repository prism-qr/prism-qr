import { Injectable } from '@nestjs/common';
import { ApiKeyReadService } from 'src/api-key/read/api-key-read.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyAuthService {
  constructor(private readonly apiKeyReadService: ApiKeyReadService) {}

  async validateApiKey(apiKey: string, linkId: string): Promise<boolean> {
    const apiKeys =
      await this.apiKeyReadService.readApiKeysWithHashByLinkId(linkId);
    console.log(apiKeys);
    const matches = await Promise.all(
      apiKeys.map((key) => this.apiKeyMatchesHash(apiKey, key.keyHash)),
    );

    return matches.some(Boolean);
  }

  // private hashApiKey(apiKey: string): Promise<string> {
  //   const saltRounds = 10;
  //   return bcrypt.hash(apiKey, saltRounds);
  // }

  private async apiKeyMatchesHash(
    apiKey: string,
    apiKeyHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(apiKey, apiKeyHash);
  }
}
