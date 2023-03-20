import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '@shared/entities';
import { BrandEntity, CategoryEntity, ReviewEntity } from '@src/entities';
import { CartEntity } from '@src/entities/cart.entity';

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
  @Column()
  public name: string;
  @Column()
  public photoUrl: string;
  @Column()
  public description: string;
  @Column()
  public oldPrice?: number;
  @Column({ default: 0 })
  public newPrice: number;
  @Column({ default: 0 })
  public discount: number;
  @Column()
  public rate: number;
  @Column()
  public manufacturer: string;
  @Column()
  public manufacturerCountry: string;

  @ManyToOne(() => BrandEntity, (brand: BrandEntity) => brand.products, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Index()
  public brand: BrandEntity;

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
    {
      eager: true,
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  @Index()
  public category: CategoryEntity;

  @OneToMany(() => ReviewEntity, (review) => review.product)
  public reviews: ReviewEntity[];

  @ManyToOne(() => CartEntity, (cart: CartEntity) => cart.products, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Index()
  public cart: CartEntity;
}
