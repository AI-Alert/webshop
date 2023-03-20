import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '@shared/entities/abstract.entity';
import { Exclude } from 'class-transformer';
import { CartEntity } from '@src/entities/cart.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Column()
  public photoUrl: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description?: string;

  @Column()
  public contactName: string;

  @Column()
  public email: string;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column({ nullable: true })
  public address?: string;

  @Column({ nullable: true })
  public websiteUrl?: string;

  @Column({ nullable: true })
  @Exclude()
  public passwordHash?: string;

  @Column({ nullable: true })
  @Exclude()
  public lastPasswordResetDate: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => CartEntity, (cart: CartEntity) => cart.user, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Index()
  @Exclude()
  public cart: CartEntity;
}
