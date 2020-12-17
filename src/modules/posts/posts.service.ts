import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import Sequelize from 'sequelize';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
import { GetPostFilterDto } from './dto/get-post-filter.dto';
import { File } from '../files/file.entity';
import { User } from '../users/user.entity';
import { POST_REPOSITORY } from '../../core/constants';
import { FILE_REPOSITORY } from '../../core/constants';

@Injectable()
export class PostsService {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: typeof File,
    ) { }

    async create(post: PostDto, userId): Promise<Post> {
        await this.postRepository.create<Post>({ ...post, userId });
        return this.postRepository.findOne({
            where: { ...post, userId },
        	include: [
                { model: File, attributes: { exclude: ['id', 'name', 'postId', 'createdAt', 'updatedAt'] }}, 
                { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
            ],
    	});
    }

    async createFile(postId, file: any, bodyName, userId): Promise<File> {
        await this.fileRepository.create<File>({
          name: bodyName,
          url: `${process.env.URL}/static/${file.filename}`,
          postId: postId, 
          userId: userId,
          where: { userId } 
        });
        return this.fileRepository.findOne({
            where: { userId, postId },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
                { model: Post, attributes: { exclude: ['createdAt', 'updatedAt'] }}, 
                { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
            ],
        });
      }

      async deleteFile(id) {
          console.log(id);
        return await this.fileRepository.destroy({ where: { id } });
    }
      
    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
            include: [
                { model: User, attributes: { exclude: ['password'] } },
                { model: File, attributes: { exclude: ['createdAt', 'updatedAt'] }}, 
            ],     
    	});
    }

    async findOne(id): Promise<Post> {
        return await this.postRepository.findOne({
            where: { id },
        	include: [
                { model: File, attributes: { exclude: ['id', 'name', 'postId', 'createdAt', 'updatedAt'] }}, 
                { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
            ],
    	});
    }

    async getPostWithFilter(filterDto: GetPostFilterDto): Promise<Post[]> {
        const { title, user_id } = filterDto;
        const Op = Sequelize.Op;
        if(user_id !== 0) {
        const posts = await this.postRepository.findAll({
                    order: [
                        ['createdAt', 'desc'],
                    ],
                    where: {
                            title: { [Op.iLike]: '%' + title + '%' },
                    },
                    include: [
                        { model: File, attributes: { exclude: ['id', 'name', 'postId', 'createdAt', 'updatedAt'] }},
                        { model: User, where: {id: [ user_id ]}, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }}
                    ]
                });
        if(!posts.length) {
                    throw new HttpException('Posts matching your search not found', HttpStatus.NOT_FOUND);
                }
                return posts;

        } else {
            const posts = await this.postRepository.findAll({
                order: [
                    ['createdAt', 'desc'],
                ],
                where: {
                        title: { [Op.iLike]: '%' + title + '%' },
                },
                include: [
                    { model: File, attributes: { exclude: ['id', 'name', 'postId', 'createdAt', 'updatedAt'] }},
                    { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }}
                ]
            });
    if(!posts.length) {
                throw new HttpException('Posts matching your search not found', HttpStatus.NOT_FOUND);
            }
            return posts;
        }
    }

    async delete(id, userId) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId): Promise<Post> {
        await this.postRepository.update<Post>(
            { ...data }, 
            { where: { id, userId }, returning: true },
            );
        return this.postRepository.findOne({
            where: { id, userId },
            include: [
                { model: File, attributes: { exclude: ['id', 'name', 'postId', 'createdAt', 'updatedAt'] }}, 
                { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
            ],
    });
}
}
