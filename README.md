## Full-Stack Developer Assessment Guide

### Goal:
Your task is to set up a full-stack application using Nx as the monorepo tool, incorporating both an Angular frontend and a NestJS backend, with MySQL database integration, PrimeNG UI components, and database migrations for user messages. This document outlines the step-by-step instructions for completing the assessment.

### Getting Started

1. **Start the Development Shell**  
   Run the following command in the root directory to start the development shell:
   ```bash
   ./shell
   ```
   This will set up a Docker container with all the necessary development tools for the project.

### Development Setup

1. **Install Nx Globally**  
   Install the latest version of Nx globally:
   ```bash
   npm install -g nx@latest
   ```
2. **Set Up Nx in the Existing Repository**
   If Nx is not yet set up in the repository, initialize Nx:
   ```bash
   npm install -D nx@latest @nrwl/workspace
   ```
3. **Install Project Dependencies**  
   Install the dependencies for the project:
   ```bash
   npm install
   ```
4. **Finally, initialize the Nx workspace:**  
   Install the dependencies for the project:
   ```bash
   npx nx@latest init
   ```
### Step-by-Step Guide

#### 2. **Create Angular Frontend Application**

1. **Install Angular Plugin for Nx**  
   Install the Nx Angular plugin:
   ```bash
   npm install -D @nx/angular@latest
   ```

2. **Generate Angular App**  
   Create a new Angular application named 'frontend':
   ```bash
   npx nx g @nx/angular:app frontend --routing=true --style=scss --standalone=true
   ```

3. **Start Angular App**  
   Run the Angular app:
   ```bash
   nx serve frontend
   ```

4. **Install PrimeNG and PrimeIcons**  
   Install PrimeNG and its dependencies:
   ```bash
   npm install primeng@latest primeicons@latest
   ```

5. **Update Angular App to Use PrimeNG**
   - Add the required PrimeNG styles in `angular.json` under the styles array:
   ```json
   "styles": [
     "node_modules/primeicons/primeicons.css",
     "node_modules/primeng/resources/themes/lara-light-indigo/theme.css",
     "node_modules/primeng/resources/primeng.min.css",
     "src/styles.scss"
   ]
   ```

#### 3. **Set Up NestJS Backend Application**

1. **Install NestJS Plugin for Nx**  
   Install the Nx NestJS plugin:
   ```bash
   npm install -D @nx/nest@latest
   ```

2. **Generate NestJS App**  
   Create a new NestJS backend app:
   ```bash
   npx nx g @nx/nest:app backend --frontendProject=frontend
   ```

3. **Start NestJS App**  
   Run the NestJS backend:
   ```bash
   nx serve backend
   ```

4. **Create API Endpoint**  
   Implement a basic API endpoint in NestJS that returns:
   ```json
   {
     "message": "hello",
     "items": [1, 2, 3]
   }
   ```

#### 4. **Set Up MySQL Database and Configure TypeORM**

1. **Install TypeORM, MySQL Driver, and dotenv**  
   Install the necessary dependencies for connecting to MySQL:
   ```bash
   npm install @nestjs/typeorm typeorm mysql2 dotenv
   ```

2. **Configure MySQL in NestJS App**  
   Update `app.module.ts` to configure the connection to the MySQL database:
   ```typescript
   imports: [
     TypeOrmModule.forRoot({
       type: 'mysql',
       host: process.env.APP_DB_HOST,
       port: parseInt(process.env.APP_DB_PORT || '3306', 10),
       username: process.env.APP_DB_USER,
       password: process.env.APP_DB_PASSWORD,
       database: process.env.APP_DB_NAME,
       autoLoadEntities: true,
       synchronize: false, // Use migrations only
       migrations: ['dist/migrations/*.js'],
       migrationsRun: false,
       logging: true
     }),
   ]
   ```

3. **Create `.env` File for Database Credentials**  
   In the root of your project, create a `.env` file containing the MySQL credentials:
   ```env
   APP_DB_HOST=127.0.0.1
   APP_DB_PORT=3306
   APP_DB_USER=app
   APP_DB_PASSWORD=app
   APP_DB_NAME=app
   ```

4. **Create UserMessage Entity**  
   Create `user-message.entity.ts` in the `src` folder:
   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class UserMessage {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     message: string;

     @Column('simple-array')
     items: number[];
   }
   ```

5. **Update `app.module.ts` to Include UserMessage Entity**
   Add `TypeOrmModule.forFeature([UserMessage])` to your `app.module.ts`:
   ```typescript
   imports: [
     TypeOrmModule.forFeature([UserMessage]),
   ]
   ```

6. **Verify MySQL is Running (via Docker)**
   Check if the MySQL container is up and running:
   ```bash
   docker ps --format 'table {{.Names}} {{.Image}} {{.Status}} {{.Ports}}'
   ```
   If MySQL is not running, start it using:
   ```bash
   docker-compose -f docker-compose.shell.yml up -d
   ```
#### 5. **Database Migrations**

1. **Create data source file**  
   Generate a file `data-source.ts` in the `backend` directory with the following data:
   ```typescript
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

   ```


2. **Generate Migration for UserMessage Table**  
   Generate a migration file to create the `user_messages` table, run the following command in the `backend` directory:
   ```bash
   npx typeorm-ts-node-commonjs migration:generate --dataSource ./data-source.ts src/migrations/CreateUserMessages --pretty
   ```

3. **Run the Migration**  
   Apply the migration to your MySQL database:
   ```bash
   npx typeorm-ts-node-commonjs migration:run --dataSource ./data-source.ts
   ```

4. **Verify the Table Was Created**  
   Log into MySQL and check if the `user_message` table was created:
   ```bash
   mysql -h 127.0.0.1 -P 3306 -u app -papp app
   SHOW TABLES;
   ```

#### 6. **Implement API Endpoints**

1. **Create POST `/messages` Endpoint**
   Implement a POST endpoint to accept and store messages from the frontend.

2. **Create GET `/messages?page=1&limit=3` Endpoint**
   Implement a GET endpoint to return paginated messages (3 per page).

#### 7. **Frontend Setup: Display Messages with PrimeNG**

1. **Build Form to Submit Messages**  
   In the Angular frontend, create a form to submit messages to the backend.

2. **Display Messages Using PrimeNG Components**
   - Use PrimeNG's `Message` component to display the message.
   - Use the `Listbox` component to display the items in the message.

3. **Add PrimeNG Paginator for Pagination**  
   Add pagination functionality using PrimeNG’s `Paginator` component to paginate the displayed messages.

#### 8. **Testing and Validation**

1. **Create Test Messages in the Database**  
   Use the `/messages` API to create 10 test messages in the database.

2. **Verify Pagination Functionality**  
   Test the GET `/messages` endpoint to ensure that the messages are being paginated correctly (3 messages per page).

#### 9. **Next Steps**

1. **Backend:**
   - Implement additional API endpoints as required.
   - Implement authentication and authorization if needed.
   - Add more complex business logic to handle message storage.

2. **Frontend:**
   - Improve the user interface.
   - Implement error handling and form validation.
   - Make the UI more responsive and user-friendly.

---

This guide should help you complete the full-stack application using Nx, Angular, NestJS, MySQL, and PrimeNG. Ensure that all dependencies are installed and configured properly, and follow the steps in order for a smooth development experience.