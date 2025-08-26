import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, Min, MinLength } from "class-validator";

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @MinLength(6)
  @Field(() => String)
  password: string;
}