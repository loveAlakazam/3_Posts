import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class DateColumns {
  @CreateDateColumn()
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
