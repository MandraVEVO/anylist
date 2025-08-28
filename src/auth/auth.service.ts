import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { User } from 'src/users/entities/user.entity';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    private getJwtToken(userId:string){
        return this.jwtService.sign({id:userId});
    }

    async signup(signupInput:SignupInput):Promise<AuthResponse>{
      
        //crear usuario
        const user = await this.usersService.create(signupInput);

        //token
        const token = this.getJwtToken(user.id);

        return {
            user,
            token
        };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse>{

        const {email,password} = loginInput;
        const user = await this.usersService.findOneByEmail(email);

        if(!bcrypt.compareSync(password, user.password)){
            throw new BadGatewayException('Email / password dont match')
        }
      
        //validar usuario
        const token = this.getJwtToken(user.id);
        //token
        return {
            user,
            token
        };
    }

    async validateUser(id: string): Promise<Omit<User, 'password'>> {
        const user = await this.usersService.findOneById(id);
        if(user.isBlocked) 
            throw new UnauthorizedException('User is blocked, talk with an admin');
       
        const {password, ...userReset} = user;
        return userReset;
        // return user;

    }
}
