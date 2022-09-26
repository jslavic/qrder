import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async GetAllProductsByAuthCompany(@Request() req: RequestWithCompany) {
    return await this.productService.getAllCompanyProducts(req.company.id);
  }

  // TODO: ADD COMPANY
  @Get('/orders/:encryptedQrData')
  async getAllProducts(
    @Param('encryptedQrData') encryptedQrData: string,
    // @Query('take') take: number,
    // @Query('skip') skip: number,
  ) {
    const response = await this.productService.getAllProductsForCustomerDisplay(
      encryptedQrData,
    );
    return response;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Get('/search')
  async searchCompanyProducts(
    @Request() req: RequestWithCompany,
    @Query('query') query: string,
  ) {
    return this.productService.getProductsFromQuery(req.company.id, query);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number) {
    return await this.productService.getProductById(id);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestWithCompany,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(req.company);
    return await this.productService.createProduct(
      createProductDto,
      req.company,
      file ? file.buffer : null,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/:id')
  async updateProduct(
    @Request() req: RequestWithCompany,
    @Body()
    updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    const existingProduct =
      await this.productService.getProductByIdAndCompanyId(id, req.company.id);
    const updatedProduct = await this.productService.updateProduct(
      updateProductDto,
      existingProduct,
      file.buffer,
    );
    return updatedProduct;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Delete('/:id')
  async deleteById(
    @Param('id') id: number,
    @Request() req: RequestWithCompany,
  ) {
    const existingProduct =
      await this.productService.getProductByIdAndCompanyId(id, req.company.id);
    return await this.productService.deleteProduct(existingProduct);
  }
}
