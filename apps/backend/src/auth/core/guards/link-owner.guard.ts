import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { LinkReadService } from 'src/link/read/link-read.service';

@Injectable()
export class LinkOwnerGuard implements CanActivate {
  constructor(private readonly linkReadService: LinkReadService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const linkId = request.params.linkId;
    const user = request.user;

    if (!linkId) {
      throw new NotFoundException('Link ID not provided');
    }

    const link = await this.linkReadService.readById(linkId);

    if (!link || link.userId !== user.id) {
      throw new ForbiddenException();
    }

    return true;
  }
}
