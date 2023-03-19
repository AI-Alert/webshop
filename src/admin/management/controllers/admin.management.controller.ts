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
import {
  UserEntity,
  ProductEntity,
  BrandEntity,
  CategoryEntity,
} from '@src/entities';
import {
  EXAMPLE_BRAND,
  EXAMPLE_CATEGORY,
  EXAMPLE_PRODUCT,
  EXAMPLE_USER,
} from '@shared/swagger';

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
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('products')
  @ApiOperation({ summary: 'Find products with pagination params' })
  @ApiOkResponse({
    description: 'Returns the list of products',
    content: {
      'application/json': {
        example: [EXAMPLE_PRODUCT],
      },
    },
  })
  async listProducts(
    @Query() query: PaginationQuery,
  ): Promise<{ products: ProductEntity[]; amount: number }> {
    return this._adminManagementService.listProducts(query.skip, query.limit);
  }

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('brands')
  @ApiOperation({ summary: 'Find brands with pagination params' })
  @ApiOkResponse({
    description: 'Returns the list of brands',
    content: {
      'application/json': {
        example: [EXAMPLE_BRAND],
      },
    },
  })
  async listBrands(
    @Query() query: PaginationQuery,
  ): Promise<{ brands: BrandEntity[]; amount: number }> {
    return this._adminManagementService.listBrands(query.skip, query.limit);
  }

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('categories')
  @ApiOperation({ summary: 'Find categories with pagination params' })
  @ApiOkResponse({
    description: 'Returns the list of categories',
    content: {
      'application/json': {
        example: [EXAMPLE_CATEGORY],
      },
    },
  })
  async listCategories(
    @Query() query: PaginationQuery,
  ): Promise<{ categories: CategoryEntity[]; amount: number }> {
    return this._adminManagementService.listCategories(query.skip, query.limit);
  }
}
