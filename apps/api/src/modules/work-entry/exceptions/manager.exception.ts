import { CustomException } from '../../../shared/exceptions/custom-exception';

export class ManagerNotFoundException extends CustomException {
  static readonly BODY = 'Manager not found';
  static readonly STATUS = 450;

  constructor() {
    super(ManagerNotFoundException.BODY, ManagerNotFoundException.STATUS);
  }
}
