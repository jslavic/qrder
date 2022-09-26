import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableService } from './table.service';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async findAll(@Request() req: RequestWithCompany) {
    return await this.tableService.getAllTables(req.company.id);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.tableService.getTableById(id);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post()
  async create(
    @Body() createTableDto: CreateTableDto,
    @Request() req: RequestWithCompany,
  ) {
    return await this.tableService.createTable(createTableDto, req.company);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateTableDto: UpdateTableDto,
    @Request() req: RequestWithCompany,
  ) {
    const existingTable = await this.tableService.getTableByIdAndCompanyId(
      id,
      req.company.id,
    );
    return await this.tableService.updateTable(
      updateTableDto,
      existingTable,
      req.company.id,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: number, @Request() req: RequestWithCompany) {
    const existingTable = await this.tableService.getTableByIdAndCompanyId(
      id,
      req.company.id,
    );
    return this.tableService.deleteTable(existingTable);
  }
}
