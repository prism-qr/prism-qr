import { Injectable, Logger } from '@nestjs/common';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class GoogleAuthDataService {
  private readonly logger = new Logger(GoogleAuthDataService.name);

  public async getAccessToken(
    code: string,
    forceLocalLogin?: boolean,
  ): Promise<string> {
    const config = getEnvConfig().google;
    const redirectUri = forceLocalLogin
      ? config.redirectUriAlternative!
      : config.redirectUri;

    this.logger.log(
      `Getting access token with redirectUri: ${redirectUri}, forceLocalLogin: ${forceLocalLogin}`,
    );

    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const errorData: any = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      this.logger.error(
        `Google OAuth token error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
      throw new Error(
        `Failed to get Google access token: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const data: any = await response.json();

    if (!data.access_token) {
      this.logger.error(
        `Access token not found in response: ${JSON.stringify(data)}`,
      );
      throw new Error(
        `Access token not found in Google response: ${JSON.stringify(data)}`,
      );
    }

    return data.access_token as string;
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
      const errorData = await response.json();
      throw new Error(
        `Failed to get Google user info: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const user: any = await response.json();

    if (!user.email) {
      throw new Error(
        `Email not found in Google user info: ${JSON.stringify(user)}`,
      );
    }

    return { email: user.email as string, avatar: user.picture as string };
  }
}
