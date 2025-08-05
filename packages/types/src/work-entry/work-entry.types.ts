import { IPaginatedQueryDto, ISearchDto } from "../utils/utils.types";

export interface IWorkEntryDto {
  id: string;
  title: string;
  startedAt: Date;
  endedAt: Date;
  description?: string | null;
  userId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  billable: boolean;
  approved: boolean;
  hourlyRate?: number | null;
  hoursWorked: number;
}

export interface ICreateWorkEntryDto
  extends Omit<
    IWorkEntryDto,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "billable"
    | "approved"
    | "hourlyRate"
    | "hoursWorked"
  > {}

interface TimePeriod {
  from: Date;
  to: Date;
}

export interface IWorkEntryToEventDto {
  id: string;
  title: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  description?: string;
}

export interface IGetWorkEntriesQueryDto {
  userId: string;
  currentWeek?: TimePeriod;
}

export interface IOrganizationWorkEntriesFiltersDto {
  workEntryStartedAt?: string;
  workEntryEndedAt?: string;
  hoursWorked?: number;
  title?: string;
}

export type IPaginatedOrganizationWorkEntriesQueryDto =
  Partial<IOrganizationWorkEntriesFiltersDto> &
    ISearchDto &
    IPaginatedQueryDto & {
      managerId: string;
    };
