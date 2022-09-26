import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateDiscountDto } from '../dto/create-discount.dto';

/**
 * Verify that the percentage discounts are not larger than 100%
 */
@Injectable()
export class PercentageValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: CreateDiscountDto, _metadata: ArgumentMetadata) {
    if (value.type === 'AMOUNT') return value;
    if (value.amount > 100)
      throw new BadRequestException(
        'Percentage amount cannot be larger than 100',
      );
    return value;
  }
}
