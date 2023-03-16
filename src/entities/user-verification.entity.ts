import { Exclude } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '@shared/entities/abstract.entity';
import { UserEntity } from '@src/entities/user.entity';

@Entity({ name: 'userVerification' })
export class UserVerificationEntity extends AbstractEntity {
  @Column({ nullable: true })
  public passwordVerificationCode?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  public lastPasswordVerificationCodeSentAt?: Date;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.verification)
  @Exclude()
  public user: UserEntity;
}
