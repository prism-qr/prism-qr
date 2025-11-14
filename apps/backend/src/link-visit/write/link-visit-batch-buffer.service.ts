import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LinkVisitEntity } from '../core/entities/link-visit.entity';
import { CreateLinkVisitParams } from '../core/types/create-link-visit-params';

@Injectable()
export class LinkVisitBatchBufferService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(LinkVisitBatchBufferService.name);
  private buffer: CreateLinkVisitParams[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL_MS = 10_000;
  private readonly MAX_BUFFER_SIZE = 500;

  constructor(
    @InjectModel(LinkVisitEntity.name)
    private readonly linkVisitModel: Model<LinkVisitEntity>,
  ) {}

  public onModuleInit(): void {
    this.startFlushInterval();
    this.logger.log(
      `Batch buffer initialized with ${this.FLUSH_INTERVAL_MS}ms flush interval`,
    );
  }

  public async onModuleDestroy(): Promise<void> {
    this.stopFlushInterval();
    await this.flush();
    this.logger.log('Batch buffer destroyed and flushed');
  }

  public addToBuffer(params: CreateLinkVisitParams): void {
    this.buffer.push(params);

    if (this.buffer.length >= this.MAX_BUFFER_SIZE) {
      this.logger.log(
        `Buffer size threshold reached (${this.MAX_BUFFER_SIZE}), flushing...`,
      );
      void this.flush();
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL_MS);
  }

  private stopFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const itemsToFlush = [...this.buffer];
    this.buffer = [];

    try {
      await this.linkVisitModel.insertMany(itemsToFlush, { ordered: false });
      this.logger.log(
        `Successfully flushed ${itemsToFlush.length} link visits to database`,
      );
    } catch (error) {
      this.logger.error(
        `Error flushing ${itemsToFlush.length} link visits:`,
        error,
      );
      this.buffer.push(...itemsToFlush);
    }
  }
}
