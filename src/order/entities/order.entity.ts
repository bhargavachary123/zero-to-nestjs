import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn({ generated: "uuid" })
  order_id: string;

  @Column()
  total: number;

  @Column()
  ordered_on: Date

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;

  /* previous relationship if any */
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Product, product => product.orders)
  @JoinTable({ name: "order_products" })
  products: Product[];
}