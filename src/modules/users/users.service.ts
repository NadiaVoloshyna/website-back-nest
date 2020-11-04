import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

    // async updateUser(id: number, updateUserDto: UpdateUserDto) {
    //     console.log(updateUserDto.new_password);
    //     const pass = await this.hashPassword(updateUserDto.new_password);
    //     console.log(pass);
    //     return await this.userRepository.update({ ...updateUserDto, password: pass }, { where: { id }, returning: true });
    //     return await this.userRepository.findOne({
    //          where: { id },
    //          attributes: { exclude: ['password'] },
    // });         
    // }

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
        return await this.userRepository.update({ ...updateUserDto, password: pass }, { where: { id }, returning: true });
        } else {
        return await this.userRepository.update({ ...updateUserDto }, { where: { id }, returning: true });
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
}

