import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateHash } from '@utils/auth.utils';

import { CreateAdminDto } from '@src/admin/auth/dto';
import { AdminEntity } from '@src/entities';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly _adminRepository: Repository<AdminEntity>,
  ) {}

  async findByEmail(email: string): Promise<AdminEntity> {
    const admin = await this._adminRepository.findOne({ where: { email } });
    if (admin) {
      return admin;
    }
    throw new UnauthorizedException();
  }

  async create(dto: CreateAdminDto) {
    const adminBody: any = {
      passwordHash: await generateHash(dto.password),
      passwordSalt: 'test',
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
    };
    return await this._adminRepository.save(adminBody);
  }
}
