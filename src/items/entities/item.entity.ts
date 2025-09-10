import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';



@Entity({name:'items'})
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  // @Field(() => Float)
  // @Column()
  // quantity: number;

  @Field(() => String,{ nullable: true })
  @Column({ nullable: true })
  quantityUnit?: string; //g, ml, kg, tsp

  //stores
  //user

  @ManyToOne(()=> User, (user)=> user.items,{nullable: false, lazy: true})
  @Index('index')
  @Field(() => User)
  user: User;

@OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field( () => [ListItem] )
  listItem: ListItem[]


}

