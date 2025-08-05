import { Injectable } from '@nestjs/common';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkEntryCommand } from './commands/create-work-entry/create-work-entry.command';
import { GetWorkEntriesQueryDto } from './dto/get-work-entries.dto';
import { DeleteWorkEntryCommand } from './commands/delete-work-entry/delete-work-entry.command';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { SortDto } from 'src/shared/dto/sort.dto';
import { GetOrganizationWorkEntriesQuery } from './query/get-organization-work-entries/get-organization-work-entries.query';
import { GetWorkEntriesQuery } from './query/get-work-entries/get-work-entries.query';
import { OrganizationWorkEntriesFiltersDto } from './dto/organization-work-entries-filters.dto';

@Injectable()
export class WorkEntryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getWorkEntries(dto: GetWorkEntriesQueryDto) {
    return await this.queryBus.execute(new GetWorkEntriesQuery(dto));
  }

  async createWorkEntry(dto: CreateWorkEntryDto) {
    return await this.commandBus.execute(new CreateWorkEntryCommand(dto));
  }

  async deleteWorkEntry(id: string) {
    return await this.commandBus.execute(new DeleteWorkEntryCommand(id));
  }

  async getOrganizationWorkEntries(
    managerId: string,
    search: string,
    paginationDto: PaginationDto,
    sortDto: SortDto,
    filtersDto: OrganizationWorkEntriesFiltersDto,
  ) {
    return await this.queryBus.execute(
      new GetOrganizationWorkEntriesQuery(
        managerId,
        search,
        paginationDto,
        sortDto,
        filtersDto,
      ),
    );
  }
}
