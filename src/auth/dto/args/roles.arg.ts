import { IsArray } from 'class-validator';
import { ValidRoles } from '../../enums/valid-roles.enum';
import { Args, ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ValidRolesArgs{

    @Field(()=>[ValidRoles], {nullable: true})
    @IsArray()
    roles:ValidRoles[] = [];
}