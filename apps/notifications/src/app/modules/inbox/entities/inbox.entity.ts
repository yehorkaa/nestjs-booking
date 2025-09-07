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

  @Column({ type: 'enum', enum: INBOX_STATUS, nullable: true })
  status: InboxStatus;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
