import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { UserEntity } from '@src/entities';
import { UserApiService } from '@src/user/api/services';
import { ProductEntity } from '@src/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandEntity } from '@src/entities/brand.entity';
import { CategoryEntity } from '@src/entities/category.entity';

@Injectable()
export class AdminManagementService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _config: ConfigService,
    private readonly _redis: RedisService,
    private readonly _userApiService: UserApiService,
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
    @InjectRepository(BrandEntity)
    private readonly _brandRepository: Repository<BrandEntity>,
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {
    this._jwtRedisClient = this._redis.getClient(
      this._config.get('redis.jwtClient'),
    );
  }
  private readonly _jwtRedisClient: Redis;

  async listUsers(
    skip = 0,
    limit = 0,
  ): Promise<{ users: UserEntity[]; amount: number }> {
    const allUsers = await this._userApiService.findAll();
    const users = await this._userApiService.findAll(skip, limit);
    return {
      users: users,
      amount: allUsers.length,
    };
  }
  async listProducts(
    skip = 0,
    limit = 0,
  ): Promise<{ products: ProductEntity[]; amount: number }> {
    const allProducts = await this._productRepository.find();
    const products = await this._productRepository.find({
      skip,
      take: limit,
    });
    return {
      products: products,
      amount: allProducts.length,
    };
  }

  async listBrands(
    skip = 0,
    limit = 0,
  ): Promise<{ brands: BrandEntity[]; amount: number }> {
    const allBrands = await this._brandRepository.find();
    const brands = await this._brandRepository.find({
      skip,
      take: limit,
    });
    return {
      brands: brands,
      amount: allBrands.length,
    };
  }

  async listCategories(
    skip = 0,
    limit = 0,
  ): Promise<{ categories: BrandEntity[]; amount: number }> {
    const allBrands = await this._categoryRepository.find();
    const brands = await this._categoryRepository.find({
      skip,
      take: limit,
    });
    return {
      categories: brands,
      amount: allBrands.length,
    };
  }
}
