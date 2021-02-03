import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { LoadStrategyFactory } from './load-strategy-factory';
import { Condition } from '../../database/postgresql/model/condition';
import { IdentityMap } from '../../main/metadata-containers/identity-map';
import { isRelationshipField } from '../../common/models/field-types';
import { TableMap } from '../../common/models/table-map';

export class EntityLoader {
  constructor(
    private tables: Tables,
    private dbSchema: TableSchema[],
    private identityMap: IdentityMap, // <Entity>,
  ) {}

  toAction(tableName: string, condition: Condition): any {
    return async (repository: any) => {
      let { rows: results } = await repository.select(
        tableName,
        ['*'],
        condition,
      );
      const type = this.getTableMap(tableName).constructor;
      results = results.map((data) => [
        this.createInstance(tableName, type, data),
        this.getPrimaryKey(tableName, data),
      ]);
      for (let i = 0; i < results.length; i++) {
        const [instance, key] = results[i];
        if (this.identityMap.has(key[2], tableName)) {
          results[i][0] = this.identityMap.get(key[2], tableName);
        } else {
          this.identityMap.add(instance, key[2], tableName);
          await this.loadRecursively(tableName, instance, key, repository);
        }
      }
      return results.map(([instance]) => instance);
    };
  }

  createInstance<T>(
    tableName: string,
    type: { new (...args: any[]): T },
    data: { [column: string]: any },
  ): T {
    const tableMap = this.getTableMap(tableName);
    const tableSchema = this.getTableSchema(tableName);
    const result = new type();
    for (const field of tableMap.columns) {
      if (isRelationshipField(field.type)) continue;
      result[field.fieldName] = data[field.columnName];
    }
    const implicit = tableSchema.columns.filter(
      ({ name }) =>
        !tableMap.columns.some(({ columnName }) => name === columnName),
    );
    for (const field of implicit) {
      result[field.name] = data[field.name];
    }
    return result;
  }

  getPrimaryKey(
    tableName: string,
    data: { [column: string]: any },
  ): [string, string, any] {
    const map = this.getTableSchema(tableName);
    const tableMap = this.getTableMap(tableName);
    const { name } = map.columns.find(({ isPrimaryKey }) => isPrimaryKey);
    const column = tableMap.columns.find(
      ({ columnName }) => columnName === name,
    );
    const fieldName = column ? column.fieldName : name;
    return [name, fieldName, data[name]];
  }

  async loadRecursively(
    tableName: string,
    instance: any,
    [dbName, keyName, keyValue]: [string, string, any],
    repository: any, // TODO: update repository type
  ): Promise<any> {
    const tableMap = this.getTableMap(tableName);
    for (const field of tableMap.columns) {
      if (!isRelationshipField(field.type)) continue;

      instance[field.fieldName] = await LoadStrategyFactory.get(
        field.type.type,
      ).load(
        field,
        tableName,
        [dbName, keyValue],
        this,
        repository,
        this.dbSchema,
      );
    }
  }

  private getTableSchema(name: string): TableSchema {
    return this.dbSchema.find(({ name: tableName }) => tableName === name);
  }

  private getTableMap(name: string): TableMap<any> {
    return this.tables.get(name);
  }
}
