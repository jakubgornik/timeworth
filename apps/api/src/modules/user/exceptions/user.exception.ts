import { CustomException } from '../../../shared/exceptions/custom-exception';

export class UserNotFoundException extends CustomException {
  static readonly BODY = 'User not found';
  static readonly STATUS = 404;

  constructor() {
    super(UserNotFoundException.BODY, UserNotFoundException.STATUS);
  }
}
