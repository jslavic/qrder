import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { getDateFromBaseDate } from 'src/helpers/getDateFromBaseDate';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { RepeatedDiscount } from '../enum/repeatedDiscount.enum';

/**
 * Validate that the date is provided in the required base date format which is
 * January 1st, 1978, 00:00:00, in order to make it easier to determine weather
 * certain discounts apply or not
 */
@Injectable()
export class DateValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: CreateDiscountDto, _metadata: ArgumentMetadata) {
    console.log('VALUE FROM THAT I FUCKING NEED', value.from.toUTCString());
    console.log('this?', value.from.getTime() > value.to.getTime());
    if (value.from.getTime() > value.to.getTime())
      throw new BadRequestException(
        'Dates provided are not in the required form',
      );

    switch (value.repeated) {
      case RepeatedDiscount.DAILY:
        value.from = getDateFromBaseDate({
          minutesAhead: value.from.getUTCMinutes(),
          hoursAhead: value.from.getUTCHours(),
        });
        value.to = getDateFromBaseDate({
          minutesAhead: value.to.getUTCMinutes(),
          hoursAhead: value.to.getUTCHours(),
        });
        if (
          value.from.getTime() < getDateFromBaseDate().getTime() ||
          value.to.getTime() > getDateFromBaseDate({ daysAhead: 1 }).getTime()
        )
          throw new BadRequestException(
            'Dates provided are not in the required form',
          );
        break;
      case RepeatedDiscount.SPECIFIC_DAYS:
        value.from = getDateFromBaseDate({
          minutesAhead: value.from.getUTCMinutes(),
          hoursAhead: value.from.getUTCHours(),
        });
        value.to = getDateFromBaseDate({
          minutesAhead: value.to.getUTCMinutes(),
          hoursAhead: value.to.getUTCHours(),
        });
        console.log('is it this?', value.to.toDateString());
        console.log(getDateFromBaseDate({ daysAhead: 1 }).toDateString());
        if (
          value.from.getTime() < getDateFromBaseDate().getTime() ||
          value.to.getTime() > getDateFromBaseDate({ daysAhead: 1 }).getTime()
        )
          throw new BadRequestException(
            'Dates provided are not in the required form',
          );
        if (!value.repeatedDays || value.repeatedDays.length === 0)
          throw new BadRequestException('Repeated days must be provided');
        break;
      case RepeatedDiscount.WEEKLY:
        value.from = getDateFromBaseDate({
          minutesAhead: value.from.getUTCMinutes(),
          hoursAhead: value.from.getUTCHours(),
          daysAhead: value.from.getUTCDay(),
        });
        value.to = getDateFromBaseDate({
          minutesAhead: value.to.getUTCMinutes(),
          hoursAhead: value.to.getUTCHours(),
          daysAhead: value.to.getUTCDay(),
        });
        if (
          value.from.getTime() < getDateFromBaseDate().getTime() ||
          value.to.getTime() >
            getDateFromBaseDate({ daysAhead: 1, weeksAhead: 1 }).getTime()
        )
          throw new BadRequestException(
            'Dates provided are not in the required form',
          );
        break;
      case RepeatedDiscount.MONTHLY:
        value.from = getDateFromBaseDate({
          minutesAhead: value.from.getUTCMinutes(),
          hoursAhead: value.from.getUTCHours(),
          daysAhead: value.from.getUTCDate() - 1,
        });
        value.to = getDateFromBaseDate({
          minutesAhead: value.to.getUTCMinutes(),
          hoursAhead: value.to.getUTCHours(),
          daysAhead: value.to.getUTCDate() - 1,
        });
        console.log('HIT THIS SHIT');
        if (
          value.from.getTime() < getDateFromBaseDate().getTime() ||
          value.to.getTime() > getDateFromBaseDate({ monthsAhead: 1 }).getTime()
        )
          throw new BadRequestException(
            'Dates provided are not in the required form',
          );
    }
    return value;
  }
}
