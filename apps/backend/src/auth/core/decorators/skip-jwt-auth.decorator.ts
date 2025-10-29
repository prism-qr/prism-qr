import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_AUTH_KEY = 'skipJwtAuth';
export const SkipJwtAuth = () => SetMetadata(SKIP_JWT_AUTH_KEY, true);
