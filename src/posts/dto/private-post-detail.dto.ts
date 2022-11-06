import { IsOptional, IsString, Matches } from 'class-validator';
import { PRIVATE_PASSWORD_REGEX } from 'src/common/regex/regex';

export class PrivatePostDetailDto {
  @IsOptional()
  @IsString()
  postPassword?: string;
}
