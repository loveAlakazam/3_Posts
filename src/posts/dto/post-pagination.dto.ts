import { IsNumber } from 'class-validator';

export class PostPagination {
  // 페이지 (기본값: 1)
  @IsNumber()
  page = 1;

  // 추가 로드 20개 단위
  @IsNumber()
  pageSize = 20;
}
