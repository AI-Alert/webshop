import { Equal, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BrandEntity,
  CategoryEntity,
  ProductEntity,
  ReviewEntity,
  UserEntity,
} from '@src/entities';
import { CreateReviewDto } from '@src/user/api/dto';

@Injectable()
export class UserApiService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly _reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BrandEntity)
    private readonly _brandRepository: Repository<BrandEntity>,
  ) {}

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
  async getBrand(id: number): Promise<BrandEntity> {
    const brand = await this._brandRepository.findOneBy({ id: id });
    if (!brand) {
      throw new NotFoundException(`Brand ${id} doesn't exists`);
    }
    return brand;
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
  async getCategory(id: number): Promise<CategoryEntity> {
    const category = await this._categoryRepository.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category ${id} doesn't exists`);
    }
    return category;
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

  async listReviews(
    skip = 0,
    limit = 0,
    productName: string,
    categoryName: string,
  ): Promise<{ reviews: ReviewEntity[]; amount: number }> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      name: productName,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${productName} doesn't found`);
    }
    const allReviews = await this._reviewRepository.find({
      where: { product: Equal(product.id) },
    });
    const reviews = await this._reviewRepository.find({
      skip,
      take: limit,
      where: { product: Equal(product.id) },
    });
    return {
      reviews: reviews,
      amount: allReviews.length,
    };
  }
  async addReview(
    dto: CreateReviewDto,
    productName: string,
    categoryName: string,
  ): Promise<ReviewEntity> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const isReview = await this._reviewRepository.find({
      where: { comment: dto.comment },
    });
    if (isReview.length > 0) {
      throw new BadRequestException('Review with this name is already exists');
    }
    const product = await this._productRepository.findOneBy({
      name: productName,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${productName} doesn't found`);
    }
    if (!dto.rate) {
      dto.rate = 0;
    }
    const res = { ...dto, product: product };
    return await this._reviewRepository.save(res);
  }
  async getReview(
    id: number,
    productName: string,
    categoryName: string,
  ): Promise<ReviewEntity> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      name: productName,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${productName} doesn't found`);
    }
    const review = await this._reviewRepository.findOneBy({
      id: id,
      product: Equal(product.id),
    });
    if (!review) {
      throw new NotFoundException(`Review ${id} doesn't exists`);
    }
    return review;
  }

  async updateReview(
    id: number,
    dto: Partial<CreateReviewDto>,
    productName: string,
    categoryName: string,
  ): Promise<ReviewEntity> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      name: productName,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${productName} doesn't found`);
    }
    const review = await this._reviewRepository.findOneBy({
      id: id,
      product: Equal(product.id),
    });
    if (!review) {
      throw new NotFoundException(`Review ${id} doesn't exists`);
    }
    await this._reviewRepository.update({ id: id }, dto);
    return await this._reviewRepository.findOneBy({
      id: id,
    });
  }
  async deleteReview(
    id: number,
    productName: string,
    categoryName: string,
  ): Promise<string> {
    const category = await this._categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryName} doesn't found`);
    }
    const product = await this._productRepository.findOneBy({
      name: productName,
      category: Equal(category.id),
    });
    if (!product) {
      throw new NotFoundException(`Product ${productName} doesn't found`);
    }
    const review = await this._reviewRepository.findOneBy({
      id: id,
      product: Equal(product.id),
    });
    if (!review) {
      throw new NotFoundException(`Review ${id} doesn't exists`);
    }
    await this._reviewRepository.delete({ id: id });
    return `Review ${id} deleted successfully`;
  }
}
