import { Controller, Get, Post, Put, Delete, Param, Query, Body, NotFoundException, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { File } from '../files/file.entity';
import { PostDto } from './dto/post.dto';
import { GetPostFilterDto } from './dto/get-post-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../../utils/file-upload.utils';
import { diskStorage } from 'multer';
import * as path from "path";

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) { }

    @Get()
    async findAll() {
        return await this.postService.findAll();
    }

    @Get('search')
    async getPost(@Query() filterDto: GetPostFilterDto) {
        return await this.postService.getPostWithFilter(filterDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postService.findOne(id);
        if (!post) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return post;
    }

    @Post()
    async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
        return await this.postService.create(post, req.user.id);
    }

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
    async uploadedFile(@Param('id') postId: number, @UploadedFile() file, @Body() body, @Request() req ): Promise<File> {
    return await this.postService.createFile(postId, file, body.name, req.user.id);
    }
    
    @Delete('/delete/:id')
    async deleteFile(@Param('id') id: number) {
        const deleted = await this.postService.deleteFile(id);
        if (deleted === 0) {
            throw new NotFoundException('This File doesn\'t exist');
        }
        return 'Successfully deleted';
    }
  
    @Put(':id')
    async update(@Param('id') id: number, @Body() post: PostDto, @Request() req): Promise<PostEntity> {
        const { numberOfAffectedRows, updatedPost } = await this.postService.update(id, post, req.user.id);
        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return updatedPost;
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        const deleted = await this.postService.delete(id, req.user.id);
        if (deleted === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return 'Successfully deleted';
    }
}

   

