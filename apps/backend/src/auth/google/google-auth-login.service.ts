import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CustomJwtService } from '../custom-jwt/custom-jwt.service';
import { UserReadService } from '../../user/read/user-read.service';
import { UserWriteService } from '../../user/write/user-write.service';
import { AuthMethod } from '../../user/core/enum/auth-method.enum';
import { AuthEventEmitter } from '../events/auth-event.emitter';
import { GoogleLoginBody } from './dto/google-login.body';
import { GoogleAuthDataService } from './google-auth-data.service';
import { TokenResponse } from 'src/shared/responses/token.response';

@Injectable()
export class GoogleAuthLoginService {
  private readonly logger = new Logger(GoogleAuthLoginService.name);

  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly userReadService: UserReadService,
    private readonly userWriteService: UserWriteService,
    private readonly emitter: AuthEventEmitter,
    private readonly authGoogleDataService: GoogleAuthDataService,
  ) {}

  public async login(dto: GoogleLoginBody): Promise<TokenResponse> {
    this.logger.log(`Logging user in... with dto: ${JSON.stringify(dto)}`);

    const accessToken = await this.authGoogleDataService.getAccessToken(
      dto.googleCode,
      dto.forceLocalLogin,
    );

    const { email, avatar } =
      await this.authGoogleDataService.getGoogleEmailAndAvatar(accessToken);

    const user = await this.userReadService.readByEmail(email);

    this.logger.log(`After reading user by email`, { email, userId: user?.id });

    if (!user && !dto.termsAccepted) {
      this.logger.warn('Cannot create new account without accepting terms');
      throw new BadRequestException(
        'Cannot create new account without accepting terms',
      );
    }

    if (user === null) {
      const user = await this.userWriteService.create({
        authMethod: AuthMethod.Google,
        email,
      });

      this.logger.log(`Created new user`, { email, userId: user.id });

      this.emitter.emitUserRegisteredEvent({
        authMethod: AuthMethod.Google,
        email,
        userId: user.id,
        emailAccepted: dto.emailAccepted || false,
      });

      return {
        token: await this.jwtService.sign({ id: user.id }),
      };
    }

    this.logger.log(`Logged in existing user`, { email, userId: user.id });

    return {
      token: await this.jwtService.sign({ id: user.id }),
    };
  }
}
