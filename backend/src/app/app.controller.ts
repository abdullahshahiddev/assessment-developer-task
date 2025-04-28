import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHello() {
    return {
      message: 'hello',
      items: [1, 2, 3]
    };
  }
}
