import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExecutionContext } from '@nestjs/graphql';
import { retry } from 'rxjs';
import { ValidRoles } from '../enums/valid-roles.enum';


export const CurrentUser = createParamDecorator(
    (roles: ValidRoles[] = [], context: ExecutionContext) => {

        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;

        if(!user){
            throw new InternalServerErrorException('No user inside the request - make sure that we used AuthGuard')
        }
        if(roles.length === 0) return user;

        for (const role of user.roles){
            //TODO: ELIMINAR VALID ROLES
            if(roles.includes(role)){
                return user;
            }
        }
            

        throw new ForbiddenException(`User ${user.username} does not have the necessary roles`);
})