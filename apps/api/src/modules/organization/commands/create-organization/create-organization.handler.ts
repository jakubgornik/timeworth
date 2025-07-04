import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { CreateOrganizationCommand } from './create-organization.command';
import { randomBytes } from 'crypto';
import { Prisma } from '@packages/db';
import { SingleOrganizationLimitFoundException } from '../../exceptions/organization.exception';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler
  implements ICommandHandler<CreateOrganizationCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ dto }: CreateOrganizationCommand): Promise<void> {
    const inviteCode = this.generateInviteCode();

    try {
      await this.createOrganizationWithManager(dto, inviteCode);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('inviteCode')
      ) {
        const retryCode = this.generateInviteCode();
        await this.createOrganizationWithManager(dto, retryCode);
      } else {
        throw error;
      }
    }
  }

  private async createOrganizationWithManager(
    dto: any,
    inviteCode: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: dto.managerId },
      });

      if (user?.organizationId) {
        throw new SingleOrganizationLimitFoundException();
      }

      const organization = await tx.organization.create({
        data: {
          ...dto,
          inviteCode,
        },
      });

      await tx.user.update({
        where: { id: dto.managerId },
        data: { organizationId: organization.id },
      });
    });
  }

  private generateInviteCode(): string {
    const bytes = randomBytes(4);
    return bytes.toString('hex').toUpperCase();
  }
}
