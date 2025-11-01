import { Injectable, Logger } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import {
//   StripeEvents,
//   StripePaymentSucceededEvent,
// } from '../../payments/stripe/stripe-event.emitter';
// import { UserReadService } from '../read/user-read.service';
// import { UserWriteService } from '../write/user-write.service';

@Injectable()
export class UserCoreService {
  constructor() // private readonly userWriteService: UserWriteService, // private readonly userReadService: UserReadService,
  // private readonly logger: Logger,
  {}

  //   @OnEvent(StripeEvents.PaymentSucceeded)
  //   public async handlePaymentSucceeded(
  //     event: StripePaymentSucceededEvent,
  //   ): Promise<void> {
  //     const user = await this.userReadService.readByEmail(event.email);

  //     if (!user) {
  //       this.logger.error(`[STRIPE] User not found`, {
  //         email: event.email,
  //       });

  //       return;
  //     }

  //     await this.userWriteService.updateTrialUsed(user.id, true);
  //   }
}
