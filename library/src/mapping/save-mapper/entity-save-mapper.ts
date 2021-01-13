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
    return [];
  }

  saveEntity(
    entity: Entity,
    foreignKeys: ExtraField[],
    repository: Repository,
    pkColumns: string[],
  ): Promise<any> {
    return;
  }

  handleMissingFields(entity: Entity, keys: { [key: string]: any }): void {
    return;
  }
}
