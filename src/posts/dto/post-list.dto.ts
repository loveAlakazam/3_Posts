import { PostInfoWithoutPasswordDto } from './post-info-without-password.dto';

export class PostListDto {
  list: PostInfoWithoutPasswordDto[];
  page = 1;
  pageSize = 20;
}
