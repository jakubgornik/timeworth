import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { CreateOrganizationCommand } from './create-organization.command';
import { randomBytes } from 'crypto';
import { Prisma } from '@packages/db';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler
  implements ICommandHandler<CreateOrganizationCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ dto }: CreateOrganizationCommand): Promise<void> {
    const inviteCode = this.generateInviteCode();

    try {
      await this.prisma.organization.create({
        data: {
          ...dto,
          inviteCode,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('inviteCode')
      ) {
        const retryCode = this.generateInviteCode();
        await this.prisma.organization.create({
          data: {
            ...dto,
            inviteCode: retryCode,
          },
        });
      } else {
        throw error;
      }
    }
  }

  private generateInviteCode(): string {
    const bytes = randomBytes(4);
    return bytes.toString('hex').toUpperCase();
  }
}
