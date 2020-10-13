import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
//import { UsersController } from './users.controller';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [DatabaseModule],
  //controllers: [UsersController],
  providers: [
      UsersService,
      ...usersProviders,
  ],
  exports: [UsersService],

})
export class UsersModule {}



