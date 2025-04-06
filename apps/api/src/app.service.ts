import { Injectable } from '@nestjs/common';
import { PrismaService } from '@packages/db';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const users = await this.prisma.user.findMany();
    return `Found ${users.length} users. Names: ${users.map((user) => user.name).join(', ')}`;
  }
}
