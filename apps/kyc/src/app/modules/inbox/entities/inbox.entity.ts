import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { INBOX_STATUS, type InboxStatus } from './inbox.const';

@Entity()
export class Inbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  messageId: string;

  @Column()
  pattern: string;

  @Column({ enum: INBOX_STATUS })
  status: InboxStatus;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
