import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class GoogleAuthDataService {
  private readonly logger = new Logger(GoogleAuthDataService.name);

  public async getAccessToken(
    code: string,
    forceLocalLogin?: boolean,
  ): Promise<string> {
    const payload = {
      client_id: getEnvConfig().google.clientId,
      client_secret: getEnvConfig().google.clientSecret,
      code: decodeURIComponent(code),
      grant_type: 'authorization_code',
      redirect_uri: forceLocalLogin
        ? getEnvConfig().google.redirectUriAlternative!
        : getEnvConfig().google.redirectUri,
    };

    this.logger.log(`Exchanging code with Google`, {
      client_id: payload.client_id,
      redirect_uri: payload.redirect_uri,
      forceLocalLogin,
      codeLength: code.length,
    });

    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`Google token request failed: ${response.status}`, {
        errorBody,
      });
      throw new BadRequestException('Failed to authenticate with Google');
    }

    const data = await response.json();

    if (!data.access_token) {
      this.logger.error('Access token not found in Google response');
      throw new BadRequestException('Failed to authenticate with Google');
    }

    return data.access_token;
  }

  public async getGoogleEmailAndAvatar(
    accessToken: string,
  ): Promise<{ email: string; avatar: string }> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      this.logger.error(`Google userinfo request failed: ${response.status}`);
      throw new BadRequestException(
        'Failed to retrieve user information from Google',
      );
    }

    const user = await response.json();

    if (!user.email) {
      this.logger.error('Email not found in Google response');
      throw new BadRequestException('Email not provided by Google');
    }

    return { email: user.email, avatar: user.picture };
  }
}
