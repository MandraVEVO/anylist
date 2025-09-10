import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS, SEED_LISTS } from './data/seed-data';
import { List } from 'src/lists/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';
import { ListsService } from 'src/lists/lists.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        private readonly itemsService: ItemsService,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        

        private readonly usersService: UsersService,

        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
        private readonly listsItemService: ListItemService,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        private readonly listsService: ListsService,


    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }


    async executeSeed() {
        
        if ( this.isProd ) {
            throw new UnauthorizedException('We cannot run SEED on Prod');
        }

        // Limpiar la base de datos BORRAR TODO
        await this.deleteDatabase();

        // Crear usuarios
        const user = await this.loadUsers();

        // Crear items
        await this.loadItems( user );

       const list = await this.loadLists( user );

        // Crear listItems
        const items = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {});
        await this.loadListItems( list, items )

        return true;
    }

    async deleteDatabase() {


        //list-items
        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar listas
        await this.listRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar items
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar users
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

    }

    async loadUsers(): Promise<User> {

        const users: User[] = [];

        for (const user of SEED_USERS ) {
            users.push( await this.usersService.create( user ) )
        }

        return users[0];

    }

    async loadItems(  user: User ): Promise<void> {
        const items: Item[] = [];

        for(const item of SEED_ITEMS) {
            items.push( await this.itemsService.create( item, user ) );
        }

        await Promise.all(items);

    }

      async loadLists( user: User ): Promise<List> {

        const lists: List[] = [];

        for (const listInput of SEED_LISTS ) {
            lists.push( await this.listsService.create( listInput, user ) )
        }

        return lists[0];

    }

    async loadListItems( list: List, items: Item[] ) {

        for (const item of items ) {
            await this.listsItemService.create({
                quantity: Math.round( Math.random() * 10 ),
                completed: Math.round( Math.random() * 1 ) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            });
        }

    }

}