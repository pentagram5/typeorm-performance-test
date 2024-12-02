import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserV7 } from './userV7.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserV7)
    private readonly userV7Repository: Repository<UserV7>,
    private readonly dataSource: DataSource,
  ) {}

  async bulkInsert(users: Partial<User>[]) {
    await this.userRepository.insert(users);
  }

  async bulkInsertV7(users: Partial<User>[]) {
    await this.userV7Repository.insert(users);
  }

  async bulkSave(users: Partial<User>[]) {
    const userEntities = users.map((user) => this.userRepository.create(user));
    await this.userRepository.save(userEntities);
  }

  async bulkInsertLoop(users: Partial<User>[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    // T. 트랜잭션 시작
    await queryRunner.startTransaction();
    for (const user of users) {
      await queryRunner.manager.insert(User, user);
    }
    await queryRunner.commitTransaction();
  }

  async bulkInsertV7Loop(users: Partial<User>[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    // T. 트랜잭션 시작
    await queryRunner.startTransaction();
    for (const user of users) {
      await queryRunner.manager.insert(UserV7, user);
    }
    await queryRunner.commitTransaction();
  }

  async bulkSaveLoop(users: Partial<User>[]) {
    for (const user of users) {
      const userEntity = this.userRepository.create(user);
      await this.userRepository.save(userEntity);
    }
  }

  async findUsers(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findUsersV7(): Promise<User[]> {
    return this.userV7Repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async initDB() {
    await this.userRepository.clear();
    await this.userV7Repository.clear();
  }
}
