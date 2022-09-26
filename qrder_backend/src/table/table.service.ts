import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QrData } from 'src/common/interface/qr-data.interface';
import Company from 'src/company/entities/company.entity';
import { EncryptionService } from 'src/encryption/encryption.service';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import Table from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly encryptionService: EncryptionService<QrData>,
  ) {}

  async getAllTables(companyId: number) {
    const tables = await this.tableRepository.findBy({
      company: { id: companyId },
    });
    return await Promise.all(
      tables.map(async (table) => await this.getQrData(table, companyId)),
    );
  }

  async getTableById(id: number) {
    return await this.tableRepository.findOneByOrFail({ id });
  }

  async getTableByIdAndCompanyId(tableId: number, companyId: number) {
    return await this.tableRepository.findOneByOrFail({
      id: tableId,
      company: { id: companyId },
    });
  }

  async getTableByNameAndCompanyId(name: string, companyId: number) {
    return await this.tableRepository.findOneBy({
      name,
      company: { id: companyId },
    });
  }

  async createTable(createTableDto: CreateTableDto, company: Company) {
    const existingTable = await this.getTableByNameAndCompanyId(
      createTableDto.name,
      company.id,
    );
    if (existingTable)
      throw new BadRequestException('Table with this name already exists');
    const table = this.tableRepository.create({
      ...createTableDto,
      company,
    });
    const savedTable = await this.tableRepository.save(table);
    return await this.getQrData(savedTable, company.id);
  }

  async updateTable(
    updateTableDto: UpdateTableDto,
    table: Table,
    comapnyId: number,
  ) {
    const updatedTable = { ...table, ...updateTableDto };
    const savedTable = await this.tableRepository.save(updatedTable);
    return await this.getQrData(savedTable, comapnyId);
  }

  async deleteTable(table: Table) {
    return await this.tableRepository.remove(table);
  }

  async getQrData(table: Table, companyId: number) {
    const path = await this.encryptionService.encryptJson({
      tableId: table.id,
      companyId: companyId,
    });
    return { table, path };
  }
}
