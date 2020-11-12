import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
            return result;
        }     
        
    public async login(user) {
        const token = await this.generateToken(user);
        return { token };
    }

    public async create(user) {
        const pass = await this.hashPassword(user.password);
        const newUser = await this.userService.create({ ...user, password: pass });
        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];
        const token = await this.generateToken(user);
        return { token };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(JSON.parse(JSON.stringify(user)));
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
  
    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    
}
