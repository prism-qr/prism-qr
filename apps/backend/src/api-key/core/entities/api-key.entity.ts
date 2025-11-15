import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IApiKey } from './api-key.interface';

@Schema({ collection: 'api-keys', timestamps: true })
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
      id: apiKey._id.toString(),
      prefix: apiKey.prefix,
      linkId: apiKey.linkId,
      createdAt: apiKey['createdAt'],
      updatedAt: apiKey['updatedAt'],
    };
  }
}

export type ApiKeyDocument = HydratedDocument<ApiKeyEntity>;

export const ApiKeySchema = SchemaFactory.createForClass(ApiKeyEntity);
