import { PoolClient } from 'pg';

export class PostgresqlRepository {
  constructor(private client: PoolClient) {}
}
