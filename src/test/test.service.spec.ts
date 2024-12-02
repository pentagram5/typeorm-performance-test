import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TestService } from './test.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeORMConfig } from '../config/typeorm.config';
import { UserV7 } from './userV7.entity';
import { Repository } from 'typeorm';
import { UserAi } from './userAi.entity';
import { uuidv4, uuidv7 } from 'uuidv7';

describe('Performance Test', () => {
  let testService: TestService;
  let userRepository: Repository<User>;
  let userV7Repository: Repository<UserV7>;
  let userIdList;
  let userV7IdList;
  const length = 1000;
  jest.setTimeout(600000);
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [],
          cache: true,
          envFilePath: `.env`,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            await typeORMConfig(configService),
        }),
        TypeOrmModule.forFeature([User, UserV7, UserAi]),
      ],
      providers: [TestService, Repository<User>, Repository<UserV7>],
    }).compile();

    testService = module.get<TestService>(TestService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userV7Repository = module.get<Repository<UserV7>>(
      getRepositoryToken(UserV7),
    );

    // await testService.initDB();
  });

  // describe('typeORM save, insert test', () => {
  //   it('should test async save method performance', async () => {
  //     const users = Array.from({ length: length }, (_, i) => ({
  //       name: `User${i}`,
  //     }));
  //
  //     await testService.bulkSave(users);
  //   });
  //
  //   it('should test async insert method performance', async () => {
  //     const users = Array.from({ length: length }, (_, i) => ({
  //       name: `User${i}`,
  //     }));
  //     await testService.bulkInsert(users);
  //   });
  //
  //   it('should test loop save method performance', async () => {
  //     const users = Array.from({ length: length }, (_, i) => ({
  //       name: `User${i}`,
  //     }));
  //
  //     await testService.bulkSaveLoop(users);
  //   });
  //
  //   it('should test loop insert method performance', async () => {
  //     const users = Array.from({ length: length }, (_, i) => ({
  //       name: `User${i}`,
  //     }));
  //
  //     await testService.bulkInsertLoop(users);
  //   });
  // });

  describe('pk uuid v4 vs v7 save, insert test', () => {
    // it('should test loop insert v7 method performance', async () => {
    //   const users = Array.from({ length: length }, (_, i) => ({
    //     // id: uuidv7(),
    //     name: `User${i}`,
    //   }));
    //
    //   await testService.bulkInsertV7Loop(users);
    // });
    //
    // it('should test loop insert method performance', async () => {
    //   const users = Array.from({ length: length }, (_, i) => ({
    //     name: `User${i}`,
    //   }));
    //
    //   await testService.bulkInsertLoop(users);
    // });
    //
    for (let si = 1; si <= 100; si++) {
      it(`should test async insert v7 method performance insert ${10000}`, async () => {
        const users = Array.from({ length: 10000 }, (_, i) => ({
          id: uuidv7(),
          name: `User${i}`,
        }));
        await testService.bulkInsert(users);
      });

      it(`should test async insert v4 method performance insert ${10000}`, async () => {
        const users = Array.from({ length: 10000 }, (_, i) => ({
          id: uuidv4(),
          name: `User${i}`,
        }));
        await testService.bulkInsertV7(users);
      });

      it(`should test async insert Ai method performance insert ${10000}`, async () => {
        const users = Array.from({ length: 10000 }, (_, i) => ({
          name: `User${i}`,
        }));
        await testService.bulkInsertAi(users);
      });
    }
    // it('should test find user pk uuid v7, ordered by id desc', async () => {
    //   await userV7Repository.find({
    //     where: {
    //       id: In(userV7IdList),
    //     },
    //   });
    // });
    //
    // it('should test find user pk uuid v4, ordered by id desc', async () => {
    //   await userRepository.find({
    //     where: {
    //       id: In(userIdList),
    //     },
    //   });
    // });
  });
  afterAll(async () => {
    // await testService.initDB();
  });
});
