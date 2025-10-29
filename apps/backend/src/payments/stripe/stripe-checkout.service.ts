import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { UserReadService } from '../../user/read/user-read.service';
import { AccountClaimStatus } from '../../user/core/enum/account-claim-status.enum';
import { UserTier } from '../../user/core/enum/user-tier.enum';
import { mapTierToPriceId } from './stripe-mapper';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class StripeCheckoutService {
  private readonly logger = new Logger(StripeCheckoutService.name);

  constructor(
    private readonly stripe: Stripe,
    private readonly userReadService: UserReadService,
  ) {}

  public async getCheckoutUrl(dto: {
    userId: string;
    tier: UserTier;
    isTrial: boolean;
  }): Promise<string> {
    this.logger.log(`[STRIPE] Initiating checkout for user`, {
      userId: dto.userId,
      tier: dto.tier,
      isTrial: dto.isTrial,
    });

    const user = await this.userReadService.readByIdOrThrow(dto.userId);

    if (!user) {
      this.logger.error(
        `[STRIPE] User not found while trying to initiate stripe checkout.`,
        {
          userId: dto.userId,
        },
      );
      throw new NotFoundException(
        `User not found while trying to initiate stripe checkout`,
      );
    }

    if (user.accountClaimStatus !== AccountClaimStatus.Claimed) {
      this.logger.error(
        `[STRIPE] User account not claimed while trying to initiate stripe checkout`,
        {
          userId: dto.userId,
        },
      );
      throw new Error(
        `User account not claimed while trying to initiate stripe checkout`,
      );
    }

    const checkoutSession = await this.stripe.checkout.sessions.create({
      customer_email: user.email,
      success_url: getEnvConfig().stripe.successUrl,
      mode: 'subscription',
      line_items: [
        {
          price: mapTierToPriceId(dto.tier),
          quantity: 1,
        },
      ],
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: dto.isTrial ? 30 : undefined,
        trial_settings: {
          end_behavior: { missing_payment_method: 'cancel' },
        },
      },
    });

    if (!checkoutSession.url) {
      this.logger.error(
        `[STRIPE] Checkout session contained no information for user`,
        {
          userId: dto.userId,
        },
      );

      throw new Error(`Failed to process payment for user: ${user.email}`);
    }

    return checkoutSession.url;
  }
}
