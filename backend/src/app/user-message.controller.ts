import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserMessageService } from './user-message.service';

@Controller('messages')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}

  @Post()
  async create(@Body() body: { message: string; items: number[] }) {
    return this.userMessageService.create(body.message, body.items);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '3',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const take = parseInt(limit, 10) || 3;
    const skip = (pageNum - 1) * take;
    const [data, total] = await this.userMessageService.findAll(skip, take);
    return {
      data,
      total,
      page: pageNum,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }
}
