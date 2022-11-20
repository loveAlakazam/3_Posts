import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Posts } from '../entities/Posts';
import { Users } from '../entities/Users';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationOption } from './dto/pagination-option.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  async createPost(user: Users, createPostDto: CreatePostDto) {
    const result = await this.postsRepository
      .createQueryBuilder('posts')
      .insert()
      .into(Posts)
      .values({ ...createPostDto, userId: user.userId })
      .execute();

    return result;
  }

  async findAllPosts(options: PaginationOption) {
    const { page, pageSize } = options;

    // 모든글
    // 추가로드는 20개 단위로 나타낸다.
    // 비밀번호를 제외한 나머지
    const posts = await this.postsRepository
      .createQueryBuilder('posts')
      .innerJoin('posts.User', 'users')
      .orderBy('posts.createdAt', 'DESC')
      .limit(pageSize)
      .offset(pageSize * (page - 1))
      .select(['postId', 'title', 'users.userId AS userId', 'name'])
      .getRawMany();

    return { list: posts, page: page, pageSize: posts.length };
  }

  async findOnePostAllInfo(postId: number) {
    return await this.postsRepository
      .createQueryBuilder('posts')
      .where('postId = :postId', { postId: postId })
      .getOne();
  }

  async findOnePost(postId: number) {
    return await this.postsRepository
      .createQueryBuilder('posts')
      .innerJoin('posts.User', 'users')
      .select([
        'postId',
        'postType',
        'title',
        'content',
        'users.userId AS userId',
        'name',
        'postPassword',
      ])
      .where('postId = :postId', { postId })
      .getRawOne();
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) {
    return await this.postsRepository
      .createQueryBuilder('posts')
      .update(Posts)
      .set({
        title: updatePostDto.title,
        content: updatePostDto.content,
      })
      .where('postId = :postId', { postId: postId })
      .execute();
  }

  async deletePost(postId: number) {
    return await this.postsRepository
      .createQueryBuilder('posts')
      .softDelete()
      .where('postId = :postId', { postId: postId })
      .execute();
  }
}
