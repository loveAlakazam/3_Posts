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

  /**
   * 게시글 제목 (최대 20자)
   */
  @Column({ name: 'tittle', length: 20, comment: '게시글 제목' })
  title: string;

  /**
   * 게시글 본문 (최대 200자)
   */
  @Column({ name: 'content', length: 200, comment: '게시글 본문' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    name: 'postType',
    default: PostType.PUBLIC_POST,
    comment: '게시글 종류',
  })
  postType: string;

  /**
   * 공개글 postPassword: null
   * 비밀글 postPassword: Not null (암호화 된 값)
   */
  @Column({
    type: 'text',
    name: 'postPassword',
    comment: '게시글 비밀번호(비밀글 한정)',
    nullable: true,
    default: () => null,
  })
  postPassword: string;

  /**
   * 게시글 등록일, 수정일, 삭제일
   */
  @Column(() => DateColumns, { prefix: false })
  dateColumns: DateColumns;
}
