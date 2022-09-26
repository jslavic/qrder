import Company from 'src/company/entities/company.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Table {
  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => Company, (company: Company) => company.tables)
  public company: Company;
}

export default Table;
