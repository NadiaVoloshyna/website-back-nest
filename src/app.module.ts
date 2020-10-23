import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      //rootPath: process.env.PUBLIC_DIR ,
      rootPath: process.env.PUBLIC_DIR || path.join(__dirname, '../../public'),
      //serveRoot: process.env.SERVE_ROOT
      serveRoot: '/static',
    }),
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    PostsModule,
    MulterModule.register({
      dest: './static/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
