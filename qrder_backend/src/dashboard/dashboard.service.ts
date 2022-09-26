import { Injectable } from '@nestjs/common';
import { AddonService } from 'src/addon/addon.service';
import { CreateAddonDto } from 'src/addon/dto/create-addon.dto';
import { UpdateAddonDto } from 'src/addon/dto/update-addon.dto';
import Company from 'src/company/entities/company.entity';
import { DiscountService } from 'src/discount/discount.service';
import { CreateDiscountDto } from 'src/discount/dto/create-discount.dto';
import { UpdateDiscountDto } from 'src/discount/dto/update-discount.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
    private readonly addonService: AddonService,
  ) {}

  async getAllDashboardItems(companyId: number) {
    const products = await this.productService.getAllCompanyProducts(companyId);
    const discounts = await this.discountService.getAllCompanyDiscounts(
      companyId,
    );
    const addons = await this.addonService.getAllCompanyAddons(companyId);
    return { products, discounts, addons };
  }

  async addProductWithRelations(
    createProductDto: CreateProductDto,
    company: Company,
    imageBuffer: Buffer,
  ) {
    console.log(createProductDto.discountIds);
    const discounts = await this.discountService.getDiscountsFromIdArray(
      createProductDto.discountIds,
      company.id,
    );
    const addons = await this.addonService.getAddonsFromIdArray(
      createProductDto.discountIds,
      company.id,
    );
    return await this.productService.createProduct(
      createProductDto,
      company,
      imageBuffer,
      discounts,
      addons,
    );
  }

  async updateProductWithRelations(
    id: number,
    companyId: number,
    updateProductDto: UpdateProductDto,
    imageBuffer?: Buffer,
  ) {
    const product = await this.productService.getProductByIdAndCompanyId(
      id,
      companyId,
    );
    const discounts = updateProductDto.discountIds
      ? await this.discountService.getDiscountsFromIdArray(
          updateProductDto.discountIds,
          companyId,
        )
      : product.discounts;
    const addons = updateProductDto.addonIds
      ? await this.addonService.getAddonsFromIdArray(
          updateProductDto.addonIds,
          companyId,
        )
      : product.addons;
    return await this.productService.updateProduct(
      updateProductDto,
      product,
      imageBuffer,
      discounts,
      addons,
    );
  }

  async addDiscountWithRelations(
    createDiscountDto: CreateDiscountDto,
    company: Company,
  ) {
    const products = await this.productService.getProductsFromIdArray(
      createDiscountDto.productIds,
      company.id,
    );
    return await this.discountService.createDiscount(
      createDiscountDto,
      company,
      products,
    );
  }

  async updateDiscountWithRelations(
    id: number,
    companyId: number,
    tzOffset: number,
    updateDiscountDto: UpdateDiscountDto,
  ) {
    const discount = await this.discountService.getDiscountByIdAndCompanyId(
      id,
      companyId,
    );
    const products = updateDiscountDto.productIds
      ? await this.productService.getProductsFromIdArray(
          updateDiscountDto.productIds,
          companyId,
        )
      : discount.products;
    console.log(products);
    return await this.discountService.updateDiscount(
      updateDiscountDto,
      discount,
      tzOffset,
      products,
    );
  }

  async addAddonWithRelations(
    createAddonDto: CreateAddonDto,
    company: Company,
  ) {
    const products = await this.productService.getProductsFromIdArray(
      createAddonDto.productIds,
      company.id,
    );
    return await this.addonService.createAddon(
      createAddonDto,
      company,
      products,
    );
  }

  async updateAddonWithRelations(
    id: number,
    companyId: number,
    updateAddonDto: UpdateAddonDto,
  ) {
    const addon = await this.addonService.getAddonByIdAndCompanyId(
      id,
      companyId,
    );
    const products = updateAddonDto.productIds
      ? await this.productService.getProductsFromIdArray(
          updateAddonDto.productIds,
          companyId,
        )
      : addon.products;
    console.log(products);
    return await this.addonService.updateAddon(updateAddonDto, addon, products);
  }
}
