import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { File } from '../files/file.entity';
import { PostDto } from './dto/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../../utils/file-upload.utils';
import { diskStorage } from 'multer';
import * as path from "path";

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) { }

    @Get()
    async findAll() {
        return await this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postService.findOne(id);
        if (!post) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return post;
    }

    

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
        return await this.postService.create(post, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.PUBLIC_DIR || path.join(__dirname, '../../../public'),
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
    async uploadedFile(@Param('id') id: number, @UploadedFile() file, @Body() body ): Promise<File> {
    return await this.postService.createFile(id, file, body.name);
  }
  
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() post: PostDto, @Request() req): Promise<PostEntity> {
        const { numberOfAffectedRows, updatedPost } = await this.postService.update(id, post, req.user.id);
        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return updatedPost;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        const deleted = await this.postService.delete(id, req.user.id);
        if (deleted === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return 'Successfully deleted';
    }
}

   

