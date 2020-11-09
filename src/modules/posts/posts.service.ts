import { Injectable, Inject } from '@nestjs/common';
import Sequelize, { Op } from 'sequelize';
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
        return await this.postRepository.create<Post>({ ...post, userId });
    }

    async createFile(id, file: any, bodyName): Promise<File> {
        return await this.fileRepository.create({
          name: bodyName,
          url: `${process.env.URL}/static/${file.filename}`,
          postId: id 
        });
      }
      
    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
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

    async getPostWithFilter(filterDto: GetPostFilterDto, userId): Promise<Post[]> {
        const { search } = filterDto;
        const Op = Sequelize.Op;
        return await this.postRepository.findAll({
            order: [
                ['createdAt', 'DESC'],
            ],
            where: {
                title: { [Op.iLike]: '%' + search + '%' },     
            },
            include: [
                { model: File, attributes: { exclude: ['id', 'name', 'postId', 'createdAt', 'updatedAt'] }},
                { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
            ]
        });
    }

//     const Op = Sequelize.Op;
// Article.findAll({
//   where: {
//     [Op.or]: [
//      title: { [Op.like]: '%' + searchQuery + '%' },
//      description: { [Op.like]: '%' + searchQuery2 + '%' }
//     ]
//   }
// });

//     where = {
//      [Op.or]: [
//        { name: { [Op.like]: `%${req.query.query_string}%` } },
//        { description: { [Op.like]: `%${req.query.query_string}%` } }
//      ]
//    }
//    });

    async delete(id, userId) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId) {
        const [numberOfAffectedRows, [updatedPost]] = await this.postRepository.update(
            { ...data }, 
            { where: { id, userId }, returning: true },
            );
        return { numberOfAffectedRows, updatedPost };
    }
}