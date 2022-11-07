import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { Users } from '../entities/Users';
import { User } from '../auth/auth.decorator';
import { RemovePostDto } from './dto/remove-post.dto';
import { PrivatePostDetailDto } from './dto/private-post-detail.dto';
import { PaginationOption } from './dto/pagination-option.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * [POST] /api/posts/
   */
  @UseGuards(AuthenticatedGuard)
  @Post()
  async createPost(@User() user: Users, @Body() createPostDto: CreatePostDto) {
    return await this.postsService.createPost(user, createPostDto);
  }

  /**
   * [PATCH] /api/posts/:postId
   */
  @UseGuards(AuthenticatedGuard)
  @Patch(':postId')
  async updatePost(
    @User() user: Users,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updatePost(user, postId, updatePostDto);
  }

  /**
   * [DELETE] /api/posts/:postId
   */
  @UseGuards(AuthenticatedGuard)
  @Delete(':postId')
  async removePost(
    @User() user: Users,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() removePostDto: RemovePostDto,
  ) {
    return await this.postsService.removePost(user, postId, removePostDto);
  }

  /**
   * [GET] /api/posts/
   *
   * 모든 사용자는 헌 페이지 내에서 모든 게시글을 최신글 순서로 확인할 수 있다.
   * 한 페이지에는 최대 20개의 게시물을 볼 수 있다.
   * @returns
   */
  @Get()
  async findAll(@Query() option: PaginationOption) {
    return await this.postsService.findAllPosts(option);
  }

  /**
   * [GET] /api/posts/:id
   *
   * @param
   * @returns
   */
  @Get(':postId')
  async findOne(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() privatePostDetailDto: PrivatePostDetailDto,
  ) {
    return await this.postsService.findOnePost(postId, privatePostDetailDto);
  }
}
