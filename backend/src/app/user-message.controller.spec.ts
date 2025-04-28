import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { getConnection } from 'typeorm';

describe('UserMessageController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().close();
    await app.close();
  });

  it('POST /messages should create a message', async () => {
    const response = await request(app.getHttpServer())
      .post('/messages')
      .send({ message: 'test message', items: [1, 2, 3] })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('test message');
    expect(response.body.items).toEqual([1, 2, 3]);
  });

  it('GET /messages should return paginated messages', async () => {
    // Create 4 messages
    for (let i = 0; i < 4; i++) {
      await request(app.getHttpServer())
        .post('/messages')
        .send({ message: `msg${i}`, items: [i] });
    }
    const response = await request(app.getHttpServer())
      .get('/messages?page=1&limit=3')
      .expect(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.length).toBeLessThanOrEqual(3);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('totalPages');
  });
});
