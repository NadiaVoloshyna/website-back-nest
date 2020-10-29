import { Controller, Get, Request } from '@nestjs/common';
//import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
//import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @Get('me')
    async getCurrentUser(@Request() req): Promise<User> {
        console.log(req.user);
        return await this.userService.getCurrent(req.user.id);
    }
}