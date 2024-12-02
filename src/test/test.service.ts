import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserV7 } from './userV7.entity';
import { UserAi } from './userAi.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserV7)
    private readonly userV7Repository: Repository<UserV7>,
    @InjectRepository(UserAi)
    private readonly userAiRepository: Repository<UserAi>,
    private readonly dataSource: DataSource,
  ) {}

  async bulkInsert(users: Partial<User>[]) {
    await this.userRepository.insert(users);
  }

  async bulkInsertV7(users: Partial<UserV7>[]) {
    await this.userV7Repository.insert(users);
  }

  async bulkInsertAi(users: Partial<UserAi>[]) {
    await this.userAiRepository.insert(users);
  }

  async bulkSave(users: Partial<User>[]) {
    const userEntities = users.map((user) => this.userRepository.create(user));
    await this.userRepository.save(userEntities);
  }

  async bulkInsertLoop(users: Partial<User>[]) {
    for (const user of users) {
      await this.userRepository.insert(user);
    }
  }

  async bulkInsertV7Loop(users: Partial<UserV7>[]) {
    for (const user of users) {
      await this.userV7Repository.insert(user);
    }
  }

  async bulkInsertAiLoop(users: Partial<UserAi>[]) {
    for (const user of users) {
      await this.userAiRepository.insert(user);
    }
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
    await this.userAiRepository.clear();
  }
}
