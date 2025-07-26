import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@packages/db';
import { JoinOrganizationCommand } from './join-organization.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(JoinOrganizationCommand)
export class JoinOrganizationHandler
  implements ICommandHandler<JoinOrganizationCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    joinOrganizationDto,
  }: JoinOrganizationCommand): Promise<void> {
    const { userId, inviteCode } = joinOrganizationDto;

    const organization = await this.prisma.organization.findUnique({
      where: {
        inviteCode,
      },
    });

    if (!organization) {
      throw new NotFoundException('Invalid invite code');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        organization: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (existingUser.organizationId) {
      throw new BadRequestException(
        'User is already a member of an organization',
      );
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        organizationId: organization.id,
        role: 'EMPLOYEE',
      },
    });
  }
}
