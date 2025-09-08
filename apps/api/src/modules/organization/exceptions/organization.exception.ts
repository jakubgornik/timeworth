import { CustomException } from '../../../shared/exceptions/custom-exception';

export class SingleOrganizationLimitFoundException extends CustomException {
  static readonly BODY = 'You can only be a member of one organization.';
  static readonly STATUS = 461;

  constructor() {
    super(
      SingleOrganizationLimitFoundException.BODY,
      SingleOrganizationLimitFoundException.STATUS,
    );
  }
}

export class OrganizationNameAlreadyExistsException extends CustomException {
  static readonly BODY = 'Organization with this name already exist.';
  static readonly STATUS = 462;

  constructor() {
    super(
      OrganizationNameAlreadyExistsException.BODY,
      OrganizationNameAlreadyExistsException.STATUS,
    );
  }
}
