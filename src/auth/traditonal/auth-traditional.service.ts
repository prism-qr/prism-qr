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

@Injectable()
export class AuthTraditionalService {
  constructor(
    private readonly userWriteService: UserWriteService,
    private readonly userReadService: UserReadService,
    private readonly jwtService: CustomJwtService,
    private readonly emitter: AuthEventEmitter,
  ) {}

  public async register(dto: RegisterTraditionalDto): Promise<TokenResponse> {
    const passwordHash = await this.createPasswordHash(dto.password);
    const user = await this.userWriteService.create({
      email: dto.email,
      passwordHash,
      authMethod: AuthMethod.Traditional,
    });

    const token = await this.jwtService.sign({ id: user.id });

    this.emitter.emitUserRegisteredEvent({
      userId: user.id,
      authMethod: AuthMethod.Traditional,
      email: dto.email,
      emailAccepted: false,
    });

    return {
      token,
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

    const passwordMatches = await this.passwordMatchesHash(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const token = await this.jwtService.sign({ id: user.id });

    this.emitter.emitUserLoggedInEvent({ userId: user.id });

    return { token };
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
