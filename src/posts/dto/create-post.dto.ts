import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostType } from '../../entities/enums/PostType';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  content: string;

  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @IsOptional()
  @IsString()
  postPassword?: string;
}
