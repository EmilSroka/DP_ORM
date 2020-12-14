import { Pool } from 'pg';
import { PostgreSQLConfiguration } from '../model/configuration';
import { Database } from '../../../common/models/database';
import { PostgresqlRepository } from './postgresql-repository';

export class PostgresqlDatabase implements Database {
  private pool: Pool;

  constructor(private settings: PostgreSQLConfiguration) {}

  async connect(): Promise<any> {
    this.pool = new Pool(this.settings.connection);
  }

  async disconnect(): Promise<any> {
    await this.pool.end();
  }

  // JS resources:
  // 1. Promise
  // -> https://www.youtube.com/watch?v=RvYYCGs45L4
  // -> https://www.youtube.com/watch?v=FtdM3LIUXx4
  // 2. async / await
  // -> https://www.youtube.com/watch?v=gdOfDaX1BbU
  // 3. if you want deep understanding
  // -> https://www.youtube.com/watch?v=vn3tm0quoqE

  // PostgreSQL resource: https://node-postgres.com/features/transactions -> A pooled client with async/await

  async transaction(
    actions: Array<(repository: PostgresqlRepository) => Promise<boolean>>,
  ): Promise<any> {
    // TODO
    // 0. if pool doesn't exist -> reject promise
    // 1. get PoolClient from Pool
    // 2. create PostgresqlRepository
    // 2. start transaction: query 'BEGIN'
    // 3. iterate over actions and invoke, pass created PostgresqlRepository as parameter
    // -> if action fail (rejected promise or resolved as false): query 'ROLLBACK' -> reject promise (true)
    // -> else (all actions resolves successfully) -> resolve promise (false)
    return Promise.resolve();
  }
}
