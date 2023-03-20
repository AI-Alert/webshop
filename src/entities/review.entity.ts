import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from '@shared/entities/abstract.entity';
import { ProductEntity } from '@src/entities/product.entity';

@Entity({ name: 'review' })
export class ReviewEntity extends AbstractEntity {
  @Column()
  public advantage: string;

  @Column()
  public disadvantage: string;

  @Column()
  public comment: string;

  @Column()
  public rate: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.reviews, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Index()
  public product: ReviewEntity;
}
