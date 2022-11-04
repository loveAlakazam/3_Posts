import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateColumns } from './embededs/date-columns';
import { PostType } from './enums/PostType';

/**
 * 한 페이지 내에서 모든 게시글을 최신글 순서로
 */
@Entity({
  schema: 'post_service',
  name: 'posts',
  orderBy: { createdAt: 'DESC' },
})
export class Posts {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'postId',
    comment: '게시글 아이디',
  })
  postId: number;

  @Column({ name: 'tittle', comment: '게시글 제목' })
  title: string;

  @Column({ name: 'content', comment: '게시글 내용' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    name: 'postType',
    default: PostType.PUBLIC_POST,
    comment: '게시글 종류',
  })
  postType: string;

  @Column({
    type: 'text',
    name: 'postPassword',
    comment: '게시글 비밀번호(비밀글 한정)',
  })
  postPassword: string;

  /**
   * 게시글 등록일, 수정일, 삭제일
   */
  @Column(() => DateColumns, { prefix: false })
  dateColumns: DateColumns;
}
