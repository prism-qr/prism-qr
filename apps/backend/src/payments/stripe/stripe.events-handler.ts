import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripePaymentSucceededHandler } from './stripe.payment-succeeded.handler';
import { StripeSubscriptionDeletedHandler } from './stripe.subscription-deleted.handler';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class StripeEventsHandler {
  private readonly logger = new Logger(StripeEventsHandler.name);
  constructor(
    private readonly stripe: Stripe,
    private readonly stripePaymentSucceededHandler: StripePaymentSucceededHandler,
    private readonly stripeSubscriptionDeletedHandler: StripeSubscriptionDeletedHandler,
  ) {}

  public decryptEvent(body: any, signature: string): any {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        getEnvConfig().stripe.signature,
      );
    } catch (error) {
      this.logger.log('[STRIPE] Error while getting stripe event', { error });
    }
  }

  public async handleEvent(event: Stripe.Event): Promise<void> {
    this.logger.log(`[STRIPE] Handling stripe event`, { event });

    if (event.type === 'invoice.payment_succeeded') {
      return await this.stripePaymentSucceededHandler.handle(event);
    }

    if (event.type === 'customer.subscription.deleted') {
      return await this.stripeSubscriptionDeletedHandler.handle(event);
    }
  }
}
