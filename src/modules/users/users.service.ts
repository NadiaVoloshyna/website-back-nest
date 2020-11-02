import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User
        ) { }

    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll<User> ();
    }

    // async getUser(id): Promise<User> {
    //     return await this.userRepository.findOne<User>({ 
    //          where: { id },
    // });
    // }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ 
             where: { email },
    });
}
}
