import { AuthErrorCode } from '../exception.dictionary';
import { HttpStatus } from '@nestjs/common';
import { AuthException } from '@shared/exceptions/auth/auth.exception';

export class UserNotFoundException extends AuthException {
  constructor(data?: object) {
    super(AuthErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND, data);
  }
}
