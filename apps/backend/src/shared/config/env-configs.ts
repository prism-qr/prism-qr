import { getOurEnv, OurEnv } from '../types/our-env.enum';

interface EnvConfig {
  internal: {
    backendUrl: string;
  };
  stripe: {
    earlyBirdPriceId: string;
    successUrl: string;
    returnFromBillingUrl: string;
    apiKeySecret: string;
    signature: string;
  };
  anonymousAccounts: {
    removeAfterHours: number;
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
    superSecretAdminKey: string;
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
      backendUrl: 'https://qrcode.com',
    },
    stripe: {
      earlyBirdPriceId: process.env.STRIPE_EARLY_BIRD_PRICE_ID!,
      successUrl: 'https://logdash.io/app/callbacks/payments/purchase-success',
      returnFromBillingUrl: 'https://logdash.io/app/clusters',
      apiKeySecret: process.env.STRIPE_API_KEY_SECRET!,
      signature: process.env.STRIPE_SIGNATURE!,
    },
    anonymousAccounts: {
      removeAfterHours: 24 * 7, // 7 days
    },
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirectUri: 'https://logdash.io/app/callbacks/oauth/google',
    },
    mongo: {
      uri: process.env.MONGO_URI!,
    },
    auth: {
      jwtSecret: process.env.AUTH_JWT_SECRET!,
    },
    admin: {
      superSecretAdminKey: process.env.ADMIN_SUPER_SECRET_ADMIN_KEY!,
    },
  },
  [OurEnv.Dev]: {
    internal: {
      backendUrl: 'localhost:3003',
    },
    telegram: {
      token: process.env.TELEGRAM_TOKEN!,
      chatId: '-1002535913992',
    },
    stripe: {
      earlyBirdPriceId: process.env.STRIPE_EARLY_BIRD_PRICE_ID!,
      successUrl:
        'https://dev.logdash.io/app/callbacks/payments/purchase-success',
      returnFromBillingUrl: 'https://dev.logdash.io/app/clusters',
      apiKeySecret: process.env.STRIPE_API_KEY_SECRET!,
      signature: process.env.STRIPE_SIGNATURE!,
    },
    anonymousAccounts: {
      removeAfterHours: 24 * 7, // 7 days
    },
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirectUri: 'https://dev.logdash.io/app/callbacks/oauth/google',
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
      superSecretAdminKey: process.env.ADMIN_SUPER_SECRET_ADMIN_KEY!,
    },
  },
};

export function getEnvConfig(): EnvConfig {
  const env = getOurEnv();
  return EnvConfigs[env];
}
