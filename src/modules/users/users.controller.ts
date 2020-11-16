import { Controller, Get, Put, Request, UseGuards, Body, Param, Delete, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { CurrentUser } from './user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get('search')
    async getUser(@Query() filterDto: GetUserFilterDto) {
        return await this.userService.getUserWithFilter(filterDto);
    }

    // @Get('me')
    // async getCurrentUser(@Request() req): Promise<User> {
    //     console.log(req.user.id);
    //     return await this.userService.getUser(req.user.id);
    // }

    @Get('me')
    async getCurrentUser(@CurrentUser('email') email: string): Promise<User> {
        console.log(email);
    return await this.userService.getUser(email);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return await this.userService.findOneById(id);
    }

    @Put('me')
    async updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        console.log(updateUserDto);
        return await this.userService.updateUser(req.user.id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        const deleted = await this.userService.delete(id);
        if(deleted) {
            return 'Successfully deleted';
        }
    }
}
