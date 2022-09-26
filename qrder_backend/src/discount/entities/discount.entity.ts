import Company from 'src/company/entities/company.entity';
import Product from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RepeatedDays } from '../enum/repeatedDays.enum';
import { RepeatedDiscount } from '../enum/repeatedDiscount.enum';

@Entity()
class Discount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public repeated: RepeatedDiscount;

  @Column('smallint', { nullable: true, array: true })
  public repeatedDays: RepeatedDays[];

  @Column({ type: 'timestamp' })
  public from: Date;

  @Column({ type: 'timestamp' })
  public to: Date;

  @Column()
  public type: 'PERCENTAGE' | 'AMOUNT';

  @Column()
  public amount: number;

  @ManyToOne(() => Company, (company: Company) => company.discounts)
  public company: Company;

  @ManyToMany(() => Product, (product: Product) => product.discounts)
  public products: Product[];
}

export default Discount;
