import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyReadService } from '../read/api-key-read.service';

@Controller('')
@ApiTags('Api keys')
export class ApiKeyCoreController {
  constructor(private readonly apiKeyReadService: ApiKeyReadService) {}

  // @ApiBearerAuth()
  // @Get('users/:userId/api_keys')
  // @ApiResponse({ type: ApiKeySerialized, isArray: true })
  // public async getUserApiKeys(
  //   @Param('userId') userId: string,
  // ): Promise<ApiKeySerialized[]> {
  //   const apiKeys = await this.apiKeyReadService.readApiKeysByUserId(userId);

  //   return apiKeys.map((apiKey) => ApiKeySerializer.serialize(apiKey));
  // }
}
