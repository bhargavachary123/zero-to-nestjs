import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryColumn({ generated: "uuid" }) //it is used to generate primary id, when new data inserted.
    id:string;

    @Column() // It is used to mark a specific class property as a table column
    name: string;
  
    @Column()
    description: string;
  
    @Column({ type: 'decimal' })
    price: number;

    @CreateDateColumn()
    createdon:Date;
    
    @UpdateDateColumn()
    updatedon:Date;

    @DeleteDateColumn()
    deletedon:Date;
}