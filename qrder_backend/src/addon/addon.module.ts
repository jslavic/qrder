import { Module } from '@nestjs/common';
import { AddonService } from './addon.service';
import { AddonController } from './addon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import Addon from './entities/addon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Addon]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
  ],
  controllers: [AddonController],
  providers: [AddonService],
  exports: [AddonService],
})
export class AddonModule {}
