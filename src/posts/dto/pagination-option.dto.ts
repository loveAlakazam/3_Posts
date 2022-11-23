import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationOption {
  // 페이지 (기본값: 1)
  @IsOptional() // 선택값으로 한다.
  @Type(() => Number) //값 존재시 문자열을 Number 로 변환
  @IsNumber()
  page?: number = 1;

  // 추가 로드 20개 단위
  @IsOptional() // 선택값으로 한다.
  @Type(() => Number) // 값 존재시 문자열을 Number로 변환
  @IsNumber()
  pageSize?: number = 20;
}
