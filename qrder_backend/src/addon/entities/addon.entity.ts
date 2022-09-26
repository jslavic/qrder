import Company from 'src/company/entities/company.entity';
import Product from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Addon {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ default: 0 })
  public price: number;

  @ManyToOne(() => Company, (company: Company) => company.addons)
  public company: Company;

  @ManyToMany(() => Product, (product: Product) => product.addons)
  public products: Product[];
}

export default Addon;
