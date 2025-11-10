import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyWriteService } from '../write/api-key-write.service';
import { JwtAuthGuard } from 'src/auth/core/guards/jwt-auth.guard';
import { ApiKeyReadService } from '../read/api-key-read.service';
import { IApiKey } from './entities/api-key.interface';

@Controller('')
export class ApiKeyCoreController {
  constructor(
    private readonly apiKeyWriteService: ApiKeyWriteService,
    private readonly apiKeyReadService: ApiKeyReadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('links/:linkId/api_key')
  public async getApiKey(
    @Param('linkId') linkId: string,
  ): Promise<{ apiKey: string }> {
    const apiKeyCount = await this.apiKeyReadService.countByLinkId(linkId);

    const MAX_API_KEYS_PER_LINK = 5;

    if (apiKeyCount >= MAX_API_KEYS_PER_LINK) {
      throw new ForbiddenException(
        'Cannot create more API keys. Maximum limit reached.',
      );
    }
    const apiKey = await this.apiKeyWriteService.create(linkId);

    return { apiKey: apiKey.apiKey };
  }

  @UseGuards(JwtAuthGuard)
  @Get('links/:linkId/api_keys')
  public async listApiKeys(
    @Param('linkId') linkId: string,
  ): Promise<IApiKey[]> {
    return this.apiKeyReadService.readApiKeysByLinkId(linkId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('links/:linkId/api_keys/:keyId')
  public async deleteApiKey(
    @Param('linkId') linkId: string,
    @Param('keyId') keyId: string,
  ): Promise<{ success: boolean }> {
    await this.apiKeyWriteService.deleteById(keyId, linkId);
    return { success: true };
  }
}
