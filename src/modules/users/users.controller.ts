import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
//import { User } from './user.entity';
//import { UserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get(':me')
    async getCurrentUser(@Request() req) {
        return await this.userService.findOneById(req.user.id);
    }

    
}