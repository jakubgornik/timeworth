import { CustomException } from '../../../shared/exceptions/custom-exception';

export class ImportWorkEntriesEmptyFileException extends CustomException {
  static readonly BODY = 'File is empty';
  static readonly STATUS = 450;

  constructor() {
    super(
      ImportWorkEntriesEmptyFileException.BODY,
      ImportWorkEntriesEmptyFileException.STATUS,
    );
  }
}

export class ImportWorkEntriesFileNotFoundException extends CustomException {
  static readonly BODY = 'No file uploaded';
  static readonly STATUS = 451;

  constructor() {
    super(
      ImportWorkEntriesFileNotFoundException.BODY,
      ImportWorkEntriesFileNotFoundException.STATUS,
    );
  }
}

export class ManagerNotFoundException extends CustomException {
  static readonly BODY = 'Manager not found';
  static readonly STATUS = 452;

  constructor() {
    super(ManagerNotFoundException.BODY, ManagerNotFoundException.STATUS);
  }
}

export class WorkEntryStartedAtBeforeEndedAt extends CustomException {
  static readonly BODY = 'Work entry startedAt must be before endedAt';
  static readonly STATUS = 452;

  constructor() {
    super(
      WorkEntryStartedAtBeforeEndedAt.BODY,
      WorkEntryStartedAtBeforeEndedAt.STATUS,
    );
  }
}
