import { SaveStrategy } from './models/save-strategy';
import { Entity } from '../../common/models/entity';
import { EntitySave } from './entity-save';
import { ExtraField } from './models/extra-fields';
import { Repository } from '../../common/models/repository';
import { Equal, Field } from '../../database/postgresql/database/condition';
import { TableSchemaHelpers } from '../../utils/mapping';
import { TableSchema } from '../../common/models/database-schema';

export class OneToOneSaveStrategy implements SaveStrategy {
  async save(
    tableName: string,
    target: Entity,
    foreignKey: ExtraField,
    savedObjects: Set<any>,
    entitySave: EntitySave,
    repository: Repository,
    dbSchema: TableSchema[],
  ): Promise<any> {
    const table = dbSchema.find(({ name }) => name === target._orm_table_name);
    const name = TableSchemaHelpers.getCorrespondedName(
      foreignKey.columnName,
      foreignKey.tableName,
      table,
    );
    await repository.delete(
      target._orm_table_name,
      new Equal(new Field(name), foreignKey.value),
    );

    await entitySave.toAction(target, savedObjects, foreignKey)(repository);

    target[name] = foreignKey.value;
  }
}
