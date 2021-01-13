import { TableSchema } from '../../common/models/database-schema';
import { RelationshipType } from '../../common/models/field-types';
import { Tables } from '../../main/metadata-containers/tables';
import { Entity } from '../../common/models/entity';
import { EntitySaveMapper } from './entity-save-mapper';

export type SaveMapperStrategy = RelationshipType | 'entity';

export class SaveMapperFactory {
  private entityStrategy: EntitySaveMapper;

  constructor(
    private tables: Tables,
    private dbSchema: TableSchema[],
    private loadedObjects: Set<Entity>,
  ) {}

  get(strategy: SaveMapperStrategy) {
    switch (strategy) {
      case 'entity':
      case RelationshipType.oneToOne:
        if (this.entityStrategy == null)
          this.entityStrategy = new EntitySaveMapper(
            this.tables,
            this.dbSchema,
            this.loadedObjects,
            this,
          );
        return this.entityStrategy;
    }
  }
}
