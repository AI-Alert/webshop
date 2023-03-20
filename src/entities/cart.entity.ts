import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '@shared/entities';
import { ProductEntity } from '@src/entities/product.entity';
import { Exclude } from 'class-transformer';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ name: 'cart' })
export class CartEntity extends AbstractEntity {
  @Column()
  public total: number;

  @OneToMany(() => ProductEntity, (product) => product.cart)
  public products: ProductEntity[];

  @OneToOne(() => UserEntity, (user: UserEntity) => user.cart)
  @Exclude()
  public user: UserEntity;
}
