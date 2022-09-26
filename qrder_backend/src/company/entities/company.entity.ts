import { Exclude } from 'class-transformer';
import { SubscriptionPlans } from 'src/common/enum/subscriptionPlans.enum';
import Product from 'src/product/entities/product.entity';
import Discount from 'src/discount/entities/discount.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Addon from 'src/addon/entities/addon.entity';
import Table from 'src/table/entities/table.entity';
import { AvailableCountries } from 'src/common/enum/availableCountries.enum';
import { StripeVerificationStatus } from 'src/common/enum/stripeVerificationStatus.enum';

@Entity()
class Company {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ unique: true })
  @Index()
  @Exclude()
  public customerId: string;

  @Column({ unique: true, nullable: true }) // TODO: remove for produciton
  @Index()
  @Exclude()
  public accountId: string;

  @Column({
    enum: StripeVerificationStatus,
    default: StripeVerificationStatus.UNVERIFIED,
  })
  public verificationStatus: StripeVerificationStatus;

  @Column({ default: false })
  public submittedFirstVerification: boolean;

  @Column({ default: false })
  public addedBankAccount: boolean;

  @Column({ default: false })
  public enabledCardPayments: boolean;

  @Column({ default: 'eur' })
  public currency: string;

  @Column({ type: 'smallint' })
  @Exclude()
  public timezoneOffset: number;

  @Column({ enum: AvailableCountries })
  @Exclude()
  public countryCode: AvailableCountries;

  @Column({ nullable: true })
  public subscriptionPlan: SubscriptionPlans;

  @Column({ default: false })
  @Exclude()
  public isSubscriptionActive: boolean;

  @Column({ type: 'timestamp', default: new Date() })
  @Exclude()
  public subscriptionEnds: Date;

  @Column({ nullable: true, select: false })
  @Exclude()
  public passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  @Exclude()
  public passwordResetExpiration: Date;

  @OneToMany(() => Product, (product: Product) => product.company)
  public products: Product[];

  @OneToMany(() => Table, (table: Table) => table.company)
  @Exclude()
  public tables: Table[];

  @OneToMany(() => Discount, (discount: Discount) => discount.company)
  public discounts: Discount[];

  @OneToMany(() => Addon, (addon: Addon) => addon.company)
  public addons: Addon[];
}

export default Company;
