import { Controller, Get, Put, Request, UseGuards, Body, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.dto';
import { CurrentUser } from './user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return await this.userService.findOneById(id);
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('me')
    // async getCurrentUser(@Request() req): Promise<User> {
    //     return await this.userService.getUser(req.user.id);
    // }

    @Get('me')
    async getCurrentUser(@CurrentUser('email') email: string): Promise<User> {
    return await this.userService.getUser(email);
    }

    @Put('me')
    async updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        console.log(updateUserDto);
        return await this.userService.updateUser(req.user.id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<User> {
        return await this.userService.delete(id);
    }


}
