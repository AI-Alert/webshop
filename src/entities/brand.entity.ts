import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@shared/entities';
import { IsOptional } from 'class-validator';
import { ProductEntity } from '@src/entities/product.entity';

@Entity({ name: 'brand' })
export class BrandEntity extends AbstractEntity {
  @Column()
  public name: string;
  @Column({ nullable: true })
  @IsOptional()
  description?: string;
  @Column()
  public photoUrl: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  public products: ProductEntity[];
}
