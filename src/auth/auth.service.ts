import { Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { User } from 'src/users/entities/user.entity';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';

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
}
