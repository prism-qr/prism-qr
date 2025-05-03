import { Model, Types } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkEntity } from '../core/entities/link.entity';
import { ILink } from '../core/entities/link.interface';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class LinkWriteService {
  constructor(
    @InjectModel(LinkEntity.name) private linkModel: Model<LinkEntity>,
  ) {}

  async createLink(dto: CreateLinkDto): Promise<ILink> {
    try {
      const link = await this.linkModel.create({
        name: dto.name,
        destination: dto.destination,
      });
      return LinkEntity.mapToInterface(link);
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Link name already exists');
      } else {
        throw err;
      }
    }
  }

  async updateDestination(id: string, destination: string): Promise<void> {
    await this.linkModel.updateOne(
      {
        _id: new Types.ObjectId(id),
      },
      { destination },
    );
  }
}
