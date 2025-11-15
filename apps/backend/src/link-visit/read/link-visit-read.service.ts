import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { LinkVisitEntity } from '../core/entities/link-visit.entity';

@Injectable()
export class LinkVisitReadService implements OnModuleInit {
  private readonly logger = new Logger(LinkVisitReadService.name);
  private readonly TOTAL_SCANS_CACHE_KEY = 'link-visit:total-scans';

  constructor(
    @InjectModel(LinkVisitEntity.name)
    private readonly linkVisitModel: Model<LinkVisitEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.refreshTotalScansCache();
  }

  public async getTotalScans(): Promise<number> {
    const cached = await this.cacheManager.get<number>(
      this.TOTAL_SCANS_CACHE_KEY,
    );
    return cached ?? 0;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  private async refreshTotalScansCache(): Promise<void> {
    try {
      const count = await this.linkVisitModel.countDocuments();
      await this.cacheManager.set(this.TOTAL_SCANS_CACHE_KEY, count);
    } catch (error) {
      this.logger.error('Failed to refresh total scans cache', error);
    }
  }
}
