import { IsNumber } from 'class-validator';

export class PaginationOption {
  // 페이지 (기본값: 1)
  page: number;

  // 추가 로드 20개 단위
  pageSize: number;
}
