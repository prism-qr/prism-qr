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

  public async readById(id: string): Promise<ILink> {
    const link = await this.linkModel.findById(id).lean<LinkEntity>();
    if (!link) {
      throw new NotFoundException();
    }

    return LinkEntity.mapToInterface(link);
  }

  public async readByName(name: string): Promise<ILink | null> {
    const link = await this.linkModel.findOne({ name }).lean<LinkEntity>();
    if (!link) {
      return null;
    }

    return LinkEntity.mapToInterface(link);
  }

  public async readByUserId(userId: string): Promise<ILink[]> {
    const links = await this.linkModel
      .find({ userId })
      .lean<LinkEntity[]>()
      .exec();

    return links.map((link) => LinkEntity.mapToInterface(link));
  }

  public async countByUserId(userId: string): Promise<number> {
    return await this.linkModel.countDocuments({ userId }).exec();
  }
}
