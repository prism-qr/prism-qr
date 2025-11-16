import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { AuthTraditionalService } from './auth-traditional.service';
import { LoginTraditionalDto } from './dto/login-traditional.dto';
import { Public } from '../core/decorators/is-public.decorator';
import { TokenResponse } from 'src/shared/responses/token.response';
import { RegisterTraditionalDto } from './dto/register-traditional.dto';
import { RegistrationResponse } from 'src/shared/responses/registration.response';
import { getEnvConfig } from 'src/shared/config/env-configs';
import { Throttle } from '@nestjs/throttler';

@Public()
@Controller('auth/traditional')
export class AuthTraditionalController {
  constructor(private readonly service: AuthTraditionalService) {}

  @Throttle({ heavy: { limit: 10, ttl: 60000 } })
  @Post('register')
  public async register(
    @Body() dto: RegisterTraditionalDto,
  ): Promise<RegistrationResponse> {
    return this.service.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: LoginTraditionalDto): Promise<TokenResponse> {
    return this.service.login(dto);
  }

  @Get('confirm-email')
  @Redirect()
  public async confirmEmail(
    @Query('token') token: string,
  ): Promise<{ url: string }> {
    const tokenResponse = await this.service.confirmEmail(token);
    const frontendUrl = getEnvConfig().internal.frontendUrl;

    return {
      url: `${frontendUrl}/auth/email-confirmed?token=${tokenResponse.token}&success=true`,
    };
  }
}
