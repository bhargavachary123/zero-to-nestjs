import { Entity, Column, PrimaryColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryColumn({ generated: "uuid" })
  profile_id: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ type: 'longtext', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  phone_number: string;

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;

  /* previous relationship if any */

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}