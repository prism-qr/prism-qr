import { Injectable } from '@nestjs/common';
import { LinkVisitEntity } from '../core/entities/link-visit.entity';
import { Model } from 'mongoose';
import { ILinkVisit } from '../core/entities/link-visit.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLinkVisitParams } from '../core/types/create-link-visit-params';

@Injectable()
export class LinkVisitWriteService {
  constructor(
    @InjectModel(LinkVisitEntity.name)
    private readonly linkVisitModel: Model<LinkVisitEntity>,
  ) {}

  async create(dto: CreateLinkVisitParams): Promise<ILinkVisit> {
    const linkVisit = await this.linkVisitModel.create(dto);
    return LinkVisitEntity.mapToInterface(linkVisit);
  }
}
