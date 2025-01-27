import { Entity, Column, PrimaryColumn, OneToOne, DeleteDateColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Order } from 'src/order/entities/order.entity';

export enum RoleEnum { ADMIN="ADMIN", SELLER="SELLER", CONSUMER="CONSUMER" }
@Entity()
export class User {
  @PrimaryColumn({ generated: "uuid" })
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  /*
    * Select indicates row selection in QueryBuilder
    * Default value is "true".
  */
  @Column({ select: false })
  password: string;

  @Column({
    type:'enum',
    enum: RoleEnum,
    default: RoleEnum.CONSUMER
  })
  role: RoleEnum;

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;

  /* previous relationship if any */

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}