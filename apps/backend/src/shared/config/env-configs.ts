import { getOurEnv, OurEnv } from '../types/our-env.enum';

interface EnvConfig {
  internal: {
    backendUrl: string;
    frontendUrl: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    redirectUriAlternative?: string;
  };
  mongo: {
    uri: string;
  };
  auth: {
    jwtSecret: string;
  };
  admin: {
    secretAdminKey: string;
  };
  telegram: {
    token: string;
    chatId: string;
  };
}

interface EnvConfigs {
  [OurEnv.Prod]: EnvConfig;
  [OurEnv.Dev]: EnvConfig;
}

export const EnvConfigs: EnvConfigs = {
  [OurEnv.Prod]: {
    telegram: {
      token: process.env.TELEGRAM_TOKEN!,
      chatId: '-1002637928179',
    },
    internal: {
      backendUrl: 'https://prodprismqr.bieda.it',
      frontendUrl: 'https://prismqr.com',
    },
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirectUri: 'https://prismqr.com/app/callbacks/oauth/google',
    },
    mongo: {
      uri: process.env.MONGO_URI!,
    },
    auth: {
      jwtSecret: process.env.AUTH_JWT_SECRET!,
    },
    admin: {
      secretAdminKey: process.env.ADMIN_SECRET_ADMIN_KEY!,
    },
  },
  [OurEnv.Dev]: {
    internal: {
      backendUrl: 'https://devprismqr.bieda.it',
      frontendUrl: 'https://dev.prismqr.com',
    },
    telegram: {
      token: process.env.TELEGRAM_TOKEN!,
      chatId: '-1002535913992',
    },
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirectUri: 'https://dev.prismqr.com/app/callbacks/oauth/google',
      redirectUriAlternative:
        'http://localhost:5173/app/callbacks/oauth/google-alternative',
    },
    mongo: {
      uri: process.env.MONGO_URI!,
    },
    auth: {
      jwtSecret: process.env.AUTH_JWT_SECRET!,
    },

    admin: {
      secretAdminKey: process.env.ADMIN_SECRET_ADMIN_KEY!,
    },
  },
};

export function getEnvConfig(): EnvConfig {
  const env = getOurEnv();
  return EnvConfigs[env];
}
