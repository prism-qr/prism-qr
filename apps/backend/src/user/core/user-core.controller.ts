import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserReadService } from '../read/user-read.service';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserCoreController {
  constructor(private readonly userReadService: UserReadService) {}

  @Get('me')
  public async getCurrentUser(@CurrentUserId() userId: string) {
    const user = await this.userReadService.readByIdOrThrow(userId);
    return {
      email: user.email,
      authMethod: user.authMethod,
      tier: user.tier,
    };
  }
}
