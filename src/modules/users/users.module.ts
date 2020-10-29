import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule
  ],
  controllers: [UsersController],
  providers: [
      UsersService,
      ...usersProviders,
  ],
  exports: [UsersService],

})
export class UsersModule {}



