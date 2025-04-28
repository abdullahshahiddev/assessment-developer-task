require('dotenv').config();
const { DataSource } = require('typeorm');
const { UserMessage } = require('./src/user-message.entity'); // Ensure this path is correct

module.exports = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserMessage],  // Ensure your entities are properly listed
  migrations: [__dirname + '/src/migrations/*.{js,ts}'],
  cli: {
    migrationsDir: 'src/migrations', // Path for migrations directory
  },
  synchronize: false,  // Disable auto-syncing, use migrations
  logging: true,
});
