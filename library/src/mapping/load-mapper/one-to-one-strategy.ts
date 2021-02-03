import { TableSchema } from '../../common/models/database-schema';
import { isRelationshipField } from '../../common/models/field-types';
import { TableSchemaHelpers } from '../../utils/mapping';
import { Equal, Field } from '../../database/postgresql/database/condition';
import { ColumnMap } from '../../common/models/column-map';
import { EntityLoader } from './entity-loader';
import { LoadStrategy } from './models/load-strategy';

export class OneToOneStrategy implements LoadStrategy {
  async load(
    field: ColumnMap,
    tableName: string,
    [keyName, keyValue]: [string, any],
    loader: EntityLoader,
    repository: any,
    dbSchema: TableSchema[],
  ): Promise<any> {
    if (!isRelationshipField(field.type)) return;
    const withColumn = field.type.with;

    const column = TableSchemaHelpers.getCorrespondedName(
      keyName,
      tableName,
      dbSchema.find(({ name }) => name === withColumn),
    );

    return await loader
      .toAction(
        field.type.with,
        new Equal(new Field(column), keyValue),
      )(repository)
      .then(([result]) => result);
  }
}
