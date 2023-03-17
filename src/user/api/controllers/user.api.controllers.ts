import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserApiService } from '@src/user/api/services';

@ApiTags('User API')
@Controller('user/crud')
export class UserApiControllers {
  constructor(private readonly _userApiService: UserApiService) {}
}
