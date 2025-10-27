import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CustomJwtService } from '../../custom-jwt/custom-jwt.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { SKIP_JWT_AUTH_KEY } from '../decorators/skip-jwt-auth.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: CustomJwtService,
    private reflector: Reflector,
  ) {}

  public async canActivate(
    context: ExecutionContext,
    skipDecorators = false,
  ): Promise<boolean> {
    if (!skipDecorators) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      const skipJwtAuth = this.reflector.getAllAndOverride<boolean>(
        SKIP_JWT_AUTH_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (skipJwtAuth) {
        return true;
      }
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException();
    }
    const payload = await this.jwtService.getTokenPayload(token);

    if (!payload) {
      throw new ForbiddenException();
    }

    request['user'] = payload;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as any).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
