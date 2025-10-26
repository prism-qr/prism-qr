import { ApiProperty } from '@nestjs/swagger';

export class IApiKey {
  id: string;
  prefix: string;
  keyHash: string;
  userId: string;
}
