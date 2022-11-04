import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DateColumns } from './embededs/date-columns';
import { Posts } from './Posts';

@Entity({ schema: 'post_service', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', name: 'email', length: 50 })
  email: string;

  @Column({ type: 'text', name: 'password' })
  password: string;

  @Column({ type: 'varchar', name: 'name', length: 30 })
  name: string;

  @Column({ type: 'varchar', name: 'phone', length: 25 })
  phone: string;

  @OneToMany(() => Posts, (posts) => posts.postId)
  Posts: Posts[];

  /**
   * 회원 가입일, 수정일, 삭제일
   */
  @Column(() => DateColumns, { prefix: false })
  dateColumns: DateColumns;
}
