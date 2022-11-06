import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../entities/Posts';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Users])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
