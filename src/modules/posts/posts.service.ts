import { Injectable, Inject } from '@nestjs/common';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
import { User } from '../users/user.entity';
import { POST_REPOSITORY } from '../../core/constants';
//import { FILE_REPOSITORY } from '../../core/constants';

@Injectable()
export class PostsService {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
        //@Inject(FILE_REPOSITORY) private readonly fileRepository: typeof File,
    ) { }

    async create(post: PostDto, userId): Promise<Post> {
        return await this.postRepository.create<Post>({ ...post, userId });
    }

    // public async createAvatar(postId: number, file: any): Promise<File> {
    //     const createAvatar = await this.fileRepository.save({
    //       name: file.filename,
    //      url: `${process.env.URL}/static/${file.filename}`,
    //       // url: `${process.env.URL}/${file.filename}`,
    //     });
    //     await this.postRepository.save({ id: postId, avatar: createAvatar });
    //     return createAvatar;
    //   }
    

    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async findOne(id): Promise<Post> {
        return await this.postRepository.findOne({
        	where: { id },
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async delete(id, userId) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId) {
        const [numberOfAffectedRows, [updatedPost]] = await this.postRepository.update({ ...data }, { where: { id, userId }, returning: true });

        return { numberOfAffectedRows, updatedPost };
    }
}