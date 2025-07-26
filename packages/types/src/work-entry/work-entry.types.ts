export interface IWorkEntryDto {
  id: string;
  title: string;
  startedAt: Date;
  endedAt: Date;
  description?: string;
  hoursWorked: number;
  userId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  billable: boolean;
  approved: boolean;
  hourlyRate: number;
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
