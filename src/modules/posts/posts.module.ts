import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../../core/database/database.module';
import { fileProviders } from '../files/file.providers';

@Module({
  imports: [
    MulterModule.register({
      dest: 'static/uploads',
    }),
    DatabaseModule,

  ],
  providers: [PostsService, ...postsProviders, ...fileProviders],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
