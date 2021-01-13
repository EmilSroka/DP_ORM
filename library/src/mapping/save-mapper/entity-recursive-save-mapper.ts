import { SaveMapper } from './abstract-save-mapper';
import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { Entity } from '../../common/models/entity';
import { ExtraField } from './models/extra-fields';
import { DBAction } from '../../common/models/db-action';
import { Repository } from '../../common/models/repository';
import { SaveMapperFactory } from './save-mapper-factory';
import { EntitySaveMapper } from './entity-save-mapper';

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
    // TODO:
    // iterate over keys
    // for every create ExtraField -> (key, value) pair:
    // - tableName: entity._orm_table_name;
    // - columnName: keys.key;
    // - value: keys.value;
    return [];
  }

  async saveRecursively(
    entity: Entity,
    keys: ExtraField[],
    repository: Repository,
  ): Promise<any> {
    // TODO:
    // iterate over TableMap -> this.getTableMap(entity._orm_table_name);
    // if field is relationship -> isRelationshipField( ColumnMap.type )
    // get proper strategy passing relationship type to factory, get action and await for result, something like this:
    // await this.getStrategy(<pass type here>).toAction(<pass object here>, keys)(repository);
    return true;
  }
}
