import { Optional } from '@nestjs/common';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @Optional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @Optional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  content: string;

  @IsOptional()
  postPassword?: string;
}
