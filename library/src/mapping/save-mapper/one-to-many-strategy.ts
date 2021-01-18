import { SaveStrategy } from './models/save-strategy';
import { Entity } from '../../common/models/entity';
import { EntitySave } from './entity-save';
import { ExtraField } from './models/extra-fields';
import { Repository } from '../../common/models/repository';
import { TableSchema } from '../../common/models/database-schema';
import { Tables } from '../../main/metadata-containers/tables';
import { PersistenceManager } from '../../main/persistence-manager';
import { TableSchemaHelpers } from '../../utils/mapping';
import { Equal, Field } from '../../database/postgresql/database/condition';

export class OneToManySaveStrategy implements SaveStrategy {
  async save(
    tableName: string,
    target: Entity[],
    foreignKey: ExtraField,
    savedObjects: Set<any>,
    entitySave: EntitySave,
    repository: Repository,
    dbSchema: TableSchema[],
    tables: Tables,
    persistenceManager: PersistenceManager,
  ): Promise<any> {
    const table = dbSchema.find(({ name }) => name === tableName);
    const name = TableSchemaHelpers.getCorrespondedName(
      foreignKey.columnName,
      foreignKey.tableName,
      table,
    );

    const [, key] = TableSchemaHelpers.getKeyNames(
      tables.get(tableName),
      table,
    );

    const currents = await persistenceManager.internal_select<any>(
      tableName,
      new Equal(new Field(name), foreignKey.value),
    );

    const promises = [];
    for (const entity of target) {
      promises.push(
        entitySave.toAction(entity, savedObjects, foreignKey)(repository),
      );
      entity[name] = foreignKey.value;
    }
    for (const cur of currents) {
      if (target.some((s) => s[key] === cur[key])) continue;

      cur[name] = null;
      promises.push(
        entitySave.toAction(cur, savedObjects, { ...foreignKey, value: null })(
          repository,
        ),
      );
    }
    await Promise.all(promises);
  }
}
