import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}
  async findProfileDetails(userId: number): Promise<UserEntity> {
    return await this._userRepository.findOneById(userId);
  }

  async editProfileDetails(
    userId: number,
    partialEntity: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this._userRepository.update({ id: userId }, partialEntity);
    return await this._userRepository.findOneBy({
      id: userId,
    });
  }
}
