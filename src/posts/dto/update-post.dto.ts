import { Optional } from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @Optional()
  @IsString()
  @MaxLength(20)
  title: string;

  @Optional()
  @IsString()
  @MaxLength(200)
  content: string;

  @IsOptional()
  postPassword?: string;
}
