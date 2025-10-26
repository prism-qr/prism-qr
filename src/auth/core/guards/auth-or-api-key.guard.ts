import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ApiKeyGuard } from './api-key.guard';

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: AuthGuard,
    private apiKeyGuard: ApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await this.apiKeyGuard.canActivate(context);
    } catch (error) {}

    return await this.jwtAuthGuard.canActivate(context);
  }
}
