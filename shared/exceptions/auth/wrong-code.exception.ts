import { AuthException } from './auth.exception';
import { AuthErrorCode } from '../exception.dictionary';
import { HttpStatus } from '@nestjs/common';

export class WrongCodeException extends AuthException {
  constructor(data?: object) {
    super(AuthErrorCode.WRONG_CODE, HttpStatus.UNAUTHORIZED, data);
  }
}
