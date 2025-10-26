import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyAuthService } from 'src/auth/api-key/api-key-auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyAuthService: ApiKeyAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const client = await this.apiKeyAuthService.validateApiKey(apiKey);

    if (!client) {
      throw new UnauthorizedException('Invalid API key');
    }

    request.user = client;
    return true;
  }

  private extractApiKey(request: any): string | null {
    const headerKey = request.headers['api-key'];
    return headerKey ? headerKey : null;
  }
}
