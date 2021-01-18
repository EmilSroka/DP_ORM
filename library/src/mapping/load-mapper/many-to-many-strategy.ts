import { LoadStrategy } from './models/load-strategy';
import { isRelationshipField } from '../../common/models/field-types';
import { TableSchemaHelpers } from '../../utils/mapping';
import { Equal, Field } from '../../database/postgresql/database/condition';
import { ColumnMap } from '../../common/models/column-map';
import { EntityLoader } from './entity-loader';
import { TableSchema } from '../../common/models/database-schema';

export class ManyToManyStrategy implements LoadStrategy {
  async load(
    field: ColumnMap,
    tableName: string,
    [keyName, keyValue]: [string, any],
    loader: EntityLoader,
    repository: any,
    dbSchema: TableSchema[],
  ): Promise<any> {
    if (!isRelationshipField(field.type)) return;

    const linkTable = TableSchemaHelpers.getLinkTable(
      tableName,
      field.type.with,
      dbSchema,
    );
    const foreign = TableSchemaHelpers.getCorrespondedName(
      keyName,
      tableName,
      linkTable,
    );
    const { rows: results } = await repository.select(
      linkTable.name,
      ['*'],
      new Equal(new Field(foreign), keyValue),
    );
    const name = linkTable.columns.filter(
      ({ name }) => name != '_dp_orm_primary_key' && name != foreign,
    )[0].foreignKey.columnName;
    const promises = [];
    for (const result of results) {
      promises.push(
        loader.toAction(
          field.type.with,
          new Equal(new Field(name), result[name]),
        )(repository),
      );
    }
    return (await Promise.all(promises)).flat(1);
  }
}
