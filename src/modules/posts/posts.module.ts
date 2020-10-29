import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../../core/database/database.module';
import { fileProviders } from '../files/file.providers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MulterModule.register({
      dest: 'static/uploads',
    }),
    DatabaseModule,
    AuthModule,
  ],
  providers: [PostsService, ...postsProviders, ...fileProviders],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
