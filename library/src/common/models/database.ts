import { PostgresqlRepository } from '../../database/postgresql/database/postgresql-repository';

export interface Database {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  transaction: <T>(
    actions: Array<(repo: PostgresqlRepository) => Promise<T>>,
  ) => Promise<T[]>;
}
