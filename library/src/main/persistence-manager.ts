import { IdentityMap } from './metadata-containers/identity-map';
import { TableSchema } from '../common/models/database-schema';
import { Database } from '../common/models/database';
import { Equal, Field } from '../database/postgresql/database/condition';
import { EntityLoader } from '../mapping/load-mapper/entity-loader';

export class PersistenceManager {
  constructor(
    private identityMap: IdentityMap,
    private dbSchema: TableSchema[],
    private db: Database,
    private loader: EntityLoader,
  ) {}

  get<T>(tableName: string, id: number | string): Promise<T> {
    tableName = tableName.toLowerCase();

    if (this.identityMap.has(id, tableName))
      return Promise.resolve(this.identityMap.get(id, tableName));

    const field = new Field(this.getPrimaryKey(tableName));

    return this.db
      .transaction<[any]>([
        this.loader.toAction(tableName, new Equal(field, id)),
      ])
      .then(([[result]]) => result);
  }

  getPrimaryKey(tableName: string): string {
    const map = this.dbSchema.find(({ name }) => name === tableName);
    const { name } = map.columns.find(({ isPrimaryKey }) => isPrimaryKey);
    return name;
  }
}
