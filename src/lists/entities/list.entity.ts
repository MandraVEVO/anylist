import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'lists'})
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(()=> ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;


  //relacion, index
  @ManyToOne(()=> User, (user) => user.lists, {nullable: false, lazy: true})
  @Index('userId-lists-index')
  @Field(() => User)
  user: string;
}
