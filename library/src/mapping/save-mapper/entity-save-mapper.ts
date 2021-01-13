import { AbstractSaveMapper, SaveMapper } from './abstract-save-mapper';
import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { Entity } from '../../common/models/entity';
import { ExtraField } from './models/extra-fields';
import { DBAction } from '../../common/models/db-action';
import { Repository } from '../../common/models/repository';
import { SaveMapperFactory } from './save-mapper-factory';

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
    // TODO:
    // 1. const tableMap = this.getTableMap(entity._orm_table_name);
    // 2. iterate over columns and return names of all primary key fields
    return [];
  }

  saveEntity(
    entity: Entity,
    foreignKeys: ExtraField[],
    repository: Repository,
    pkColumns: string[],
  ): Promise<any> {
    // TODO:
    // 0. prepare data for later
    // const tableScheme = this.getTableSchema(entity._orm_table_name);
    // const tableMap = this.getTableMap(entity._orm_table_name);
    // 1. check if entity is loaded form database: -> this.existsInDB()
    //    true:
    //      2. prepare for update query (pkColumns as 4. argument)
    //      3. call update on repository
    //    false
    //      2. prepare for insert query
    //      3. call insert on repository
    // 2. return result of update/insert method (repository)
    //  notes:
    //    * on this stage ignore all fields of type relationship
    //    * include foreignKeys into query: check if props from ExtraField match this from tableScheme.Column
    return;
  }

  handleMissingFields(entity: Entity, keys: { [key: string]: any }): void {
    // TODO:
    // 1. this.getTableSchema(entity._orm_table_name);
    // 2. for every part {key, value} from keys:
    //    - if table schema containing proper mapping (column name === key)
    //      -> update entity: fieldName = value
    //    - else
    //      -> insert new property: key = value
  }
}
