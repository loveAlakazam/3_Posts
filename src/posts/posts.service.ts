import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { InsertResult } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as bcrypt from 'bcrypt';
import { PostType } from '../entities/enums/PostType';

import { PRIVATE_PASSWORD_REGEX } from 'src/common/regex/regex';
import { PaginationOption } from './dto/pagination-option.dto';
import { RemovePostDto } from './dto/remove-post.dto';
import { PrivatePostDetailDto } from './dto/private-post-detail.dto';
import { PostInfoWithoutPasswordDto } from './dto/post-info-without-password.dto';
import { PostsRepository } from './posts.repository';
import { Users } from 'src/entities/Users';
import { Posts } from 'src/entities/Posts';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  /**
   * 입력받은 평문에 bcrypt 알고리즘을 적용합니다. (비밀번호 암호화)
   * @param plainText
   * @returns
   */
  private async hash(plainText: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(plainText, saltOrRounds);
  }

  /**
   * 저장되어 있는 hashPassword 와 입력받은 password를 비교합니다.
   * @param password
   * @param hashPassword
   * @returns
   */
  private async isHashValid(password, hashPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  /** CRRUD */

  /**
   * @description : 비밀글 수정/삭제 시 비밀번호 요구
   * @param postType
   * @returns
   */
  private async checkPostType(post: Posts, inputPassword: string) {
    switch (post.postType) {
      case PostType.PRIVATE_POST: {
        // 비공개글
        // 비밀번호 검사
        if (!inputPassword) {
          throw new BadRequestException('비밀번호를 입력해주세요.');
        }

        const isValid = await this.isHashValid(
          inputPassword,
          post.postPassword,
        );
        if (!isValid) {
          throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }
        return;
      }
      case PostType.PUBLIC_POST: {
        // 공개글
        return;
      }

      default:
        throw new BadRequestException('존재하지 않는 게시판 종류 입니다.');
    }
  }

  /**
   * @description : 게시글 생성
   * @param user
   * @param createPostDto
   * @returns
   */
  async createPost(
    user: Users,
    createPostDto: CreatePostDto,
  ): Promise<InsertResult> {
    try {
      if (createPostDto.postType === PostType.PRIVATE_POST) {
        const originPassword = createPostDto.postPassword;
        if (!originPassword) {
          throw new BadRequestException('비밀번호를 입력해주세요');
        }

        // 비밀번호 정규표현식
        const isRegex = originPassword.match(PRIVATE_PASSWORD_REGEX);
        if (!isRegex)
          throw new BadRequestException(
            '비밀번호는 6자리 이상이며, 숫자는 최소 1개가 필요합니다.',
          );

        //입력받은 비밀번호를 암호화
        const hashedPostPassword = await this.hash(originPassword);
        createPostDto.postPassword = hashedPostPassword;
      }

      // Post 추가
      return await this.postsRepository.createPost(user, createPostDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllPosts(options: PaginationOption) {
    return await this.postsRepository.findAllPosts(options);
  }

  async findOnePost(
    postId: number,
    privatePostDetailDto: PrivatePostDetailDto,
  ): Promise<PostInfoWithoutPasswordDto> {
    try {
      const post = await this.postsRepository.findOnePost(postId);

      if (post.postType === PostType.PRIVATE_POST) {
        // 비밀번호 체크
        await this.checkPostType(post, privatePostDetailDto.postPassword);

        //비밀번호를 제외한 나머지 정보를 준다.
        post.postPassword = null;
      }

      return {
        postId: post.postId,
        postType: post.postType,
        title: post.title,
        content: post.content,
        userId: post.userId,
        name: post.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePost(user: Users, postId: number, updatePostDto: UpdatePostDto) {
    try {
      const { title, content, postPassword } = updatePostDto;

      // 업데이트 대상 게시물 체크
      const post = await this.postsRepository.findOnePostAllInfo(postId);

      // 유저 체크
      if (user.userId !== post.userId) {
        throw new UnauthorizedException('접근권한이 없습니다.');
      }
      // 타입체크
      await this.checkPostType(post, postPassword);

      // 수정
      return await this.postsRepository.updatePost(postId, updatePostDto);
    } catch (error) {
      throw error;
    }
  }

  async removePost(user: Users, postId: number, removePostDto: RemovePostDto) {
    try {
      const postPassword = removePostDto.postPassword;

      // 삭제 대상 게시물 체크
      const post = await this.postsRepository.findOnePostAllInfo(postId);

      // 유저 체크
      if (user.userId !== post.userId) {
        throw new UnauthorizedException('접근권한이 없습니다.');
      }

      // 타입체크
      await this.checkPostType(post, postPassword);

      // 삭제
      return await this.postsRepository.deletePost(postId);
    } catch (error) {
      throw error;
    }
  }
}
