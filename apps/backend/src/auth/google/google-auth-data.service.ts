import { Injectable } from '@nestjs/common';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class GoogleAuthDataService {
  public async getAccessToken(
    code: string,
    forceLocalLogin?: boolean,
  ): Promise<string> {
    const config = getEnvConfig().google;

    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: decodeURIComponent(code),
        grant_type: 'authorization_code',
        redirect_uri: forceLocalLogin
          ? config.redirectUriAlternative!
          : config.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to get Google access token: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error(
        `Access token not found in Google response: ${JSON.stringify(data)}`,
      );
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
      const errorData = await response.json();
      throw new Error(
        `Failed to get Google user info: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const user = await response.json();

    if (!user.email) {
      throw new Error(
        `Email not found in Google user info: ${JSON.stringify(user)}`,
      );
    }

    return { email: user.email, avatar: user.picture };
  }
}
