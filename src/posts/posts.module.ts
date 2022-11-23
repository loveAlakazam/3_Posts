import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../entities/Posts';
import { Users } from '../entities/Users';
import { PostsRepository } from './posts.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Users]),
    HttpModule, // axios 를 사용하기 위한 HttpModule 넣기
    ConfigModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
