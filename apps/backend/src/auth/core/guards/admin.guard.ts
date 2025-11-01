import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class AdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminKey = request.headers['super-secret-admin-key'];

    if (adminKey !== getEnvConfig().admin.secretAdminKey) {
      throw new UnauthorizedException('Invalid admin key');
    }

    return true;
  }
}
