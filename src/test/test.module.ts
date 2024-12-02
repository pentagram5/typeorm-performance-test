import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TestService } from './test.service';
import { UserV7 } from './userV7.entity';
import { UserAi } from './userAi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserV7, UserAi])],
  providers: [TestService],
})
export class TestModule {}
