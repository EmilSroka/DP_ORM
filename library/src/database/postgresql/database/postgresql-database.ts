import { Pool } from 'pg';
import { NumericType, PostgreSQLConfiguration } from '../model/configuration';
import { Database } from '../../../common/models/database';
import { PostgresqlRepository } from './postgresql-repository';
import { CreateQueryPartFactory } from './create-query-part';
import { DBAction } from '../../../common/models/db-action';

const defaultCreateDetails = {
  number: { type: 'float' as NumericType, precision: 53 },
  stringMaxSize: 512,
};

export class PostgresqlDatabase implements Database {
  private pool: Pool;

  constructor(private settings: PostgreSQLConfiguration) {}

  async connect(): Promise<any> {
    this.pool = new Pool(this.settings.connection);
  }

  async disconnect(): Promise<any> {
    await this.pool.end();
  }

  async transaction<T>(actions: DBAction[]): Promise<T[]> {
    if (this.pool == undefined) return Promise.reject(false);
    const results: T[] = [];

    const client = await this.pool.connect();
    try {
      const createColumnFactory = new CreateQueryPartFactory({
        ...defaultCreateDetails,
        ...this.settings.create,
      });
      const repository = new PostgresqlRepository(client, createColumnFactory);
      await client.query('BEGIN');
      for (const action of actions) {
        const result = await action(repository);
        results.push(result);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      const _error = new Error(`ORM: internal DB error`);
      (_error as any).source = error;
      throw _error;
    } finally {
      client.release();
    }

    return results;
  }
}
