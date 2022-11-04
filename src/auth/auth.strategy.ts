import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  /**
   * 유저 로그인 요청을 처리하기 위한 인증처리
   * @param email : 이메일
   * @param password: 비밀번호
   * @returns 비밀번호를 제외한 유저정보
   */
  async validate(email: string, pass: string): Promise<any> {
    const findUser = await this.usersRepository.findOne({
      where: { email },
    });

    // 이메일에 해당하는 유저 정보가 없을 때 예외 발생
    if (!findUser) {
      throw new NotFoundException('해당 사용자 정보를 찾을 수 없습니다.');
    }

    // DB에 저장되어 있는 유저정보의 비밀번호와 유저가 입력한 비밀번호가 일치하는지 비교
    const validate = await bcrypt.compare(pass, findUser.password);

    if (!validate) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    //비밀번호를 제외한 유저정보 반환
    const { password, ...result } = findUser;
    return result;
  }
}
