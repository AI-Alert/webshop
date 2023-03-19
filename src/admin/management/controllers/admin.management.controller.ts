import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthAdminGuardRedis } from '@src/auth/guards';
import { AdminManagementService } from '@src/admin/management/services';
import { IdParams, PaginationQuery } from '@shared/dto';
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
import {
  CreateBrandDto,
  CreateCategoryDto,
  CreateProductDto,
} from '@src/admin/management/dto';

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
  @Get('categories/:id')
  @ApiOperation({ summary: 'Find category by Id' })
  @ApiOkResponse({
    description: 'Returns the category',
    content: {
      'application/json': {
        example: EXAMPLE_CATEGORY,
      },
    },
  })
  async getCategory(@Param() params: IdParams): Promise<CategoryEntity> {
    return this._adminManagementService.getCategory(+params.id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Add category' })
  @ApiOkResponse({
    description: 'Returns a new category',
    content: {
      'application/json': {
        example: EXAMPLE_CATEGORY,
      },
    },
  })
  async addCategory(
    @Body() payload: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this._adminManagementService.addCategory(payload);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({
    description: 'Returns an updated category',
    content: {
      'application/json': {
        example: EXAMPLE_CATEGORY,
      },
    },
  })
  async updateCategory(
    @Param() params: IdParams,
    @Body() payload: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    return this._adminManagementService.updateCategory(+params.id, payload);
  }
  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiOkResponse({
    description: 'Returns message about deleting',
    content: {
      'application/json': {
        example: 'Category 123 deleted successfully',
      },
    },
  })
  async deleteCategory(@Param() params: IdParams): Promise<string> {
    return this._adminManagementService.deleteCategory(+params.id);
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

  @Get('brands/:id')
  @ApiOperation({ summary: 'Find brand by Id' })
  @ApiOkResponse({
    description: 'Returns the brand',
    content: {
      'application/json': {
        example: EXAMPLE_BRAND,
      },
    },
  })
  async getBrand(@Param() params: IdParams): Promise<BrandEntity> {
    return this._adminManagementService.getBrand(+params.id);
  }

  @Post('brands')
  @ApiOperation({ summary: 'Add brand' })
  @ApiOkResponse({
    description: 'Returns a new brand',
    content: {
      'application/json': {
        example: EXAMPLE_BRAND,
      },
    },
  })
  async addBrand(@Body() payload: CreateBrandDto): Promise<CategoryEntity> {
    return this._adminManagementService.addBrand(payload);
  }

  @Patch('brands/:id')
  @ApiOperation({ summary: 'Update brand' })
  @ApiOkResponse({
    description: 'Returns an updated brand',
    content: {
      'application/json': {
        example: EXAMPLE_BRAND,
      },
    },
  })
  async updateBrand(
    @Param() params: IdParams,
    @Body() payload: Partial<CreateBrandDto>,
  ): Promise<BrandEntity> {
    return this._adminManagementService.updateBrand(+params.id, payload);
  }
  @Delete('brands/:id')
  @ApiOperation({ summary: 'Delete brand' })
  @ApiOkResponse({
    description: 'Returns message about deleting',
    content: {
      'application/json': {
        example: 'Brand 123 deleted successfully',
      },
    },
  })
  async deleteBrand(@Param() params: IdParams): Promise<string> {
    return this._adminManagementService.deleteBrand(+params.id);
  }

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('categories/:categoryName/products')
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
    @Param('categoryName') categoryName: string,
  ): Promise<{ products: ProductEntity[]; amount: number }> {
    return this._adminManagementService.listProducts(
      query.skip,
      query.limit,
      categoryName,
    );
  }

  @Get('categories/:categoryName/products/:id')
  @ApiOperation({ summary: 'Find product by Id' })
  @ApiOkResponse({
    description: 'Returns the product',
    content: {
      'application/json': {
        example: EXAMPLE_PRODUCT,
      },
    },
  })
  async getProduct(
    @Param('id') id: string,
    @Param('categoryName') categoryName: string,
  ): Promise<ProductEntity> {
    return this._adminManagementService.getProduct(+id, categoryName);
  }

  @Post('categories/:categoryName/products')
  @ApiOperation({ summary: 'Add product' })
  @ApiOkResponse({
    description: 'Returns a new product',
    content: {
      'application/json': {
        example: EXAMPLE_PRODUCT,
      },
    },
  })
  async addProduct(
    @Body() payload: CreateProductDto,
    @Param('categoryName') categoryName: string,
  ): Promise<ProductEntity> {
    return this._adminManagementService.addProduct(payload, categoryName);
  }

  @Patch('categories/:categoryName/products/:id')
  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({
    description: 'Returns an updated product',
    content: {
      'application/json': {
        example: EXAMPLE_PRODUCT,
      },
    },
  })
  async updateProduct(
    @Param('id') id: string,
    @Param('categoryName') categoryName: string,
    @Body() payload: Partial<CreateProductDto>,
  ): Promise<ProductEntity> {
    return this._adminManagementService.updateProduct(
      +id,
      payload,
      categoryName,
    );
  }
  @Delete('categories/:categoryName/products/:id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({
    description: 'Returns message about deleting',
    content: {
      'application/json': {
        example: 'Product 123 deleted successfully',
      },
    },
  })
  async deleteProduct(
    @Param('id') id: string,
    @Param('categoryName') categoryName: string,
  ): Promise<string> {
    return this._adminManagementService.deleteProduct(+id, categoryName);
  }
}
