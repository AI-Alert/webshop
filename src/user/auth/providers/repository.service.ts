import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from '@src/entities';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this._userRepository.findOne({
      where: { email },
    });
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async update(
    id: number,
    partialEntity: Partial<UserEntity>,
    returnOld = false,
  ) {
    let entityToReturn;
    if (returnOld) {
      entityToReturn = this._userRepository.findOneBy({ id });
    }
    await this._userRepository.update({ id }, partialEntity);
    entityToReturn ??= this._userRepository.findOneBy({ id });

    return entityToReturn;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this._userRepository.save(user);
  }
}
