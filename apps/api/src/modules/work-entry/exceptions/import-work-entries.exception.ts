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
