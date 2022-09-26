import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddonService } from 'src/addon/addon.service';
import { QrData } from 'src/common/interface/qr-data.interface';
import { CompanyService } from 'src/company/company.service';
import { DiscountService } from 'src/discount/discount.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { getDateFromTimezoneOffset } from 'src/helpers/getDateFromTimezoneOffset';
import { PaymentService } from 'src/payment/payment.service';
import { ProductService } from 'src/product/product.service';
import { SocketService } from 'src/socket/socket.service';
import { TableService } from 'src/table/table.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreateOrderDto, ExtrasIds, ItemIds } from './dto/create-order.dto';
import { Order, OrderDocument } from './entity/order.entity';
import { OrderStatus } from './enum/orderStatus.enum';
import { OrderType } from './enum/orderType.enum';

type OrderItemType = {
  quantity: number;
  itemId: number;
  name: string;
  price: number;
  imageUrl: string;
  discount?: {
    name: string;
    amount: string;
    originalPrice: number;
  };
  extras?: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

@Injectable()
export class OrderService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly discountService: DiscountService,
    private readonly tableService: TableService,
    private readonly productService: ProductService,
    private readonly addonService: AddonService,
    private readonly paymentService: PaymentService,
    private readonly socketService: SocketService,
    private readonly encryptionService: EncryptionService<QrData>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getOrders(companyId: number) {
    return {
      liveOrders: await this.getUnconfirmedOrders(companyId),
      previousOrders: await this.getConfirmedOrders(companyId),
    };
  }

  async getUnconfirmedOrders(companyId: number, skip = 0, take = 8) {
    const unconfirmedOrders = await this.orderModel
      .find({
        companyId,
        orderType: { $ne: OrderType.AWAITING_PAYMENT },
        orderStatus: OrderStatus.AWAITING_CONFIRMATION,
      })
      .skip(skip)
      .limit(take + 1)
      .sort({ createdAt: 'desc' });
    return {
      orders: unconfirmedOrders.slice(0, take),
      hasMore: unconfirmedOrders.length === take + 1,
    };
  }

  async getConfirmedOrders(
    companyId: number,
    skip = 0,
    take = 8,
    tzOffset?: number,
    after?: Date,
    before?: Date,
  ) {
    const confirmedOrders = await this.orderModel
      .find({
        companyId,
        orderType: { $ne: OrderType.AWAITING_PAYMENT },
        orderStatus: { $ne: OrderStatus.AWAITING_CONFIRMATION },
        ...(before && {
          createdAt: {
            $lt: getDateFromTimezoneOffset(
              tzOffset,
              before.setDate(before.getDate() + 1),
            ),
            $gt: getDateFromTimezoneOffset(
              tzOffset,
              after
                ? after.setDate(after.getDate())
                : before.setDate(before.getDate()),
            ),
          },
        }),
      })
      .skip(skip)
      .limit(take + 1)
      .sort({ createdAt: 'desc' });
    console.log('length: ', confirmedOrders.length);
    console.log(confirmedOrders.forEach((item) => console.log(item.createdAt)));
    return {
      orders: confirmedOrders.slice(0, take),
      hasMore: confirmedOrders.length === take + 1,
    };
  }

  async acceptOrder(companyId: number, orderId: string) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, companyId },
      { orderStatus: OrderStatus.CONFIRMED },
    );
    order.save();
    return { message: 'Success' };
  }

  async rejectOrder(companyId: number, orderId: string) {
    await this.orderModel.findOneAndDelete(
      { _id: orderId, companyId },
      { orderStatus: OrderStatus.CONFIRMED },
    );
    return { message: 'Success' };
  }

  async getOrderHistory(companyId: number) {
    return await this.orderModel
      .find({
        companyId,
        orderType: { $ne: OrderType.AWAITING_PAYMENT },
      })
      .sort({ createdAt: 'desc' });
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    encryptedQrData: string,
    orderType: OrderType,
    includeFees = false,
  ) {
    const { productIds } = createOrderDto;
    const { companyId, tableId } = await this.encryptionService.decryptJson(
      encryptedQrData,
    );
    const table = await this.tableService.getTableByIdAndCompanyId(
      tableId,
      companyId,
    );
    let totalPrice = 0;
    const productItems = await Promise.all(
      productIds.map(async (productId) => {
        const orderItem: OrderItemType = await this.getOrderItem(
          productId,
          companyId,
        );
        totalPrice += orderItem.price * orderItem.quantity;
        if (productId.extrasIds) {
          orderItem.extras = await Promise.all(
            productId.extrasIds.map(async (extraId) => {
              const extra = await this.getOrderExtra(extraId);
              totalPrice += extra.price * extra.quantity;
              return extra;
            }),
          );
        }
        return orderItem;
      }),
    );
    const fees = includeFees
      ? +((totalPrice + (createOrderDto.tip || 0)) * 0.02 + 2).toFixed(2)
      : 0;
    const order = new this.orderModel({
      orderType,
      companyId,
      location: table.name,
      extraNotes: createOrderDto.extraNotes || null,
      totalPrice,
      tip: createOrderDto.tip,
      fees,
      profit: includeFees
        ? +(totalPrice + (createOrderDto.tip || 0) - fees).toFixed(2)
        : totalPrice,
      orderedItems: productItems,
    });
    return await order.save();
  }

  private async getOrderItem(productId: ItemIds, companyId: number) {
    const product = await this.productService.getProductByIdAndCompanyId(
      productId.id,
      companyId,
    );
    const company = await this.companyService.findById(companyId);
    const orderItem = await this.productService.applyDiscountsToProductForOrder(
      product,
      company.timezoneOffset,
    );
    return { ...orderItem, quantity: productId.quantity };
  }

  private async getOrderExtra(extraId: ExtrasIds) {
    return {
      ...(await this.addonService.getAddonForOrder(extraId.id)),
      quantity: extraId.quantity,
    };
  }

  async sendUnpaidOrder(
    createOrderDto: CreateOrderDto,
    encryptedQrData: string,
  ) {
    const order = await this.createOrder(
      createOrderDto,
      encryptedQrData,
      OrderType.CASH,
    );
    this.socketService.socket.to('' + order.companyId).emit('newOrder', order);
  }

  async setupPayment(createOrderDto: CreateOrderDto, encryptedQrData: string) {
    const { productIds, tip } = createOrderDto;
    const { companyId } = await this.encryptionService.decryptJson(
      encryptedQrData,
    );
    const company = await this.companyService.findById(companyId);
    let price = 0;
    for (const itemId of productIds) {
      const product = await this.productService.getProductByIdAndCompanyId(
        itemId.id,
        companyId,
      );
      const appliedDiscount = await this.productService.applyDiscountsToProduct(
        product,
        company.timezoneOffset,
      );
      if (appliedDiscount)
        product.price = this.discountService.applyDiscountToProduct(
          appliedDiscount,
          product,
        );
      if (itemId.extrasIds)
        for (const extraId of itemId.extrasIds) {
          const extra = await this.addonService.getAddonById(extraId.id);
          price += extra.price * extraId.quantity;
        }
      price += product.price * itemId.quantity;
    }
    const paymentIntent = await this.paymentService.getPaymentIntent(
      price * 100 + (tip || 0) * 100,
      company.accountId,
    );
    paymentIntent.amount_details.tip.amount = (tip || 0) * 100;
    return paymentIntent;
  }

  async confirmPayment(
    confirmPaymentDto: ConfirmPaymentDto,
    encryptedQrData: string,
  ) {
    const orderItem = await this.createOrder(
      confirmPaymentDto.order,
      encryptedQrData,
      OrderType.AWAITING_PAYMENT,
      true,
    );
    const paymentIntent =
      await this.paymentService.updateAndconfirmPaymentIntent(
        confirmPaymentDto.paymentIntentId,
        confirmPaymentDto.paymentMethodId,
        orderItem.id || orderItem._id,
      );
    return paymentIntent;
  }

  async markOrderAsPaid(query: { _id: string } | { paymentIntentId: string }) {
    const order = await this.orderModel.findOneAndUpdate(
      query,
      {
        $set: { orderType: OrderType.PAID },
      },
      { returnNewDocument: true },
    );
    order.save();
    this.socketService.socket.to('' + order.companyId).emit('newOrder', order);
  }
}
