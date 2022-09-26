import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { AddonService } from './addon.service';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';

@Controller('addon')
export class AddonController {
  constructor(private readonly addonService: AddonService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async findAll(@Request() req: RequestWithCompany) {
    return await this.addonService.getAllCompanyAddons(req.company.id);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: number, @Request() req: RequestWithCompany) {
    return await this.addonService.getAddonByIdAndCompanyId(id, req.company.id);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post()
  async create(
    @Body() createAddonDto: CreateAddonDto,
    @Request() req: RequestWithCompany,
  ) {
    return await this.addonService.createAddon(createAddonDto, req.company);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateAddonDto: UpdateAddonDto,
    @Request() req: RequestWithCompany,
  ) {
    const existingAddon = await this.addonService.getAddonByIdAndCompanyId(
      id,
      req.company.id,
    );
    return await this.addonService.updateAddon(updateAddonDto, existingAddon);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: number, @Request() req: RequestWithCompany) {
    const existingAddon = await this.addonService.getAddonByIdAndCompanyId(
      id,
      req.company.id,
    );
    if (!existingAddon)
      throw new NotFoundException(
        'Addon with this ID does not exist for this company',
      );
    return this.addonService.deleteAddon(existingAddon);
  }
}
