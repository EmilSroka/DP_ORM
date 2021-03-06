import { Pool } from 'pg';
import { NumericType, PostgreSQLConfiguration } from '../model/configuration';
import { Database } from '../../../common/models/database';
import { PostgresqlRepository } from './postgresql-repository';
import { CreateQueryPartFactory } from './create-query-part';

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

  async transaction(
    actions: Array<(repository: PostgresqlRepository) => Promise<boolean>>,
  ): Promise<any> {
    if (this.pool == undefined) return Promise.reject(false);

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
        if (result === false) throw 'action failed';
      }
      await client.query('COMMIT');
    } catch {
      await client.query('ROLLBACK');
      return Promise.reject(false);
    }

    client.release();
    return true;
  }
}
