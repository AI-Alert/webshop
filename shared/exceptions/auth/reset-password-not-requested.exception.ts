import { AuthException } from './auth.exception';
import { AuthErrorCode } from '../exception.dictionary';
import { HttpStatus } from '@nestjs/common';

export class ResetPasswordNotRequestedException extends AuthException {
  constructor(data?: object) {
    super(
      AuthErrorCode.RESET_PASSWORD_NOT_REQUESTED,
      HttpStatus.PRECONDITION_FAILED,
      data,
    );
  }
}
