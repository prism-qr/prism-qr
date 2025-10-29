import { getEnvConfig } from 'src/shared/config/env-configs';
import { UserTier } from '../../user/core/enum/user-tier.enum';

export function mapTierToPriceId(tier: UserTier): string {
  switch (tier) {
    case UserTier.EarlyBird:
      return getEnvConfig().stripe.earlyBirdPriceId;
    default:
      throw new Error(`Invalid tier: ${tier}`);
  }
}
