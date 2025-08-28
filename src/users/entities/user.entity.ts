import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({name:'users'})
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Field(() => String)
  @Column()
  fullname: string

  @Field(() => String)
  @Column({ unique: true })
  email: string

  @Column()
  
  password: string

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[]

  @Field(() => Boolean)
  @Column({ 
    type: 'boolean',
    default: false })
  isBlocked: boolean
}
