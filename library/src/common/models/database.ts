import { PostgresqlRepository } from '../../database/postgresql/database/postgresql-repository';

export interface Database {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  transaction: (
    actions: Array<(repo: PostgresqlRepository) => Promise<boolean>>,
  ) => Promise<boolean>;
}
