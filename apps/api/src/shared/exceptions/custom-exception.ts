import { HttpException } from '@nestjs/common';

export interface ICustomException {
  BODY: string;
  STATUS: number;
}

export class CustomException extends HttpException implements ICustomException {
  public BODY: string;
  public STATUS: number;

  constructor(BODY: string, STATUS: number) {
    super(BODY, STATUS);
    this.BODY = BODY;
    this.STATUS = STATUS;
  }
}
