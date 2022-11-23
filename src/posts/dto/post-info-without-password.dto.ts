export class PostInfoWithoutPasswordDto {
  postId: number;
  title: string;
  postType: string;
  userId: number;
  name: string;
  content?: string;
  weather?: string;
}
