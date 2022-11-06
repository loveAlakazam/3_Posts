import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PostType } from '../../entities/enums/PostType';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  content: string;

  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @IsOptional()
  @IsString()
  postPassword?: string;
}
