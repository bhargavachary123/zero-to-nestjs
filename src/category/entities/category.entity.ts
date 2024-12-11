import { Product } from 'src/product/entities/product.entity';
import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn({ generated: "uuid" })
  category_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;

  /* previous relationship if any */

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}