import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyAuthService } from 'src/auth/api-key/api-key-auth.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private apiKeyAuthService: ApiKeyAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    const linkId = request.params.linkId;
    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }
    const isValid = await this.apiKeyAuthService.validateApiKey(apiKey, linkId);

    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  private extractApiKey(request: any): string | null {
    const headerKey = request.headers['x-api-key'];
    return headerKey ? headerKey : null;
  }
}
