import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { JoinOrganizationCommand } from './join-organization.command';
import { NotFoundException } from '@nestjs/common';
import { SingleOrganizationLimitFoundException } from '../../exceptions/organization.exception';

@CommandHandler(JoinOrganizationCommand)
export class JoinOrganizationHandler implements ICommandHandler<JoinOrganizationCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    joinOrganizationDto,
  }: JoinOrganizationCommand): Promise<void> {
    const { userId, inviteCode, name } = joinOrganizationDto;

    await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.findUnique({
        where: {
          inviteCode,
        },
      });

      if (!organization) {
        throw new NotFoundException('Invalid invite code');
      }

      const existingUser = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (existingUser.organizationId) {
        throw new SingleOrganizationLimitFoundException();
      }

      const assigned = await tx.user.updateMany({
        where: {
          id: userId,
          organizationId: null,
        },
        data: {
          organizationId: organization.id,
          role: 'EMPLOYEE',
          name,
        },
      });
      if (assigned.count !== 1) {
        throw new SingleOrganizationLimitFoundException();
      }
    });
  }
}
