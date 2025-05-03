import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkEntity } from '../core/entities/link.entity';
import { Model } from 'mongoose';
import { ILink } from '../core/entities/link.interface';

@Injectable()
export class LinkReadService {
  constructor(
    @InjectModel(LinkEntity.name) private linkModel: Model<LinkEntity>,
  ) {}

  async readById(id: string): Promise<ILink> {
    const link = await this.linkModel.findById(id).lean<LinkEntity>();
    if (!link) {
      throw new NotFoundException();
    }

    return LinkEntity.mapToInterface(link);
  }

  async readByName(name: string): Promise<ILink> {
    const link = await this.linkModel.findOne({ name }).lean<LinkEntity>();
    if (!link) {
      throw new NotFoundException();
    }

    return LinkEntity.mapToInterface(link);
  }
}
