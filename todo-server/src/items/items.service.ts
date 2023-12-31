import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async addItem(name: string): Promise<void> {
    await this.itemsRepository.insert({ name });
  }

  async changeDone(id: any): Promise<void> {
    await this.itemsRepository.update(id, { done: true });
  }

  async deleteItem(id: string): Promise<void> {
    await this.itemsRepository.delete(id);
  }

  async deleteDone(): Promise<void> {
    await this.itemsRepository.delete({ done: true });
  }
}
