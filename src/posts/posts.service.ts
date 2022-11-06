import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Posts } from '../entities/Posts';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as bcrypt from 'bcrypt';
import { PostType } from '../entities/enums/PostType';
import { Users } from '../entities/Users';
import {
  EmptyPostPasswordException,
  InvalidPostPasswordRegexException,
} from './exceptions/post-exceptions';
import { errorMsg } from './exceptions/error-messages';
import { PRIVATE_PASSWORD_REGEX } from 'src/common/regex/regex';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

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
  private async checkPostType(postType) {
    switch (postType) {
      case PostType.PUBLIC_POST: // 공개글
        return;
      case PostType.PRIVATE_POST: {
        // 비공개글
        // 비밀번호 검사
      }
      default:
      // 에러발생
    }
  }

  async createPost(
    user: Users,
    createPostDto: CreatePostDto,
  ): Promise<InsertResult> {
    try {
      if (createPostDto.postType === PostType.PRIVATE_POST) {
        const originPassword = createPostDto.postPassword;
        if (!originPassword) {
          throw new EmptyPostPasswordException(
            errorMsg.PRIVATE_POST_EMPTY_PASSWORD,
          );
        }

        // 비밀번호 정규표현식
        const isRegex = originPassword.match(PRIVATE_PASSWORD_REGEX);
        if (!isRegex)
          throw new InvalidPostPasswordRegexException(
            errorMsg.INVALID_POST_PASSWORD,
          );

        //입력받은 비밀번호를 암호화
        const hashedPostPassword = await this.hash(originPassword);
        createPostDto.postPassword = hashedPostPassword;
      }

      // Post 추가
      const result = await this.postsRepository
        .createQueryBuilder('posts')
        .insert()
        .into(Posts)
        .values({ ...createPostDto, userId: user.userId })
        .execute();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAllPosts() {
    // 모든글
    return `This action returns all posts`;
  }

  async findOnePost(id: number) {
    // 공개글이라면 그냥 보여줌
    // 비공개글이라면 비번이 일치해야함.
    return `This action returns a #${id} post`;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async removePost(id: number) {
    return `This action removes a #${id} post`;
  }
}
