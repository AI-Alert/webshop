import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { AbstractEntity } from '@shared/entities';
import { AdminStatuses } from '@shared/enums';

@Entity({ name: 'admin' })
export class AdminEntity extends AbstractEntity {
  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column()
  public email: string;

  @Column()
  public passwordHash: string;

  @Column()
  public passwordSalt: string;

  @Column({ nullable: true, enum: AdminStatuses })
  public status?: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
