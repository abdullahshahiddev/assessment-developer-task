import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserMessage } from '../user-message.entity';
import { UserMessageService } from './user-message.service';
import { UserMessageController } from './user-message.controller';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, // Use migrations only
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false,
      logging: true
    }),
    TypeOrmModule.forFeature([UserMessage])
  ],
  controllers: [AppController, UserMessageController],
  providers: [AppService, UserMessageService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      // Check database connection
      await this.connection.query('SELECT 1');
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
    }
  }
}
