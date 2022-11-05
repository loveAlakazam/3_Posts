import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/src/entities/*.{ts,js}'],
  migrations: [__dirname + '/src/migration/*.{ts,js}'],
  charset: 'utf8mb4',
  synchronize: true,
  logging: true,
});

export default dataSource;
