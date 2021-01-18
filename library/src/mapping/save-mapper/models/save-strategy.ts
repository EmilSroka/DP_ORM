import { Entity } from '../../../common/models/entity';
import { ExtraField } from './extra-fields';
import { EntitySave } from '../entity-save';
import { Repository } from '../../../common/models/repository';
import { TableSchema } from '../../../common/models/database-schema';
import { Tables } from '../../../main/metadata-containers/tables';
import { PersistenceManager } from '../../../main/persistence-manager';

export type SaveStrategy = {
  save: (
    tableName: string,
    target: Entity | Entity[],
    foreignKey: ExtraField,
    savedObjects: Set<any>,
    entitySave: EntitySave,
    repository: Repository,
    dbSchema: TableSchema[],
    tables: Tables,
    persistenceManager: PersistenceManager,
  ) => any;
};
