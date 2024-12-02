import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TestService } from './test.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeORMConfig } from '../config/typeorm.config';
import { UserV7 } from './userV7.entity';

describe('Performance Test', () => {
  let testService: TestService;
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
        TypeOrmModule.forFeature([User, UserV7]),
      ],
      providers: [TestService],
    }).compile();

    testService = module.get<TestService>(TestService);
    // await testService.initDB();
  });

  describe('typeORM save, insert test', () => {
    it('should test async save method performance', async () => {
      const users = Array.from({ length: length }, (_, i) => ({
        name: `User${i}`,
      }));

      await testService.bulkSave(users);
    });

    it('should test async insert method performance', async () => {
      const users = Array.from({ length: length }, (_, i) => ({
        name: `User${i}`,
      }));
      await testService.bulkInsert(users);
    });

    it('should test loop save method performance', async () => {
      const users = Array.from({ length: length }, (_, i) => ({
        name: `User${i}`,
      }));

      await testService.bulkSaveLoop(users);
    });

    it('should test loop insert method performance', async () => {
      const users = Array.from({ length: length }, (_, i) => ({
        name: `User${i}`,
      }));

      await testService.bulkInsertLoop(users);
    });
  });

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

    for (let i = 100; i <= 100000; i *= 10) {
      it(`should test async insert v7 method performance insert ${i}`, async () => {
        const users = Array.from({ length: i }, (_, i) => ({
          name: `User${i}`,
        }));
        await testService.bulkInsertV7Loop(users);
      });

      it(`should test async insert v4 method performance insert ${i}`, async () => {
        const users = Array.from({ length: i }, (_, i) => ({
          name: `User${i}`,
        }));
        await testService.bulkInsertLoop(users);
      });
    }
    it('should test find user pk uuid v7, ordered by id desc', async () => {
      await testService.findUsersV7();
    });

    it('should test find user pk uuid v4, ordered by id desc', async () => {
      await testService.findUsers();
    });
  });

  afterAll(async () => {
    await testService.initDB();
  });
});
