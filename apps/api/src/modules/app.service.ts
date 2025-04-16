import { Injectable } from '@nestjs/common';
import { PrismaService } from '@packages/db';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHealth(): string {
    return 'Api OK';
  }
}
