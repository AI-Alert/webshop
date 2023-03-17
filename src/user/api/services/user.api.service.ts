import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities';

@Injectable()
export class UserApiService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  findAll(skip?: number, limit?: number): Promise<UserEntity[]> {
    return this._userRepository.find({ skip, take: limit });
  }
}
