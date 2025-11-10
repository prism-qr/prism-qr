import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AuthMethod } from '../enum/auth-method.enum';
import { AccountClaimStatus } from '../enum/account-claim-status.enum';
import { UserTier } from '../enum/user-tier.enum';
import { IUser } from './user.interface';

export interface PaymentsMetadata {
  trialUsed?: boolean;
}

@Schema({ collection: 'users', timestamps: true })
export class UserEntity {
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  authMethod?: AuthMethod;

  @Prop()
  passwordHash?: string;

  @Prop()
  emailConfirmed: boolean;

  @Prop()
  emailConfirmationToken?: string;

  @Prop()
  accountClaimStatus: AccountClaimStatus;

  @Prop({ type: Date })
  lastActivityDate: Date;

  @Prop()
  tier: UserTier;

  @Prop()
  stripeCustomerId?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object, default: {} })
  paymentsMetadata: PaymentsMetadata;

  public static mapToInterface(user: UserEntity | UserDocument): IUser {
    const plainUser = (user as any).toObject ? (user as any).toObject() : user;
    return {
      ...plainUser,
      id: user._id.toString(),
    };
  }
}

export type UserDocument = HydratedDocument<UserEntity>;

export const UserSchema = SchemaFactory.createForClass(UserEntity);
