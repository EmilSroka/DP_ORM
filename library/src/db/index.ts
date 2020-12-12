import { Pool, PoolClient } from 'pg';
export default class Database {
  private pool: Pool;
  private client: PoolClient;
  constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
  ) {
    this.pool = new Pool({
      host,
      port,
      user,
      password,
      database,
    });
  }
  async connectDB(): Promise<void> {
    this.client = await this.pool.connect();
  }
  getClient(): PoolClient {
    return this.client;
  }
  async disconnectDB(): Promise<void> {
    await this.pool.end();
  }
}
