import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, Min, MinLength } from "class-validator";

@InputType()
export class SignupInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  fullname: string;

  @MinLength(6)
  @Field(() => String)
  password: string;
}