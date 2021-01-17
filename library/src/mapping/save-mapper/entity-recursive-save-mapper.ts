import { SaveMapper } from './abstract-save-mapper';
import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { Entity } from '../../common/models/entity';
import { ExtraField } from './models/extra-fields';
import { DBAction } from '../../common/models/db-action';
import { Repository } from '../../common/models/repository';
import { SaveMapperFactory } from './save-mapper-factory';
import { EntitySaveMapper } from './entity-save-mapper';
import {
  isRelationshipField,
  RelationshipFieldType,
} from '../../common/models/field-types';
import { ColumnMap } from '../../common/models/column-map';

export class EntityRecursiveSaveMapper
  extends EntitySaveMapper
  implements SaveMapper {
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
      const primaryKeys = this.toExtraFields(entity, keys);
      await this.saveRecursively(entity, primaryKeys, repository);
      return true;
    };
  }

  toExtraFields(entity: Entity, keys: { [key: string]: any }): ExtraField[] {
    const result: ExtraField[] = [];

    for (const key in keys) {
      result.push({
        tableName: entity._orm_table_name,
        columnName: key,
        value: keys[key],
      });
    }
    return result;
  }

  async saveRecursively(
    entity: Entity,
    keys: ExtraField[],
    repository: Repository,
  ): Promise<any> {
    const columnMaps: ColumnMap[] = this.getTableMap(entity._orm_table_name)
      .columns;

    const promises = [];

    for (let i = 0; i < columnMaps.length; i++) {
      if (isRelationshipField(columnMaps[i].type)) {
        const columnMapType = (columnMaps[i].type as RelationshipFieldType)
          .type;
        const promise = this.getStrategy(columnMapType).toAction(
          entity,
          keys,
        )(repository);
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  }
}
