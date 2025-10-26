export enum UserTier {
  // free
  Free = 'free',

  // paid
  EarlyBird = 'early-bird',
  Basic = 'basic',

  // special
  Admin = 'admin',
}

export const purchasableTiers = [UserTier.EarlyBird];
export const paidTiers = [UserTier.EarlyBird, UserTier.Basic];
