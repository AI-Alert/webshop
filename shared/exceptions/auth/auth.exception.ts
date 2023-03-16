import { HttpException } from '@nestjs/common';
import { AuthErrorCode } from '../exception.dictionary';

export class AuthException extends HttpException {
  constructor(
    authErrorCode: AuthErrorCode,
    statusCode,
    additionalData?: object,
  ) {
    const code = AuthErrorCode[authErrorCode];
    super({ error: { ...additionalData, code }, statusCode }, statusCode);
  }
}
