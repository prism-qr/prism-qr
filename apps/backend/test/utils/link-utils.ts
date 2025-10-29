import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LinkEntity } from 'src/link/core/entities/link.entity';
import { CreateLinkDto } from 'src/link/write/dto/create-link.dto';
import * as request from 'supertest';

export class LinkUtils {
  private readonly linkModel: Model<LinkEntity>;

  constructor(private readonly app: INestApplication<any>) {
    this.linkModel = this.app.get(getModelToken(LinkEntity.name));
  }

  async createLink(dto?: Partial<CreateLinkDto>) {
    const link = await this.linkModel.create({
      name: dto?.name || 'default',
      destination: dto?.destination || 'https://example.com',
    });
    return LinkEntity.mapToInterface(link.toObject());
  }
}
