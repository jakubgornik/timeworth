// import { CustomException } from 'src/shared/exceptions/custom-exceptions';

import { CustomException } from '../../../shared/exceptions/custom-exceptions';

export class UserNotFoundException extends CustomException {
  static readonly BODY = 'User not found';
  static readonly STATUS = 404;

  constructor() {
    super(UserNotFoundException.BODY, UserNotFoundException.STATUS);
  }
}
