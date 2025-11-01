import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IApiKey } from './api-key.interface';

@Schema({ collection: 'apiKeys', timestamps: true })
export class ApiKeyEntity {
  _id: Types.ObjectId;

  @Prop()
  prefix: string;

  @Prop()
  keyHash: string;

  @Prop()
  active: boolean;

  @Prop()
  linkId: string;

  public static mapToInterface(apiKey: ApiKeyEntity): IApiKey {
    return {
      ...apiKey,
      id: apiKey._id.toString(),
    };
  }
}

export type ApiKeyDocument = HydratedDocument<ApiKeyEntity>;

export const ApiKeySchema = SchemaFactory.createForClass(ApiKeyEntity);
