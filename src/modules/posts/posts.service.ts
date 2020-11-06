import { Injectable, Inject } from '@nestjs/common';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
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
                { model: User, attributes: { exclude: ['password'] } }],
    	});
    }



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