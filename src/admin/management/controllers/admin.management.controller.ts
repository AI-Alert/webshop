import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthAdminGuardRedis } from '@src/auth/guards';
import { AdminManagementService } from '@src/admin/management/services';
import { PaginationQuery } from '@shared/dto';
import { UserEntity } from '@src/entities';
import { EXAMPLE_USER } from '@src/user/profile/controllers';

@ApiTags('Admin Management')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminGuardRedis)
@Controller('admin/management')
export class AdminManagementController {
  constructor(
    private readonly _adminManagementService: AdminManagementService,
  ) {}

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('users')
  @ApiOperation({ summary: 'Find users with pagination params' })
  @ApiOkResponse({
    description: 'Returns the list of users',
    content: {
      'application/json': {
        example: [EXAMPLE_USER],
      },
    },
  })
  async listUsers(
    @Query() query: PaginationQuery,
  ): Promise<{ users: UserEntity[]; amount: number }> {
    return this._adminManagementService.listUsers(query.skip, query.limit);
  }
}
