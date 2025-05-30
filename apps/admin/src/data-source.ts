import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: 'yeqorka',
  password: 'test228',
  database: 'postgres',
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
});

// In TypeORM we can create/generrate/run migrations
// We need migrations when we want to change the structure of the database
// 1) If we want to create migration manually ( for exmp it is difficult or we have specific issues ), we use:
// npx typeorm migration:create src/migrations/[NAME OF MIGRATION] 
// 2) If we want to run basic migration, we use:
// npx typeorm migration:generate src/migrations/[NAME OF MIGRATION] -d dist/data-source.js ( path to data-source file )
// 3) If we want to run migration, we use:
// npx typeorm migration:run -d dist/data-source.js   