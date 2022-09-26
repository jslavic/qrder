import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import Table from './entities/table.entity';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [
    EncryptionModule,
    TypeOrmModule.forFeature([Table]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
  ],
  providers: [TableService],
  controllers: [TableController],
  exports: [TableService],
})
export class TableModule {}
