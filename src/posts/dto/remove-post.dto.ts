import { IsOptional } from 'class-validator';

export class RemovePostDto {
  @IsOptional()
  postPassword?: string;
}
