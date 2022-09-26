import { Exclude, Transform } from 'class-transformer';
import Addon from 'src/addon/entities/addon.entity';
import Company from 'src/company/entities/company.entity';
import Discount from 'src/discount/entities/discount.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public imageUrl: string;

  @Transform(({ value }) => {
    console.log(new Date(value) instanceof Date);
    return new Date(value);
  })
  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => Company, (company: Company) => company.products)
  @Exclude()
  public company: Company;

  @ManyToMany(() => Discount, (discount: Discount) => discount.products)
  @JoinTable()
  public discounts: Discount[];

  @ManyToMany(() => Addon, (addon: Addon) => addon.products)
  @JoinTable()
  public addons: Addon[];
}

export default Product;
