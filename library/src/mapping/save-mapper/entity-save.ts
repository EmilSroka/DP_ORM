import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { Entity } from '../../common/models/entity';
import { ExtraField } from './models/extra-fields';
import { DBAction } from '../../common/models/db-action';
import { Repository } from '../../common/models/repository';
import { SaveMapperFactory } from './save-mapper-factory';
import { DbType, isRelationshipField } from '../../common/models/field-types';
import { TableMap } from '../../common/models/table-map';
import { TableSchemaHelpers } from '../../utils/mapping';
import { Equal, Field } from '../../database/postgresql/database/condition';
import { IdentityMap } from '../../main/metadata-containers/identity-map';
import { PersistenceManager } from '../../main/persistence-manager';

export class EntitySave {
  public pm: PersistenceManager;

  constructor(
    private tables: Tables,
    private dbSchema: TableSchema[],
    private identityMap: IdentityMap,
  ) {}

  toAction(
    entity: Entity,
    savedObjects: Set<any>,
    foreignKeys?: ExtraField,
  ): DBAction {
    if (savedObjects.has(entity)) return () => Promise.resolve();

    return async (repository: Repository) => {
      await this.saveEntity(entity, foreignKeys, repository);
      savedObjects.add(entity);
      await this.saveRecursively(entity, savedObjects, repository);
    };
  }

  async saveEntity(
    entity: Entity,
    foreignKeys: ExtraField,
    repository: Repository,
  ): Promise<any> {
    const tableSchema = this.getTableSchema(entity._orm_table_name);
    const tableMap = this.getTableMap(entity._orm_table_name);

    const columns = this.getColumnNames(tableMap);
    const values = this.getValues(entity, tableMap);

    if (foreignKeys) {
      const {
        tableName: fkTableName,
        columnName: fkColumnName,
        value: fkValue,
      } = foreignKeys;
      const fkColumn = TableSchemaHelpers.getCorrespondedName(
        fkColumnName,
        fkTableName,
        tableSchema,
      );
      columns.push(fkColumn);
      values.push(fkValue);
    }

    const key = this.getKey(tableSchema);
    if (this.existsInDB(entity)) {
      if (this.hasExplicitKey(tableMap)) {
        columns.push(key);
        values.push(entity[key]);
      }

      const index = columns.indexOf(key);
      const value = values[index];

      await repository.update(
        tableMap.tableName,
        columns,
        values,
        new Equal<number>(new Field(key), value),
        [],
      );
    } else {
      const returning = this.handleAutoincrement(
        tableMap,
        columns,
        values,
        tableSchema,
      );

      const {
        rows: [returned],
      } = await repository.insert(
        tableMap.tableName,
        columns,
        [values],
        returning,
      );

      for (const [columnName, val] of Object.entries(returned || {})) {
        entity[TableSchemaHelpers.getNameInObject(columnName, tableMap)] = val;
      }

      this.identityMap.add(entity, entity[key], tableMap.tableName);
    }
  }

  private getColumnNames(tableMap: TableMap<any>): string[] {
    return tableMap.columns
      .filter(({ type }) => !isRelationshipField(type))
      .map(({ columnName }) => columnName);
  }

  private getValues(entity: Entity, tableMap: TableMap<any>): any[] {
    return tableMap.columns
      .filter(({ type }) => !isRelationshipField(type))
      .map(({ fieldName }) => entity[fieldName]);
  }

  private hasExplicitKey(tableMap: TableMap<any>): boolean {
    return !tableMap.columns.some(({ isPrimaryKey }) => isPrimaryKey);
  }

  private getKey(tableSchema: TableSchema): string {
    return tableSchema.columns.find(({ isPrimaryKey }) => isPrimaryKey).name;
  }

  private handleAutoincrement(
    tableMap: TableMap<any>,
    columns: string[],
    values: any,
    tableSchema: TableSchema,
  ): string[] {
    const autoincrement = tableMap.columns.filter(
      ({ type }) => type === DbType.autoincrement,
    );
    const toGetFromDB = [];
    for (const { columnName } of autoincrement) {
      const index = columns.indexOf(columnName);

      if (values[index] == null) {
        toGetFromDB.push(...columns.splice(index, index + 1));
        values.splice(index, index + 1);
      }
    }

    for (const { name } of tableSchema.columns) {
      if (columns.includes(name)) continue;

      toGetFromDB.push(name);
    }

    return toGetFromDB;
  }

  private async saveRecursively(
    entity: Entity,
    savedObjects: Set<any>,
    repository: Repository,
  ): Promise<any> {
    const extra = this.getExtraField(entity);
    const tableMap = this.getTableMap(entity._orm_table_name);

    for (const column of tableMap.columns) {
      if (!isRelationshipField(column.type)) continue;

      const target = entity[column.fieldName];

      await SaveMapperFactory.get(column.type.type).save(
        column.type.with,
        target,
        extra,
        savedObjects,
        this,
        repository,
        this.dbSchema,
        this.tables,
        this.pm,
      );
    }
  }

  private getTableSchema(name: string): TableSchema {
    return this.dbSchema.find(({ name: tableName }) => tableName === name);
  }

  private getTableMap(name: string): TableMap<any> {
    return this.tables.get(name);
  }

  private existsInDB(entity: Entity): boolean {
    return this.identityMap.isLoaded(entity);
  }

  private getExtraField(entity: Entity): ExtraField {
    const key = this.getKey(this.getTableSchema(entity._orm_table_name));
    const inObject = TableSchemaHelpers.getNameInObject(
      key,
      this.getTableMap(entity._orm_table_name),
    );
    const value = entity[inObject];
    return {
      tableName: entity._orm_table_name,
      columnName: key,
      value,
    };
  }
}
