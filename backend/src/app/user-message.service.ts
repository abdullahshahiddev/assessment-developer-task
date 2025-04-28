import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMessage } from '../user-message.entity';

@Injectable()
export class UserMessageService {
  constructor(
    @InjectRepository(UserMessage)
    private readonly userMessageRepository: Repository<UserMessage>,
  ) {}

  async create(message: string, items: number[]): Promise<UserMessage> {
    const userMessage = this.userMessageRepository.create({ message, items });
    return this.userMessageRepository.save(userMessage);
  }

  async findAll(skip = 0, take = 3): Promise<[UserMessage[], number]> {
    return this.userMessageRepository.findAndCount({
      skip,
      take,
      order: { id: 'DESC' },
    });
  }
}
