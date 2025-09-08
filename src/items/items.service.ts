import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs/index';
import { Item } from './entities/item.entity';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user:User): Promise<Item> {

    const newItem = this.itemsRepository.create({...createItemInput, user});
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    //TODO: filtrar, paginar, por usuario
    const{limit, offset} = paginationArgs;
    const {search} = searchArgs;

    //haciendo uso de query builder
    const queryBuilder = this.itemsRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where('"userId" = :userId', {userId: user.id});

    if(search){
      queryBuilder.andWhere('LOWER(name) like :name', {name: `%${search.toLowerCase()}%`});
    }


    return queryBuilder.getMany();


    // return await this.itemsRepository.find({ es demasiado grande y no optimo 
    //   take: limit, 
    //   skip: offset,
    //   where: {
    //     user:{
    //       id: user.id
    //     },
    //     name: Like(`%${search}%`)
    //   }
    // });
  }

 async findOne( id: string, user: User ): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ 
      id,
      user: {
        id: user.id
      }
    });

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);
    // item.user = user;
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id,user);
    const item = await this.itemsRepository.preload(updateItemInput )
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return await this.itemsRepository.save(item);
  }

  async remove(id: string,user:User): Promise<Item> {
    //TODO: soft delete, integridad referencia
    const item = await this.findOne(id,user);
    await this.itemsRepository.remove(item);
    return {...item,id}
  }


  async itemCountByUser(user: User): Promise<number>{
    return this.itemsRepository.count(
      {where:{
        user:{
          id:user.id
        }
      }}
    );
  }
}
