import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './Posts';

@Entity({ schema: 'post_service', name: 'weathers' })
export class Weathers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'weatherId' })
  weatherId: number;

  @Column({ name: 'status', comment: '날씨상태' })
  status: string;

  @Column({ name: 'code', comment: '날씨코드' })
  code: number;

  @Column({ type: 'float', name: 'tempCelsius', comment: '섭씨온도' })
  tempCelsius: number;

  @OneToOne(() => Posts)
  @JoinColumn()
  post: Posts;
}
