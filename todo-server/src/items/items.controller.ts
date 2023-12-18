import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './item.entity';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  // 取得API
  @Get()
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  // 作成API
  @Post()
  async addItem(@Body() item: { name: string }) {
    return await this.itemsService.addItem(item.name);
  }

  // 更新API
  @Put('done/:id')
  async changeDone(@Param('id') id: string): Promise<void> {
    return await this.itemsService.changeDone(id);
  }

  // 削除API　基本使用しない
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    return await this.itemsService.deleteItem(id);
  }

  @Delete()
  async deleteDone(): Promise<void> {
    return await this.itemsService.deleteDone();
  }
}
