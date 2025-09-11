import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'; //importante para usar apollo sandbox 2025
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';


@Module({
  imports: [

    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async( jwtService: JwtService ) => ({
        playground: false,
        autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
        plugins: [
          process.env.NODE_ENV === 'development'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
        ],
        context({ req }) {
          // const token = req.headers.authorization?.replace('Bearer ','');
          // // if ( !token ) throw Error('Token needed');

          // const payload = jwtService.decode( token );
          // // if ( !payload ) throw Error('Token not valid');
          // console.log({ payload });
        }
      })
    }),
  // GraphQLModule.forRoot<ApolloDriverConfig>({
  //   driver: ApolloDriver,
  //    // debug: false,
  //      playground: false,
  //      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
  //      plugins: [
  //       ApolloServerPluginLandingPageLocalDefault()
  //      ],
  //          }),
           TypeOrmModule.forRoot({
            type: 'postgres',
            ssl:(process.env.STATE === 'prod' ) //para deploy en digitalocean
            ?{
              rejectUnauthorized: false,
              sslmode: 'require'
            }: 
            false as any,
            host: process.env.DB_HOST,
            port: +(process.env.DB_PORT ?? 5432),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
           }),
           ItemsModule,
           UsersModule,
           AuthModule,
           SeedModule,
           CommonModule,
           ListsModule,
           ListItemModule,
     ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(){
    console.log('STATE:', process.env.STATE);
    console.log('HOST:', process.env.DB_HOST);
    console.log('PORT:', process.env.DB_PORT);
    console.log('USERNAME:', process.env.DB_USERNAME);
    console.log('PASSWORD:', process.env.DB_PASSWORD);
    console.log('NAME:', process.env.DB_NAME);
  }
}