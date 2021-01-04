import { PoolClient } from 'pg';

export class PostgresqlRepository {
  constructor(private client: PoolClient) {}

  insert(tableName: string, fields: string[], values: any[][]): Promise<any> {
    // TODO:
    // 1. create "Query config object"
    // - text: "INSERT INTO" query with proper:
    //         - tableName and
    //         - number of VALUES parts (length of values parameter),
    //           each having correct $n for interpolation
    //   check fixtures/postgresql-repository.ts for examples (if you want of course)
    // - values: flattened values parameter
    // https://node-postgres.com/features/queries#parameterized-query
    // 2. call query on client field and return it's output (it should be a promise)
    return Promise.reject();
  }
}
