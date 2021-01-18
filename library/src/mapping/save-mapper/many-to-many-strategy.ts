import { SaveStrategy } from './models/save-strategy';
import { Entity } from '../../common/models/entity';
import { EntitySave } from './entity-save';
import { ExtraField } from './models/extra-fields';
import { Repository } from '../../common/models/repository';
import { TableSchemaHelpers } from '../../utils/mapping';
import { TableSchema } from '../../common/models/database-schema';
import { Tables } from '../../main/metadata-containers/tables';
import {
  And,
  Equal,
  Field,
  NotIn,
} from '../../database/postgresql/database/condition';

export class ManyToManySaveStrategy implements SaveStrategy {
  async save(
    tableName: string,
    target: Entity[],
    foreignKey: ExtraField,
    savedObjects: Set<any>,
    entitySave: EntitySave,
    repository: Repository,
    dbSchema: TableSchema[],
    tables: Tables,
  ): Promise<any> {
    if (target.length === 0) return;

    const linkTable = TableSchemaHelpers.getLinkTable(
      foreignKey.tableName,
      target[0]._orm_table_name,
      dbSchema,
    );

    const schema = dbSchema.find(
      ({ name }) => name === target[0]._orm_table_name,
    );

    const key = TableSchemaHelpers.getCorrespondedName(
      foreignKey.columnName,
      foreignKey.tableName,
      linkTable,
    );

    const [inTable, inObject] = TableSchemaHelpers.getKeyNames(
      tables.get(target[0]._orm_table_name),
      schema,
    );

    const key2 = TableSchemaHelpers.getCorrespondedName(
      inTable,
      target[0]._orm_table_name,
      linkTable,
    );

    for (const entity of target) {
      if (savedObjects.has(entity)) {
        const val = entity[inObject];
        await repository.delete(
          linkTable.name,
          new And(
            new Equal(new Field(key), foreignKey.value),
            new Equal(new Field(key2), val),
          ),
        );

        await repository.insert(
          linkTable.name,
          [key, key2],
          [[foreignKey.value, val]],
          [],
        );
      } else {
        await entitySave.toAction(entity, savedObjects)(repository);
      }
    }

    const key2values = target.map((obj) => obj[inObject]);

    await repository.delete(
      linkTable.name,
      new And(
        new Equal(new Field(key), foreignKey.value),
        new NotIn(new Field(key2), key2values),
      ),
    );
  }
}
