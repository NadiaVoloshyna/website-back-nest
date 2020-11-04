import { Controller, Get, Put, Request, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.dto';
import { CurrentUser } from './user.decorator';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('me')
    // async getCurrentUser(@Request() req): Promise<User> {
    //     return await this.userService.getUser(req.user.id);
    // }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getCurrentUser(@CurrentUser('email') email: string): Promise<User> {
    return await this.userService.getUser(email);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        console.log(updateUserDto);
        return await this.userService.updateUser(req.user.id, updateUserDto);
    }

}
