import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Company from 'src/company/entities/company.entity';
import { checkIfDateIsInInterval } from 'src/helpers/checkIfDateIsInInterval';
import { getDateFromBaseDate } from 'src/helpers/getDateFromBaseDate';
import { getDateFromTimezoneOffset } from 'src/helpers/getDateFromTimezoneOffset';
import Product from 'src/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import Discount from './entities/discount.entity';
import { RepeatedDiscount } from './enum/repeatedDiscount.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async getDiscountById(id: number) {
    return await this.discountRepository.findOneByOrFail({ id });
  }

  async getAllCompanyDiscounts(companyId: number) {
    return await this.discountRepository.find({
      where: { company: { id: companyId } },
      relations: ['products'],
    });
  }

  async getDiscountByIdAndCompanyId(discountId: number, companyId: number) {
    return await this.discountRepository.findOneOrFail({
      where: {
        id: discountId,
        company: { id: companyId },
      },
      relations: ['products'],
    });
  }

  async getDiscountsFromIdArray(
    discountIds: number[],
    companyId: number,
    includeProducts = true,
  ) {
    return await this.discountRepository.find({
      where: { id: In(discountIds), company: { id: companyId } },
      ...(includeProducts && { relations: ['products'] }),
    });
  }

  async createDiscount(
    createDiscountDto: CreateDiscountDto,
    company: Company,
    products?: Product[],
  ) {
    const newDiscount = this.discountRepository.create({
      ...createDiscountDto,
      company,
      products,
    });
    return await this.discountRepository.save(newDiscount);
  }

  async updateDiscount(
    updateDiscountDto: UpdateDiscountDto,
    discount: Discount,
    tzOffset: number,
    products?: Product[],
  ) {
    console.log(
      'update discount ',
      updateDiscountDto.from,
      updateDiscountDto.to,
    );
    const updatedDiscount = {
      ...discount,
      ...updateDiscountDto,
      products,
      ...(updateDiscountDto.from &&
        getDateFromTimezoneOffset(tzOffset, updateDiscountDto.from.getTime())),
      ...(updateDiscountDto.to &&
        getDateFromTimezoneOffset(tzOffset, updateDiscountDto.from.getTime())),
    };
    console.log(
      updatedDiscount.from.getTime(),
      updateDiscountDto.from.getTime(),
    );
    return await this.discountRepository.save(updatedDiscount);
  }

  async deleteDiscount(discount: Discount) {
    return await this.discountRepository.remove(discount);
  }

  applyDiscountToProduct(discount: Discount, product: Product) {
    switch (discount.type) {
      case 'AMOUNT':
        return Math.max(product.price - discount.amount, 0);
      case 'PERCENTAGE':
        return product.price - product.price * (discount.amount / 100);
    }
  }

  async applyDiscounts(discounts: Discount[], companyTimezoneOffset: number) {
    for (const discount of discounts) {
      if (this.checkIfDiscountApplies(discount, companyTimezoneOffset))
        return discount;
    }
    return null;
  }

  private checkIfDiscountApplies(
    discount: Discount,
    companyTimezoneOffset: number,
  ) {
    switch (discount.repeated) {
      case RepeatedDiscount.NOT_REPEATED:
        return this.CheckIfSpecificTimedDiscountApplies(
          discount,
          companyTimezoneOffset,
        );
      case RepeatedDiscount.DAILY:
        return this.checkIfDailyDiscountApplies(
          discount,
          companyTimezoneOffset,
        );
      case RepeatedDiscount.SPECIFIC_DAYS:
        return this.checkIfDiscountOnCertainDaysApplies(
          discount,
          companyTimezoneOffset,
        );
      case RepeatedDiscount.WEEKLY:
        return this.checkIfWeeklyDiscountApplies(
          discount,
          companyTimezoneOffset,
        );
      case RepeatedDiscount.MONTHLY:
        return this.checkIfMonthlyDiscountApplies(
          discount,
          companyTimezoneOffset,
        );
    }
  }

  private CheckIfSpecificTimedDiscountApplies(
    discount: Discount,
    companyTimezoneOffset: number,
  ) {
    const currentTime = getDateFromTimezoneOffset(companyTimezoneOffset);
    return checkIfDateIsInInterval(
      discount.from,
      discount.to,
      currentTime.getTime(),
    );
  }

  private checkIfDailyDiscountApplies(
    discount: Discount,
    companyTimezoneOffset: number,
  ) {
    const currentTime = getDateFromTimezoneOffset(companyTimezoneOffset);
    const currentTimeInBaseTime = getDateFromBaseDate({
      hoursAhead: currentTime.getUTCHours(),
      minutesAhead: currentTime.getUTCMinutes(),
    });
    console.log(currentTimeInBaseTime.toUTCString());
    if (
      checkIfDateIsInInterval(
        discount.from,
        discount.to,
        currentTimeInBaseTime.getTime(),
      )
    )
      return true;
    return false;
  }

  private checkIfDiscountOnCertainDaysApplies(
    discount: Discount,
    companyTimezoneOffset: number,
  ) {
    const currentTime = getDateFromTimezoneOffset(companyTimezoneOffset);
    const currentTimeInBaseTime = getDateFromBaseDate({
      hoursAhead: currentTime.getUTCHours(),
      minutesAhead: currentTime.getUTCMinutes(),
    });
    if (
      discount.repeatedDays.includes(currentTime.getUTCDay()) &&
      checkIfDateIsInInterval(
        discount.from,
        discount.to,
        currentTimeInBaseTime.getTime(),
      )
    )
      return true;
    return false;
  }

  private checkIfWeeklyDiscountApplies(
    discount: Discount,
    companyTimezoneOffset: number,
  ) {
    const currentTime = getDateFromTimezoneOffset(companyTimezoneOffset);
    const currentTimeInBaseTime = getDateFromBaseDate({
      hoursAhead: currentTime.getUTCHours(),
      minutesAhead: currentTime.getUTCMinutes(),
      daysAhead: currentTime.getUTCDay(),
    });
    if (
      checkIfDateIsInInterval(
        discount.from,
        discount.to,
        currentTimeInBaseTime.getTime(),
      )
    )
      return true;
    return false;
  }

  private checkIfMonthlyDiscountApplies(
    discount: Discount,
    companyTimezoneOffset: number,
  ) {
    const currentTime = getDateFromTimezoneOffset(companyTimezoneOffset);
    const currentTimeInBaseTime = getDateFromBaseDate({
      hoursAhead: currentTime.getUTCHours(),
      minutesAhead: currentTime.getUTCMinutes(),
      daysAhead: currentTime.getUTCDate(),
    });
    if (
      checkIfDateIsInInterval(
        discount.from,
        discount.to,
        currentTimeInBaseTime.getTime(),
      )
    )
      return true;
    console.log('not in interval');
    return false;
  }
}
