import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Addon from 'src/addon/entities/addon.entity';
import { currencyDisplayValues } from 'src/common/constants/currencyDisplayValues';
import { QrData } from 'src/common/interface/qr-data.interface';
import { CompanyService } from 'src/company/company.service';
import Company from 'src/company/entities/company.entity';
import { DiscountService } from 'src/discount/discount.service';
import Discount from 'src/discount/entities/discount.entity';
import { EncryptionService } from 'src/encryption/encryption.service';
import { FileService } from 'src/file/file.service';
import { getDiscountEndDate } from 'src/helpers/getDiscountEndDate';
import { ILike, In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import Product from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly companyService: CompanyService,
    private readonly discountService: DiscountService,
    private readonly encryptionService: EncryptionService<QrData>,
    private readonly fileService: FileService,
  ) {}

  async getAllProducts(companyId: number, take = 20, skip = 0) {
    return await this.productRepository.find({
      where: { company: { id: companyId } },
      take,
      skip,
      relations: ['discounts', 'addons'],
    });
  }

  async getProductsFromArray(ids: number[], companyId: number) {
    return await this.productRepository.find({
      where: { id: In(ids), company: { id: companyId } },
    });
  }

  async getAllProductsForCustomerDisplay(encryptedQrData: string) {
    const stringifiedObject = await this.encryptionService.decryptJson(
      encryptedQrData,
    );
    const products = await this.getAllProducts(stringifiedObject.companyId);
    const company = await this.companyService.findById(
      stringifiedObject.companyId,
    );
    const productsForDisplay = await this.applyDiscountsToAllProductsForDisplay(
      products,
      company.timezoneOffset,
    );
    return {
      companyName: company.name,
      products: productsForDisplay,
      currency: currencyDisplayValues[company.currency] || company.currency,
    };
  }

  async getAllCompanyProducts(companyId: number) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where({ company: { id: companyId } })
      .select(['product', 'discount.id', 'addon.id'])
      .leftJoin('product.discounts', 'discount')
      .leftJoin('product.addons', 'addon')
      .getMany();
    return products;
  }

  async getProductById(id: number) {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['discounts', 'addons'],
    });
    // return await this.productRepository.findOneByOrFail({ id });
  }

  async getProductByIdAndCompanyId(
    productId: number,
    companyId: number,
    includeRelations = true,
  ) {
    return await this.productRepository.findOne({
      where: {
        id: productId,
        company: { id: companyId },
      },
      ...(includeRelations && { relations: ['discounts', 'addons'] }),
    });
  }

  async getProductsFromQuery(companyId: number, query: string) {
    return await this.productRepository.find({
      select: ['id', 'imageUrl', 'name', 'price'],
      where: {
        name: ILike(`%${query}%`),
        company: { id: companyId },
      },
      take: 5,
    });
  }

  async getProductsFromIdArray(productIds: number[], companyId: number) {
    const products: Product[] = [];
    if (productIds)
      for (const productId of productIds) {
        try {
          const existingProduct = await this.getProductByIdAndCompanyId(
            productId,
            companyId,
          );
          if (existingProduct) products.push(existingProduct);
        } catch {
          continue;
        }
      }
    return products;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    company: Company,
    imageBuffer?: Buffer,
    discounts?: Discount[],
    addons?: Addon[],
  ) {
    let uploadedImageUrl: string | null = null;
    if (imageBuffer) {
      uploadedImageUrl = await this.fileService.uploadPublicFile(
        imageBuffer,
        createProductDto.name,
      );
    }
    const newProduct = this.productRepository.create({
      ...createProductDto,
      imageUrl: uploadedImageUrl,
      company,
      discounts,
      addons,
    });
    return await this.productRepository.save(newProduct);
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    product: Product,
    imageBuffer?: Buffer,
    discounts?: Discount[],
    addons?: Addon[],
  ) {
    let imageUrl: string | null = product.imageUrl;
    if (imageBuffer) {
      if (product.imageUrl)
        await this.fileService.deletePublicFile(product.imageUrl);

      imageUrl = await this.fileService.uploadPublicFile(
        imageBuffer,
        updateProductDto.name || product.name,
      );
    }
    const updatedProduct = {
      ...product,
      ...updateProductDto,
      imageUrl,
      discounts,
      addons,
    };
    return await this.productRepository.save(updatedProduct);
  }

  async deleteProduct(product: Product) {
    if (product.imageUrl)
      await this.fileService.deletePublicFile(product.imageUrl);
    return await this.productRepository.remove(product);
  }

  async applyDiscountsToProduct(product: Product, timezoneOffset: number) {
    const appliedDiscount = await this.discountService.applyDiscounts(
      product.discounts,
      timezoneOffset,
    );
    return appliedDiscount;
  }

  async applyDiscountsToProductForOrder(
    product: Product,
    timezoneOffset: number,
  ) {
    const originalPrice = product.price;
    const appliedDiscount = await this.applyDiscountsToProduct(
      product,
      timezoneOffset,
    );
    if (appliedDiscount)
      product.price = this.discountService.applyDiscountToProduct(
        appliedDiscount,
        product,
      );
    const orderItem: {
      itemId: number;
      name: string;
      price: number;
      imageUrl: string;
      discount?: {
        discountId: number;
        name: string;
        amount: string;
        originalPrice: number;
      };
    } = {
      itemId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || 'someurl',
    };
    if (appliedDiscount)
      orderItem.discount = {
        discountId: appliedDiscount.id,
        name: appliedDiscount.name,
        amount: `${appliedDiscount.amount}${
          appliedDiscount.type == 'PERCENTAGE' ? '%' : ''
        }`,
        originalPrice: originalPrice,
      };
    console.log(orderItem.discount);
    return orderItem;
  }

  async applyDiscountsToProductForDisplay(
    product: Product,
    timezoneOffset: number,
  ) {
    const appliedDiscount = await this.applyDiscountsToProduct(
      product,
      timezoneOffset,
    );
    const discount = appliedDiscount
      ? {
          discountPrice: this.discountService.applyDiscountToProduct(
            appliedDiscount,
            product,
          ),
          discountAmount: `${appliedDiscount.amount}${
            appliedDiscount.type === 'AMOUNT' ? ' kn' : '%'
          }`,
          lastingTo: getDiscountEndDate(
            appliedDiscount.to,
            appliedDiscount.repeated,
            timezoneOffset,
          ),
        }
      : null;
    console.log(product.price);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      description: product.description,
      addons: product.addons,
      discount,
    };
  }

  async applyDiscountsToAllProductsForDisplay(
    products: Product[],
    timezoneOffset: number,
  ) {
    const productsWithDiscountApplied = await Promise.all(
      products.map(async (product) => {
        return await this.applyDiscountsToProductForDisplay(
          product,
          timezoneOffset,
        );
      }),
    );
    return productsWithDiscountApplied;
  }
}
