import { CustomException } from '../../../shared/exceptions/custom-exception';

export class SingleOrganizationLimitFoundException extends CustomException {
  static readonly BODY = 'Organization with this invite code does not exist.';
  static readonly STATUS = 461;

  constructor() {
    super(
      SingleOrganizationLimitFoundException.BODY,
      SingleOrganizationLimitFoundException.STATUS,
    );
  }
}
