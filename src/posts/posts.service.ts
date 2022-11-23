import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

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
import {
  EmptyPostPasswordException,
  FailGetWeatherDataException,
  InvalidPostPasswordException,
  InvalidPostPasswordRegexException,
  NotAllowUserException,
  PostTypeInvalidException,
} from './exceptions/post-exceptions';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import * as geoip from 'geoip-lite';

@Injectable()
export class PostsService {
  constructor(
    // axios 를 사용하기 위한 HttpService 를 주입
    private axiosHttpService: HttpService,

    // postRepository 주입
    private readonly postsRepository: PostsRepository,

    // configModule주입
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description : 클라이언트의 IP주소로 현위치정보를 구하기
   * @param IPAddress
   * @returns
   */
  private getLocationData(IPAddress: string) {
    let lat, lng;

    // IPAddress가 로컬호스트라면, 작성자의 집주소로 한다.
    if (IPAddress === '127.0.0.1') {
      lat = this.configService.get<number>('LAT');
      lng = this.configService.get<number>('LNG');

      return { lat, lng };
    }

    const geoInfo = geoip.lookup(IPAddress);
    lat = geoInfo.range[0];
    lng = geoInfo.range[1];

    return { lat, lng };
  }

  /**
   * axios를 이용하여, WeatherAPI 로부터 현재 날씨정보를 갖고온다.
   */
  async getWeatherData(IPAddress: string) {
    // IP 주소에 대응되는 위치를 구한다.
    const { lat, lng } = this.getLocationData(IPAddress);

    // const { lat, lng } = await this.getLocationData();
    const weather = this.axiosHttpService
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.configService.get<string>(
          'OPEN_WEATHER_API',
        )}`,
      )
      .pipe(
        map((res) => res.data?.weather),
        map((weather) => {
          // 현재 날씨 정보를 리턴
          return weather[0]?.main;
        }),
      )
      .pipe(
        catchError(() => {
          // 403 CustomError을 호출한다.
          throw new FailGetWeatherDataException();
        }),
      );

    const result = await lastValueFrom(weather);
    return result;
  }

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
          throw new EmptyPostPasswordException();
        }

        const isValid = await this.isHashValid(
          inputPassword,
          post.postPassword,
        );
        if (!isValid) {
          throw new InvalidPostPasswordException();
        }
        return;
      }
      case PostType.PUBLIC_POST: {
        // 공개글
        return;
      }

      default:
        throw new PostTypeInvalidException();
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
    IPAddress: string,
    createPostDto: CreatePostDto,
  ): Promise<InsertResult> {
    try {
      if (createPostDto.postType === PostType.PRIVATE_POST) {
        const originPassword = createPostDto.postPassword;
        if (!originPassword) {
          throw new EmptyPostPasswordException();
        }

        // 비밀번호 정규표현식
        const isRegex = originPassword.match(PRIVATE_PASSWORD_REGEX);
        if (!isRegex) throw new InvalidPostPasswordRegexException();

        //입력받은 비밀번호를 암호화
        const hashedPostPassword = await this.hash(originPassword);
        createPostDto.postPassword = hashedPostPassword;
      }

      // 클라이언트 IP주소에 해당하는 위치를 구한뒤, 해당위치에서의 날씨정보를 구한다.
      const weatherInfo = await this.getWeatherData(IPAddress);

      // Post 추가
      return await this.postsRepository.createPost(
        user,
        createPostDto,
        weatherInfo,
      );
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
        weather: post.weather,
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
        throw new NotAllowUserException();
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
        throw new NotAllowUserException();
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
