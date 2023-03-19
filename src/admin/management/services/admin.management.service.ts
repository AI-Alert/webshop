import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import {
  BrandEntity,
  CategoryEntity,
  ProductEntity,
  UserEntity,
} from '@src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import {
  CreateBrandDto,
  CreateCategoryDto,
  CreateProductDto,
} from '@src/admin/management/dto';

@Injectable()
export class AdminManagementService {
  constructor(
    private readonly _config: ConfigService,
    private readonly _redis: RedisService,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
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
    const allUsers = await this._userRepository.find();
    const users = await this._userRepository.find({ skip, take: limit });
    return {
      users: users,
      amount: allUsers.length,
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
  async addCategory(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const isCategory = await this._categoryRepository.find({
      where: { name: dto.name },
    });
    if (isCategory.length > 0) {
      throw new BadRequestException(
        'Category with this name is already exists',
      );
    }
    return await this._categoryRepository.save(dto);
  }
  async getCategory(id: number): Promise<CategoryEntity> {
    const category = await this._categoryRepository.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category ${id} doesn't exists`);
    }
    return category;
  }

  async updateCategory(
    id: number,
    dto: Partial<CreateCategoryDto>,
  ): Promise<CategoryEntity> {
    const category = await this._categoryRepository.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category ${id} doesn't exists`);
    }
    await this._categoryRepository.update({ id: id }, dto);
    return await this._categoryRepository.findOneBy({
      id: id,
    });
  }
  async deleteCategory(id: number): Promise<string> {
    const category = await this._categoryRepository.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category ${id} doesn't exists`);
    }
    await this._categoryRepository.delete({ id: id });
    return `Category ${id} deleted successfully`;
  }

  async addBrand(dto: CreateBrandDto): Promise<BrandEntity> {
    const isBrand = await this._brandRepository.find({
      where: { name: dto.name },
    });
    if (isBrand.length > 0) {
      throw new BadRequestException('Brand with this name is already exists');
    }
    return await this._brandRepository.save(dto);
  }
  async getBrand(id: number): Promise<BrandEntity> {
    const brand = await this._brandRepository.findOneBy({ id: id });
    if (!brand) {
      throw new NotFoundException(`Brand ${id} doesn't exists`);
    }
    return brand;
  }

  async updateBrand(
    id: number,
    dto: Partial<CreateBrandDto>,
  ): Promise<BrandEntity> {
    const brand = await this._brandRepository.findOneBy({ id: id });
    if (!brand) {
      throw new NotFoundException(`Brand ${id} doesn't exists`);
    }
    await this._brandRepository.update({ id: id }, dto);
    return await this._brandRepository.findOneBy({
      id: id,
    });
  }
  async deleteBrand(id: number): Promise<string> {
    const brand = await this._brandRepository.findOneBy({ id: id });
    if (!brand) {
      throw new NotFoundException(`Brand ${id} doesn't exists`);
    }
    await this._brandRepository.delete({ id: id });
    return `Brand ${id} deleted successfully`;
  }

  async listProducts(
    skip = 0,
    limit = 0,
    categoryName: string,
  ): Promise<{ products: ProductEntity[]; amount: number }> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const allProducts = await this._productRepository.find({
      where: { category: Equal(category.id) },
    });
    const products = await this._productRepository.find({
      skip,
      take: limit,
      where: { category: Equal(category.id) },
    });
    return {
      products: products,
      amount: allProducts.length,
    };
  }
  async addProduct(
    dto: CreateProductDto,
    categoryName: string,
  ): Promise<ProductEntity> {
    const isProduct = await this._productRepository.find({
      where: { name: dto.name },
    });
    if (isProduct.length > 0) {
      throw new BadRequestException('Product with this name is already exists');
    }
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    let brandRes = {};
    const brand = await this._brandRepository.findOneBy({
      name: dto.brandName,
    });
    if (!brand) {
      throw new NotFoundException(`Brand ${dto.brandName} doesn't found`);
    }
    brandRes = brand;

    if (!dto.newPrice) {
      dto.newPrice = 0;
    }
    if (!dto.discount) {
      dto.discount = 0;
    }
    if (!dto.rate) {
      dto.rate = 0;
    }
    const res = { ...dto, category: category, brand: brandRes };
    return await this._productRepository.save(res);
  }
  async getProduct(id: number, categoryName: string): Promise<ProductEntity> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      id: id,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${id} doesn't exists`);
    }
    return product;
  }

  async updateProduct(
    id: number,
    dto: Partial<CreateProductDto>,
    categoryName: string,
  ): Promise<ProductEntity> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      id: id,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${id} doesn't exists`);
    }
    await this._productRepository.update({ id: id }, dto);
    return await this._productRepository.findOneBy({
      id: id,
    });
  }
  async deleteProduct(id: number, categoryName): Promise<string> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      id: id,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${id} doesn't exists`);
    }
    await this._productRepository.delete({ id: id });
    return `Product ${id} deleted successfully`;
  }
}
