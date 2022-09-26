import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './entities/product.entity';
import { DiscountModule } from 'src/discount/discount.module';
import { PassportModule } from '@nestjs/passport';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { CompanyModule } from 'src/company/company.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    CompanyModule,
    DiscountModule,
    EncryptionModule,
    FileModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
