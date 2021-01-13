import { Tables } from '../../main/metadata-containers/tables';
import { TableSchema } from '../../common/models/database-schema';
import { Entity } from '../../common/models/entity';
import { SaveMapperFactory, SaveMapperStrategy } from './save-mapper-factory';
import { DBAction } from '../../common/models/db-action';
import { ExtraField } from './models/extra-fields';
import { TableMap } from '../../common/models/table-map';

export type SaveMapper = {
  toAction: (entity: Entity | Entity[], foreignKeys: ExtraField[]) => DBAction;
};

export abstract class AbstractSaveMapper {
  protected constructor(
    private tables: Tables,
    private dbSchema: TableSchema[],
    protected loadedObjects: Set<Entity>,
    protected saveFactory: SaveMapperFactory,
  ) {}

  protected getTableSchema(name: string): TableSchema {
    return this.dbSchema.find(({ name: tableName }) => tableName === name);
  }

  protected getTableMap(name: string): TableMap {
    return this.tables.get(name);
  }

  protected existsInDB(entity: Entity): boolean {
    return this.loadedObjects.has(entity);
  }

  protected getStrategy(strategy: SaveMapperStrategy): SaveMapper {
    return this.saveFactory.get(strategy);
  }
}
