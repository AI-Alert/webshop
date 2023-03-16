import { AuthException } from './auth.exception';
import { AuthErrorCode } from '../exception.dictionary';
import { HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends AuthException {
  constructor(data?: object) {
    super(AuthErrorCode.TOO_MANY_REQUESTS, HttpStatus.TOO_MANY_REQUESTS, data);
  }
}
