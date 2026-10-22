import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService, UserRole } from '@packages/db';
import { CreateOrganizationCommand } from './create-organization.command';
import { randomBytes } from 'crypto';
import {
  OrganizationNameAlreadyExistsException,
  SingleOrganizationLimitFoundException,
} from '../../exceptions/organization.exception';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    createOrganizationDto: dto,
  }: CreateOrganizationCommand): Promise<void> {
    const inviteCode = this.generateInviteCode();

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: dto.managerId },
      });

      if (!user) throw new NotFoundException('User not found');
      if (user.organizationId) {
        throw new SingleOrganizationLimitFoundException();
      }

      const existingOrganization = await tx.organization.findFirst({
        where: {
          name: {
            equals: dto.organizationName,
            mode: 'insensitive',
          },
        },
      });

      if (existingOrganization) {
        throw new OrganizationNameAlreadyExistsException();
      }

      const organization = await tx.organization.create({
        data: {
          managerId: dto.managerId,
          name: dto.organizationName,
          industry: dto.industry,
          size: dto.size,
          address: dto.address,
          inviteCode,
        },
      });

      const assigned = await tx.user.updateMany({
        where: { id: dto.managerId, organizationId: null },
        data: {
          organizationId: organization.id,
          role: UserRole.MANAGER,
          name: dto.managerName,
        },
      });
      if (assigned.count !== 1) {
        throw new SingleOrganizationLimitFoundException();
      }
    });
  }

  private generateInviteCode(): string {
    const bytes = randomBytes(4);
    return bytes.toString('hex').toUpperCase();
  }
}
