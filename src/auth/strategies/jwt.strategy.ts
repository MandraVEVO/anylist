import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";
import { Auth } from "typeorm";
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET') || '',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<Omit<User, "password">>{
        const {id} = payload;
        const user = await this.authService.validateUser(id);
        
        return user;
        
    }
  }

