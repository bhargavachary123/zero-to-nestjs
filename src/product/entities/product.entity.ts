import { Category } from "src/category/entities/category.entity";
import { Order } from "src/order/entities/order.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryColumn({ generated: "uuid" })
  product_id: string;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  description: string

  @Column()
  price: number;

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;

  /* previous relationship if any */

  @ManyToMany(() => Order, order => order.products)
  orders: Order[];

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}