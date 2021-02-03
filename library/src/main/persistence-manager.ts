import { IdentityMap } from './metadata-containers/identity-map';
import { TableSchema } from '../common/models/database-schema';
import { Database } from '../common/models/database';
import { Equal, Field } from '../database/postgresql/database/condition';
import { EntityLoader } from '../mapping/load-mapper/entity-loader';
import { EntitySave } from '../mapping/save-mapper/entity-save';
import { isEntity } from '../common/models/entity';
import { Condition } from '../database/postgresql/model/condition';

export class PersistenceManager {
  constructor(
    private identityMap: IdentityMap,
    private dbSchema: TableSchema[],
    private db: Database,
    private loader: EntityLoader,
    private saver: EntitySave,
  ) {}

  select<T>(cl: { new (): T }, condition: Condition): Promise<T> {
    const tableName = cl.prototype._orm_table_name;
    if (tableName == undefined) throw new Error("ORM: It's not entity class");
    return this.internal_select(tableName, condition);
  }

  internal_select<T>(tableName: string, condition: Condition): Promise<T> {
    tableName = tableName.toLowerCase();

    return this.db
      .transaction<any>([this.loader.toAction(tableName, condition)])
      .then(([result]) => result);
  }

  get<T>(cl: { new (): T }, id: any): Promise<T> {
    const tableName = cl.prototype._orm_table_name;
    if (tableName == undefined) throw new Error("ORM: It's not entity class");
    return this.internal_get(tableName, id);
  }

  internal_get<T>(tableName: string, id: number | string): Promise<T> {
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

  async save(entity: any): Promise<any> {
    if (!isEntity(entity))
      throw new Error("ORM: can't save not an entity class");

    await this.db.transaction<[any]>([this.saver.toAction(entity, new Set())]);
  }

  getPrimaryKey(tableName: string): string {
    const map = this.dbSchema.find(({ name }) => name === tableName);
    const { name } = map.columns.find(({ isPrimaryKey }) => isPrimaryKey);
    return name;
  }
}
