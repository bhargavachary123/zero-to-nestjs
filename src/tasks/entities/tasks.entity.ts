import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type JobType = 'cron' | 'interval' | 'timeout';
@Entity('tasks')
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type: JobType;

  @Column()
  schedule: string; // cron expression or milliseconds as string

  @Column()
  callbackType: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}