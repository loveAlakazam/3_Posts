import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

/**
 * 비밀글의 비밀번호 양식이 일치하지 않은 경우
 */
export class InvalidPostPasswordRegexException extends BadRequestException {
  constructor(msg: string) {
    super(msg);
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
  constructor(msg: string) {
    super(msg);
  }
}

/**
 * 비밀글 비밀번호가 틀려서 게시물 수정/삭제 권한이 없음
 */
export class InvalidPostPasswordException extends ForbiddenException {
  constructor(msg: string) {
    super(msg);
  }
}

/**
 * * 비밀글 비밀번호가 없어서 게시물 생성 에러
 */
export class EmptyPostPasswordException extends BadRequestException {
  constructor() {
    super('비밀번호를 입력해주세요!');
  }
}

/**
 * 게시글 종류가 enum에 해당하지않음
 */
export class PostTypeInvalidException extends BadRequestException {
  constructor(msg: string) {
    super(msg);
  }
}
