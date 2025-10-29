import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthTraditionalService } from './auth-traditional.service';
import { LoginTraditionalDto } from './dto/login-traditional.dto';
import { Public } from '../core/decorators/is-public.decorator';
import { TokenResponse } from 'src/shared/responses/token.response';
import { RegisterTraditionalDto } from './dto/register-traditional.dto';

@Public()
@Controller('auth/traditional')
export class AuthTraditionalController {
  constructor(private readonly service: AuthTraditionalService) {}

  @Post('register')
  public async register(
    @Body() dto: RegisterTraditionalDto,
  ): Promise<TokenResponse> {
    return this.service.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: LoginTraditionalDto): Promise<TokenResponse> {
    return this.service.login(dto);
  }
}
