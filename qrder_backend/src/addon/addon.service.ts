import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Company from 'src/company/entities/company.entity';
import Product from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';
import Addon from './entities/addon.entity';

@Injectable()
export class AddonService {
  constructor(
    @InjectRepository(Addon)
    private readonly addonRepository: Repository<Addon>,
  ) {}

  async getAllCompanyAddons(companyId: number) {
    return await this.addonRepository.find({
      where: { company: { id: companyId } },
      relations: ['products'],
    });
  }

  async getAddonById(id: number) {
    return await this.addonRepository.findOneByOrFail({ id });
  }

  async getAddonForOrder(id: number) {
    const addon = await this.getAddonById(id);
    console.log(addon);
    return { name: addon.name, price: addon.price };
  }

  async getAddonByIdAndCompanyId(addonId: number, companyId: number) {
    return await this.addonRepository.findOneOrFail({
      where: {
        id: addonId,
        company: { id: companyId },
      },
    });
  }

  async getAddonsFromIdArray(addonIds: number[], companyId: number) {
    const addons: Addon[] = [];
    if (addonIds)
      for (const addonId of addonIds) {
        try {
          console.log(addonId);
          const existingAddon = await this.getAddonByIdAndCompanyId(
            addonId,
            companyId,
          );
          if (existingAddon) addons.push(existingAddon);
        } catch {
          continue;
        }
      }
    return addons;
  }

  async createAddon(
    createAddonDto: CreateAddonDto,
    company: Company,
    products?: Product[],
  ) {
    const addon = this.addonRepository.create({
      ...createAddonDto,
      company,
      products,
    });
    return this.addonRepository.save(addon);
  }

  async updateAddon(
    updateAddonDto: UpdateAddonDto,
    addon: Addon,
    products?: Product[],
  ) {
    const updatedAddon = { ...addon, ...updateAddonDto, products };
    return await this.addonRepository.save(updatedAddon);
  }

  async deleteAddon(addon: Addon) {
    return await this.addonRepository.remove(addon);
  }
}
