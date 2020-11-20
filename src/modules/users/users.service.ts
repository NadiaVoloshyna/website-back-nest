import { Injectable, Inject, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserDto, UpdateUserDto } from './dto/user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
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
        const user =  await this.userRepository.findOne<User>({ 
            where: { id },
            //attributes: { exclude: ['password'] },
        });
        if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll<User> ({
            attributes: { exclude: ['password'] }, 
        });
    }

    // async getUser(id: number): Promise<User> {
    //     return await this.userRepository.findOne<User>({ 
    //          where: { id },
    //          attributes: { exclude: ['password'] },
    // });
    // }

    async getUser(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ 
             where: { email },
             attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }, 
    });
    }

    async getUserWithFilter(filterDto: GetUserFilterDto) {
        const { search } = filterDto; 
        console.log(search);
        let users = await this.findAll();
        if(search) {
            users = users.filter(user => 
                user.name.toLowerCase().includes( search.toLowerCase() ),
                );
            }
            if(!users.length) {
                throw new HttpException('Users matching your search not found', HttpStatus.NOT_FOUND);
            }
            return users;
        }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {  
        if(updateUserDto.current_password !== '') {
        const user = await this.findOneById(id);
        const match = await this.comparePassword(updateUserDto.current_password, user.password);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }
        }
        if(updateUserDto.new_password !== '' && updateUserDto.current_password !== '') {  
        const pass = await this.hashPassword(updateUserDto.new_password);
        await this.userRepository.update({ ...updateUserDto, password: pass }, { where: { id }, returning: true });
        return await this.userRepository.findOne({
            where: { id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        }); 
        } else {
        await this.userRepository.update({ ...updateUserDto }, { where: { id }, returning: true });
        return await this.userRepository.findOne({
            where: { id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        }); 
        }
    }
    
    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword); 
        return match; 
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async delete(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if(!user) {
            throw new HttpException('User with this ID not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.destroy({
            where: { id },
        });
        return user;
    }
}



