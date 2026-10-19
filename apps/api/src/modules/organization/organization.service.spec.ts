import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OrganizationService } from './organization.service';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { CreateOrganizationCommand } from './commands/create-organization/create-organization.command';
import { JoinOrganizationCommand } from './commands/join-organization/join-organization.command';

describe('OrganizationService authorization', () => {
  it('should create and join organizations only for the authenticated user', async () => {
    const commandBus = { execute: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        OrganizationService,
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: {} },
      ],
    }).compile();
    const service = module.get(OrganizationService);
    const user: AuthenticatedUser = {
      userId: 'user-1',
      email: 'user@example.com',
      role: 'EMPLOYEE',
      organizationId: null,
      organizationManagerId: null,
    };
    const createDto = {
      managerName: 'Name',
      organizationName: 'Org',
      managerId: 'victim',
    };
    const joinDto = { name: 'Name', inviteCode: 'CODE', userId: 'victim' };

    await service.createOrganization(createDto, user);
    await service.joinOrganization(joinDto, user);

    expect(commandBus.execute).toHaveBeenNthCalledWith(
      1,
      new CreateOrganizationCommand({ ...createDto, managerId: 'user-1' }),
    );
    expect(commandBus.execute).toHaveBeenNthCalledWith(
      2,
      new JoinOrganizationCommand({ ...joinDto, userId: 'user-1' }),
    );
  });
});
