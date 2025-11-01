import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ILinkVisit } from './link-visit.interface';

@Schema({ collection: 'link-visit', timestamps: true })
export class LinkVisitEntity {
  _id: Types.ObjectId;

  @Prop()
  masterMenuId: string;

  @Prop()
  linkId: string;

  @Prop()
  referrer?: string;

  @Prop()
  languageHeader?: string;

  @Prop()
  ip?: string;

  @Prop()
  country?: string;

  @Prop()
  countryCode?: string;

  @Prop()
  city?: string;

  @Prop()
  lat?: number;

  @Prop()
  lon?: number;

  @Prop()
  createdAt: Date;

  public static mapToInterface(linkVisit: LinkVisitEntity): ILinkVisit {
    return {
      ...linkVisit,
      id: linkVisit._id.toString(),
    };
  }
}

export type LinkVisitDocument = HydratedDocument<LinkVisitEntity>;
export const LinkVisitSchema =
  SchemaFactory.createForClass(LinkVisitEntity);
