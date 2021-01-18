import { AbstractSaveMapper, SaveMapper } from './abstract-save-mapper';
import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { Entity } from '../../common/models/entity';
import { ExtraField } from './models/extra-fields';
import { DBAction } from '../../common/models/db-action';
import { Repository } from '../../common/models/repository';
import { SaveMapperFactory } from './save-mapper-factory';
import {
  Field,
  RelationshipFieldType,
  RelationshipType,
} from '../../common/models/field-types';
import { Relationship } from '../../main/models/relationships';

export class EntitySaveMapper extends AbstractSaveMapper implements SaveMapper {
  constructor(
    tables: Tables,
    dbSchema: TableSchema[],
    loadedObjects: Set<Entity>,
    saveFactory: SaveMapperFactory,
  ) {
    super(tables, dbSchema, loadedObjects, saveFactory);
  }

  toAction(entity: Entity, foreignKeys: ExtraField[] = []): DBAction {
    return async (repository: Repository) => {
      const pkColumns = this.getPrimaryKeyColumnNames(entity);
      const {
        rows: [keys],
      } = await this.saveEntity(entity, foreignKeys, repository, pkColumns);
      this.handleMissingFields(entity, keys);
      return true;
    };
  }

  getPrimaryKeyColumnNames(entity: Entity): string[] {
    const tableSchema = this.getTableSchema(entity._orm_table_name);
    const primaryKeyNames = tableSchema.columns
      .filter((column) => column.isPrimaryKey)
      .map((column) => column.name);
    return primaryKeyNames;
  }

  saveEntity(
    entity: Entity,
    foreignKeys: ExtraField[],
    repository: Repository,
    pkColumns: string[],
  ): Promise<any> {
    const tableSchema = this.getTableSchema(entity._orm_table_name);
    const tableMap = this.getTableMap(entity._orm_table_name);
    const exist = this.existsInDB(entity);
    const columns = tableMap.columns
      .map((column) => {
        const type = (column.type as Field) as RelationshipFieldType;
        if (type.type as RelationshipType) {
          return null;
        } else {
          return column.columnName;
        }
      })
      .filter((column) => column !== null);
    const data = tableMap.columns
      .map((column) => {
        const exist = columns.some((col) => {
          return col === column.columnName;
        });
        if (exist) {
          return entity[column.fieldName];
        } else {
          return null;
        }
      })
      .filter((column) => column !== null);
    if (foreignKeys) {
      const keys = [];
      foreignKeys.forEach((k) => {
        tableSchema.columns.forEach((col) => {
          if (col.foreignKey) {
            if (col.foreignKey.columnName === k.columnName) {
              keys.push({ colName: col.name, value: k.value });
            }
          } else return;
        });
      });
      keys.forEach((k) => {
        if (k) {
          columns.push(k.colName);
          data.push(k.value);
        }
      });
    }
    const pmExists = tableMap.columns.find((col) => col.isPrimaryKey);
    if (!pmExists) {
      const primaryKeyCol = tableSchema.columns.find((col) => col.isPrimaryKey);
      columns.unshift(primaryKeyCol.name);
      data.unshift(2);
    }
    if (exist) {
      return repository.update(
        tableMap.tableName,
        columns,
        data,
        `${pkColumns} = ${data[0]}`,
      );
    } else {
      return repository.insert(tableMap.tableName, columns, [data]);
    }
  }

  handleMissingFields(entity: Entity, keys: { [key: string]: any }): void {
    const schema = this.getTableMap(entity._orm_table_name);
    for (const [key, value] of Object.entries(keys)) {
      schema.columns.forEach(() => {
        entity[key] = value;
      });
    }
  }
}
