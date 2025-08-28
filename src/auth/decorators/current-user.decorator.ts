import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExecutionContext } from '@nestjs/graphql';
import { retry } from 'rxjs';


export const CurrentUser = createParamDecorator(
    (roles = [], context : ExecutionContext)=>{

        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;

        if(!user){
            throw new InternalServerErrorException('No user inside the request - make sure that we used AuthGuard')
        }

        return user;
})