import { Model, Types, UpdateQuery } from 'mongoose';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkEntity } from '../core/entities/link.entity';
import { ILink } from '../core/entities/link.interface';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class LinkWriteService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(LinkEntity.name) private linkModel: Model<LinkEntity>,
  ) {}

  async create(dto: CreateLinkDto, userId: string): Promise<ILink> {
    try {
      const link = await this.linkModel.create({
        name: dto.name,
        destination: dto.destination,
        userId,
      });

      return LinkEntity.mapToInterface(link.toObject());
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Link name already exists');
      } else {
        throw err;
      }
    }
  }

  public async update(linkId: string, destination: string): Promise<ILink> {
    const updateQuery = this.constructUpdateQuery({ destination });

    const updatedLink = await this.linkModel.findOneAndUpdate(
      { _id: new Types.ObjectId(linkId) },
      updateQuery,
      { new: true },
    );
    if (!updatedLink) {
      throw new NotFoundException('Link not found');
    }

    await this.cacheManager.del(`link:${updatedLink.name}`);

    return LinkEntity.mapToInterface(updatedLink.toObject());
  }

  public async delete(id: string): Promise<void> {
    const result = await this.linkModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Link not found');
    }
  }

  private constructUpdateQuery(dto: UpdateLinkDto): UpdateQuery<LinkEntity> {
    const updateQuery: UpdateQuery<LinkEntity> = {};

    if (dto.destination) {
      updateQuery.destination = dto.destination;
    }

    return updateQuery;
  }
}
