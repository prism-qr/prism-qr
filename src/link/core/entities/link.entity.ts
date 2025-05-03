import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ILink } from './link.interface';

@Schema({ collection: 'links' })
export class LinkEntity {
  _id: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  destination: string;

  public static mapToInterface(link: LinkEntity): ILink {
    return {
      ...link,
      id: link._id.toString(),
    };
  }
}

export type LinkDocument = HydratedDocument<LinkEntity>;

export const LinkSchema = SchemaFactory.createForClass(LinkEntity);
