import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { errorMsg } from './error-messages';

/**
 * 비밀글의 비밀번호 양식이 일치하지 않은 경우
 */
export class InvalidPostPasswordException extends BadRequestException {
  constructor() {
    super({ message: errorMsg.INVALID_PASSWORD, code: 400 });
  }
}

/**
 * 게시글 글자수가 적절하지 않을 때 예외발생
 */
export class PostFormatInvalidException extends BadRequestException {
  constructor(msg: string) {
    super(msg);
  }
}

/**
 * 게시글을 찾을 수 없을 때 발생
 */
export class NotFoundPostException extends NotFoundException {
  constructor() {
    super({ message: errorMsg.NOT_FOUND_POST, code: 404 });
  }
}

/**
 * 비밀글 비밀번호 정규표현식이 틀린 예외
 */
export class InvalidPostPasswordRegexException extends ForbiddenException {
  constructor() {
    super({ message: errorMsg.INVALID_POST_PASSWORD_REGEX, code: 403 });
  }
}

/**
 * * 비밀글 비밀번호가 없어서 게시물 생성 에러
 */
export class EmptyPostPasswordException extends BadRequestException {
  constructor() {
    super({ message: errorMsg.EMPTY_PASSWORD, code: 400 });
  }
}

/**
 * 게시글 종류가 enum에 해당하지않음
 */
export class PostTypeInvalidException extends BadRequestException {
  constructor() {
    super({ message: errorMsg.POST_TYPE_INVALID, code: 400 });
  }
}

export class NotAllowUserException extends UnauthorizedException {
  constructor() {
    super({ message: errorMsg.NOT_ALLOW_USER, code: 401 });
  }
}

export class FailGetWeatherDataException extends NotFoundException {
  constructor() {
    super({ message: errorMsg.FAIL_GET_WEATHER_DATA, code: 403 });
  }
}
