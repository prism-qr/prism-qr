import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthLoginService } from './google-auth-login.service';
import { GoogleLoginBody } from './dto/google-login.body';
import { TokenResponse } from '../../shared/responses/token.response';
import { Public } from '../core/decorators/is-public.decorator';
import { Throttle } from '@nestjs/throttler';

@Public()
@Controller('auth/google')
@ApiTags('Auth (google)')
export class GoogleAuthController {
  constructor(private readonly loginService: GoogleAuthLoginService) {}

  @Throttle({ heavy: { limit: 10, ttl: 60000 } })
  @Post('login')
  @ApiResponse({ type: TokenResponse })
  public async login(@Body() payload: GoogleLoginBody): Promise<TokenResponse> {
    return this.loginService.login(payload);
  }
}
