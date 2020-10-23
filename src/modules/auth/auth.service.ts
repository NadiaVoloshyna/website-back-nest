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

    public async create(user) {
        const salt = await bcrypt.genSalt();
        // hash the password
        const pass = await this.hashPassword(user.password, salt);
        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });
        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];
        // generate token
        const token = await this.generateToken(result);
        // return the user and the token
        return { user: result, token };
    }

    private async hashPassword(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    async validateUser(username: string, pass: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
          }
        // find if user password match
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
    
}
