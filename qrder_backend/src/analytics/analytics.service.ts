import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Company from 'src/company/entities/company.entity';
import { DiscountService } from 'src/discount/discount.service';
import { getDateFromTimezoneOffset } from 'src/helpers/getDateFromTimezoneOffset';
import { Order, OrderDocument } from 'src/order/entity/order.entity';
import { OrderStatus } from 'src/order/enum/orderStatus.enum';
import { OrderType } from 'src/order/enum/orderType.enum';
import { PaymentService } from 'src/payment/payment.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getAllAnalyticsInfo(company: Company, after: Date, before: Date) {
    const chartData = await this.getAllSales(
      company.id,
      company.timezoneOffset,
      after,
      before,
    );
    const balance = await this.paymentService.getAccountBalance(
      company.accountId,
    );
    const { productStatistics, totalItems } =
      await this.getAllProductStatistics(
        company.id,
        company.timezoneOffset,
        after,
        before,
      );
    return { chartData, balance, productStatistics, totalItems };
  }

  private async getAllSales(
    companyId: number,
    tzOffset: number,
    after: Date,
    before: Date,
  ) {
    return await this.orderModel.aggregate([
      {
        $match: {
          companyId,
          orderType: { $ne: OrderType.AWAITING_PAYMENT },
          orderStatus: { $ne: OrderStatus.AWAITING_CONFIRMATION },
          createdAt: {
            $gt: getDateFromTimezoneOffset(
              tzOffset,
              after.setDate(after.getDate()),
            ),
            $lt: getDateFromTimezoneOffset(
              tzOffset,
              before.setDate(before.getDate() + 1),
            ),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: { date: '$createdAt', timezone: '+0200' } },
          sales: { $sum: '$profit' },
          createdAt: { $min: '$createdAt' },
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%d/%m/%Y',
              date: '$createdAt',
              timezone: '+0200',
            },
          },
          sales: '$sales',
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getAllProductStatistics(
    companyId: number,
    tzOffset: number,
    after: Date,
    before: Date,
  ) {
    console.log('started: getProductStatistics');
    const productStatistics: {
      _id: number;
      name: string;
      imageUrl: string;
      earnings: number;
      itemsSold: number;
    }[] = [];

    const orderStatistics = await this.orderModel.aggregate([
      {
        $match: {
          companyId,
          orderType: { $ne: OrderType.AWAITING_PAYMENT },
          orderStatus: { $ne: OrderStatus.AWAITING_CONFIRMATION },
          createdAt: {
            $gt: getDateFromTimezoneOffset(
              tzOffset,
              after.setDate(after.getDate()),
            ),
            $lt: getDateFromTimezoneOffset(
              tzOffset,
              before.setDate(before.getDate()),
            ),
          },
        },
      },
      {
        $unwind: '$orderedItems',
      },
      {
        $group: {
          _id: '$orderedItems.itemId',
          earnings: {
            $sum: {
              $multiply: ['$orderedItems.price', '$orderedItems.quantity'],
            },
          },
          itemsSold: {
            $sum: '$orderedItems.quantity',
          },
        },
      },
      { $sort: { earnings: -1 } },
    ]);

    const productIds = orderStatistics.map((item) => item._id);
    const existingProducts = await this.productService.getProductsFromArray(
      productIds,
      companyId,
    );

    let totalItems = 0;

    for (const item of orderStatistics) {
      totalItems += item.itemsSold;
      const product = existingProducts.find(
        (product) => product.id === item._id,
      );
      if (!product) continue;
      productStatistics.push({
        ...item,
        name: product.name,
        imageUrl: product.imageUrl,
      });
    }

    return { productStatistics, totalItems };
  }

  async getProductAnalyticsInfo(
    company: Company,
    productId: number,
    after: Date,
    before: Date,
  ) {
    // Confirm that the product belongs to the company first
    const product = await this.productService.getProductByIdAndCompanyId(
      productId,
      company.id,
      false,
    );

    if (!product) throw new UnauthorizedException('Product unavailable');

    console.log(product);

    const [statistics] = await this.getProductSales(
      company.id,
      productId,
      company.timezoneOffset,
      before,
      after,
    );

    const products = [];
    const productIds = statistics.otherItemSales.map(
      (item: { _id: number }) => item._id,
    );
    const existingProducts = await this.productService.getProductsFromArray(
      productIds,
      company.id,
    );

    for (const item of statistics.otherItemSales) {
      const product = existingProducts.find(
        (product) => product.id === item._id,
      );
      if (!product) continue;
      products.push({
        ...item,
        name: product.name,
        imageUrl: product.imageUrl,
      });
    }
    statistics.otherItemSales = products;

    const discounts = [];
    let noDiscountData = null;
    const discountIds = statistics.discountData.map(
      (item: { _id: number }) => item._id,
    );
    const existingDiscounts =
      await this.discountService.getDiscountsFromIdArray(
        discountIds,
        company.id,
        false,
      );

    for (const item of statistics.discountData) {
      const discount = existingDiscounts.find((discount) => {
        if (item._id === null) noDiscountData = item;
        return discount.id === item._id;
      });
      if (!discount) continue;
      discounts.push({
        ...item,
        name: discount.name,
        amount: discount.amount,
        type: discount.type,
        from: discount.from,
        to: discount.to,
        repeated: discount.repeated,
        repeatedDay: discount.repeatedDays,
      });
    }
    statistics.discountData = { discounts, noDiscountData };

    return { product, ...statistics };
  }

  async getProductSales(
    companyId: number,
    productId: number,
    tzOffset: number,
    before: Date,
    after: Date,
  ) {
    return await this.orderModel.aggregate([
      {
        $match: {
          companyId,
          orderType: { $ne: OrderType.AWAITING_PAYMENT },
          orderStatus: { $ne: OrderStatus.AWAITING_CONFIRMATION },
          'orderedItems.itemId': productId,
          createdAt: {
            $gt: getDateFromTimezoneOffset(
              tzOffset,
              after.setDate(after.getDate()),
            ),
            $lt: getDateFromTimezoneOffset(
              tzOffset,
              before.setDate(before.getDate() + 1),
            ),
          },
        },
      },
      {
        $addFields: {
          productId: productId,
        },
      },
      {
        $addFields: {
          mainItems: {
            $arrayElemAt: [
              '$orderedItems',
              {
                $indexOfArray: ['$orderedItems.itemId', '$productId'],
              },
            ],
          },
          otherItems: {
            $filter: {
              input: '$orderedItems',
              as: 'item',
              cond: {
                $ne: ['$$item.itemId', '$productId'],
              },
            },
          },
        },
      },
      {
        $facet: {
          hourlySalesData: [
            {
              $group: {
                _id: { $hour: { date: '$createdAt', timezone: '+0200' } },
                sales: {
                  $sum: {
                    $multiply: ['$mainItems.price', '$mainItems.quantity'],
                  },
                },
                items: {
                  $sum: '$mainItems.quantity',
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
          dailySalesData: [
            {
              $group: {
                _id: { $dayOfYear: { date: '$createdAt', timezone: '+0200' } },
                sales: {
                  $sum: {
                    $multiply: ['$mainItems.price', '$mainItems.quantity'],
                  },
                },
                items: {
                  $sum: '$mainItems.quantity',
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
          discountData: [
            {
              $group: {
                _id: '$mainItems.discount.discountId',
                potentialEarnings: {
                  $sum: {
                    $multiply: [
                      '$mainItems.discount.originalPrice',
                      '$mainItems.quantity',
                    ],
                  },
                },
                discountedEarnings: {
                  $sum: {
                    $multiply: ['$mainItems.price', '$mainItems.quantity'],
                  },
                },
                items: {
                  $sum: '$mainItems.quantity',
                },
                hoursSum: {
                  $addToSet: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    $hour: { date: '$createdAt', timezone: '+0200' },
                  },
                },
              },
            },
            { $set: { hoursSum: { $size: '$hoursSum' } } },
            { $sort: { items: -1 } },
          ],
          otherItemSales: [
            { $unwind: '$otherItems' },
            {
              $group: {
                _id: '$otherItems.itemId',
                timesCombined: { $sum: 1 },
              },
            },
            { $sort: { timesCombined: -1 } },
          ],
        },
      },
    ]);
  }
}
