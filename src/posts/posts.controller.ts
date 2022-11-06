import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { Users } from '../entities/Users';
import { User } from '../auth/auth.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@User() user: Users, @Body() createPostDto: CreatePostDto) {
    return await this.postsService.createPost(user, createPostDto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOnePost(+id);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(+id, updatePostDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  removePost(@Param('id') id: string) {
    return this.postsService.removePost(+id);
  }
}
