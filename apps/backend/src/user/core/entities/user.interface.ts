import { AccountClaimStatus } from '../enum/account-claim-status.enum';
import { AuthMethod } from '../enum/auth-method.enum';
import { UserTier } from '../enum/user-tier.enum';
import { PaymentsMetadata } from './user.entity';

export interface IUser {
  id: string;
  email: string;
  authMethod?: AuthMethod;
  passwordHash?: string;
  emailConfirmed: boolean;
  emailConfirmationToken?: string;
  accountClaimStatus: AccountClaimStatus;
  tier: UserTier;
  stripeCustomerId?: string;
  paymentsMetadata: PaymentsMetadata;
}
