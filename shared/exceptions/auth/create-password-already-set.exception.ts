import { AuthException } from './auth.exception';
import { AuthErrorCode } from '../exception.dictionary';
import { HttpStatus } from '@nestjs/common';

export class CreatePasswordAlreadySetException extends AuthException {
  constructor(data?: object) {
    super(AuthErrorCode.CREATE_PASSWORD_ALREADY_SET, HttpStatus.CONFLICT, data);
  }
}
