import { BadGatewayException, Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { User } from 'src/users/entities/user.entity';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
    ){}

    async signup(signupInput:SignupInput):Promise<AuthResponse>{
      
        //crear usuario
        const user = await this.usersService.create(signupInput);

        //token
        const token = 'abc123';

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
        const token = 'abcd1234'
        //token
        return {
            user,
            token
        };
    }
}
