import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    TypeOrmModule.forFeature([Item, User]),
    ConfigModule,
    ItemsModule,
    UsersModule

  ],
})
export class SeedModule {}
