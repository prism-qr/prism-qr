import { UserTier } from '../../user/core/enum/user-tier.enum';

interface UserPlanConfig {
  links: {
    maxNumberOfLinks: number;
  };
  apiKeys: {
    maxNumberOfApiKeys: number;
  };
}

export interface UserPlanConfigs {
  // free
  [UserTier.Free]: UserPlanConfig;

  // paid
  [UserTier.EarlyBird]: UserPlanConfig;

  // special
  [UserTier.Admin]: UserPlanConfig;
}

export const UserPlanConfigs: UserPlanConfigs = {
  // free
  [UserTier.Free]: {
    links: {
      maxNumberOfLinks: 1,
    },
    apiKeys: {
      maxNumberOfApiKeys: 5,
    },
  },

  // paid
  [UserTier.EarlyBird]: {
    links: {
      maxNumberOfLinks: 3,
    },
    apiKeys: {
      maxNumberOfApiKeys: 3,
    },
  },
  // special
  [UserTier.Admin]: {
    links: {
      maxNumberOfLinks: 20,
    },
    apiKeys: {
      maxNumberOfApiKeys: 20,
    },
  },
};

export function getUserPlanConfig(tier: UserTier): UserPlanConfig {
  return UserPlanConfigs[tier];
}
