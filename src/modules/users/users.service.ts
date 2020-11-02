import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto, UpdateUserDto } from './dto/user.dto';
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
    //          attributes: { exclude: ['password'] },
    // });
    // }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ 
             where: { email },
             attributes: { exclude: ['password'] }, 
    });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const [updatedUser] = await this.userRepository.update({ ...updateUserDto }, { where: { id }, returning: true });
        return { updatedUser };

    //     this.userRepository.update({id}, updateUserDto);
    //     return await this.userRepository.findOne({
    //          where: { id }
    // });     
    }
}


