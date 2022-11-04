import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {
    super();
  }

  /**
   * 로그인 요청 성공시 사용자의 정보를 세션에 저장
   * @param user: 로그인 요청에 성공한 유저정보
   * @param done
   */
  serializeUser(user: Users, done: (err, user: Users) => void): void {
    // 유저정보를 세션에 저장
    done(null, user);
  }

  /**
   * 세션에 저장된 유저정보를 반환
   * @param user 세션에 저장된 유저정보
   * @param done
   */
  async deserializeUser(
    user: Users,
    done: (err, user: Users) => void,
  ): Promise<void> {
    // 세션에 저장되어 있는 유저정보가 올바른 정보인지 확인
    const userInfo = await this.userRepository.findOneBy({
      userId: user.userId,
    });

    // 세션에 유저정보가 있다면 request.user 에 유저정보를 추가
    if (userInfo) {
      return done(null, userInfo);
    }

    return done(null, null);
  }
}
