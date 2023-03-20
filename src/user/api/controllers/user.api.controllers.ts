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
import { UserApiService } from '@src/user/api/services';
import {
  EXAMPLE_BRAND,
  EXAMPLE_CATEGORY,
  EXAMPLE_PRODUCT,
  EXAMPLE_REVIEWS,
} from '@shared/swagger';
import { IdParams, PaginationQuery } from '@shared/dto';
import {
  BrandEntity,
  CategoryEntity,
  ProductEntity,
  ReviewEntity,
} from '@src/entities';
import { JwtAuthUserGuardRedis } from '@src/auth/guards';
import { CreateReviewDto } from '@src/user/api/dto';

@ApiTags('User API')
@ApiBearerAuth()
@UseGuards(JwtAuthUserGuardRedis)
@Controller('user/api')
export class UserApiControllers {
  constructor(private readonly _userApiService: UserApiService) {}

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
    return this._userApiService.listBrands(query.skip, query.limit);
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
    return this._userApiService.getBrand(+params.id);
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
    return this._userApiService.listCategories(query.skip, query.limit);
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
    return this._userApiService.getCategory(+params.id);
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
    return this._userApiService.listProducts(
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
    return this._userApiService.getProduct(+id, categoryName);
  }

  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('categories/:categoryName/products/:productName/reviews')
  @ApiOperation({ summary: 'Find reviews with pagination params' })
  @ApiOkResponse({
    description: 'Returns the list of reviews',
    content: {
      'application/json': {
        example: [EXAMPLE_REVIEWS],
      },
    },
  })
  async listReviews(
    @Query() query: PaginationQuery,
    @Param('productName') productName: string,
    @Param('categoryName') categoryName: string,
  ): Promise<{ reviews: ReviewEntity[]; amount: number }> {
    return this._userApiService.listReviews(
      query.skip,
      query.limit,
      productName,
      categoryName,
    );
  }

  @Get('categories/:categoryName/products/:productName/reviews/:id')
  @ApiOperation({ summary: 'Find reviews by Id' })
  @ApiOkResponse({
    description: 'Returns the reviews',
    content: {
      'application/json': {
        example: EXAMPLE_REVIEWS,
      },
    },
  })
  async getReview(
    @Param('id') id: string,
    @Param('productName') productName: string,
    @Param('categoryName') categoryName: string,
  ): Promise<ReviewEntity> {
    return this._userApiService.getReview(+id, productName, categoryName);
  }

  @Post('categories/:categoryName/products/:productName/reviews')
  @ApiOperation({ summary: 'Add reviews' })
  @ApiOkResponse({
    description: 'Returns a new reviews',
    content: {
      'application/json': {
        example: EXAMPLE_REVIEWS,
      },
    },
  })
  async addReview(
    @Body() payload: CreateReviewDto,
    @Param('productName') productName: string,
    @Param('categoryName') categoryName: string,
  ): Promise<ReviewEntity> {
    return this._userApiService.addReview(payload, productName, categoryName);
  }

  @Patch('categories/:categoryName/products/:productName/reviews/:id')
  @ApiOperation({ summary: 'Update reviews' })
  @ApiOkResponse({
    description: 'Returns an updated reviews',
    content: {
      'application/json': {
        example: EXAMPLE_REVIEWS,
      },
    },
  })
  async updateReview(
    @Param('id') id: string,
    @Body() payload: Partial<CreateReviewDto>,
    @Param('productName') productName: string,
    @Param('categoryName') categoryName: string,
  ): Promise<ReviewEntity> {
    return this._userApiService.updateReview(
      +id,
      payload,
      productName,
      categoryName,
    );
  }
  @Delete('categories/:categoryName/products/:productName/reviews/:id')
  @ApiOperation({ summary: 'Delete reviews' })
  @ApiOkResponse({
    description: 'Returns message about deleting',
    content: {
      'application/json': {
        example: 'Review 123 deleted successfully',
      },
    },
  })
  async deleteReview(
    @Param('id') id: string,
    @Param('productName') productName: string,
    @Param('categoryName') categoryName: string,
  ): Promise<string> {
    return this._userApiService.deleteReview(+id, productName, categoryName);
  }

  @Post('categories/:categoryName/products/:productName/reviews')
  @ApiOperation({ summary: 'Add reviews' })
  @ApiOkResponse({
    description: 'Returns a new reviews',
    content: {
      'application/json': {
        example: EXAMPLE_REVIEWS,
      },
    },
  })
  async addCart(
    @Body() payload: CreateReviewDto,
    @Param('productName') productName: string,
    @Param('categoryName') categoryName: string,
  ): Promise<ReviewEntity> {
    return this._userApiService.addReview(payload, productName, categoryName);
  }
}
