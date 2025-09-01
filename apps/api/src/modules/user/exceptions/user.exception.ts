import { CustomException } from '../../../shared/exceptions/custom-exception';

export class UserNotFoundException extends CustomException {
  static readonly BODY = 'User not found';
  static readonly STATUS = 450;

  constructor() {
    super(UserNotFoundException.BODY, UserNotFoundException.STATUS);
  }
}

export class UserIsMissingOrganizationException extends CustomException {
  static readonly BODY = 'User is missing organization';
  static readonly STATUS = 451;

  constructor() {
    super(
      UserIsMissingOrganizationException.BODY,
      UserIsMissingOrganizationException.STATUS,
    );
  }
}
