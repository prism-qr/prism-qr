import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserWriteService } from '../../user/write/user-write.service';
import { LoginTraditionalDto } from './dto/login-traditional.dto';
import { UserReadService } from '../../user/read/user-read.service';
import { AuthMethod } from '../../user/core/enum/auth-method.enum';
import { CustomJwtService } from '../custom-jwt/custom-jwt.service';
import { AuthEventEmitter } from '../events/auth-event.emitter';
import { TokenResponse } from 'src/shared/responses/token.response';
import { RegisterTraditionalDto } from './dto/register-traditional.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { RegistrationResponse } from 'src/shared/responses/registration.response';

@Injectable()
export class AuthTraditionalService {
  constructor(
    private readonly userWriteService: UserWriteService,
    private readonly userReadService: UserReadService,
    private readonly jwtService: CustomJwtService,
    private readonly emitter: AuthEventEmitter,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  public async register(
    dto: RegisterTraditionalDto,
  ): Promise<RegistrationResponse> {
    const passwordHash = await this.createPasswordHash(dto.password);
    const user = await this.userWriteService.create({
      email: dto.email,
      passwordHash,
      authMethod: AuthMethod.Traditional,
    });

    this.emitter.emitUserRegisteredEvent({
      userId: user.id,
      authMethod: AuthMethod.Traditional,
      email: dto.email,
      emailAccepted: false,
    });

    await this.emailConfirmationService.sendConfirmationEmail(
      user.email,
      user.emailConfirmationToken!,
    );

    return {
      message:
        'Registration successful. Please check your email to confirm your account.',
    };
  }

  public async login(dto: LoginTraditionalDto): Promise<TokenResponse> {
    const user = await this.userReadService.readByEmail(dto.email);

    if (
      !user ||
      user.authMethod !== AuthMethod.Traditional ||
      !user.passwordHash
    ) {
      throw new UnauthorizedException();
    }

    if (!user.emailConfirmed) {
      throw new UnauthorizedException(
        'Please confirm your email before logging in.',
      );
    }

    const passwordMatches = await this.passwordMatchesHash(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const token = await this.jwtService.sign({ id: user.id });

    this.emitter.emitUserLoggedInEvent({ userId: user.id });

    return { token, isNewUser: false };
  }

  public async confirmEmail(token: string): Promise<TokenResponse> {
    const user = await this.userWriteService.confirmEmail(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired confirmation token.');
    }

    const jwtToken = await this.jwtService.sign({ id: user.id });

    return { token: jwtToken, isNewUser: true };
  }

  private async passwordMatchesHash(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private async createPasswordHash(password: string): Promise<string> {
    const saltRounds = 10;

    return bcrypt.hash(password, saltRounds);
  }
}
