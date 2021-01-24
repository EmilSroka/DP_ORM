import { TableSchema } from '../common/models/database-schema';
import { TableMap } from '../common/models/table-map';

export class TableSchemaHelpers {
  static getCorrespondedName(
    columnName: string,
    tableName: string,
    target: TableSchema,
  ): string {
    for (const column of target.columns) {
      if (
        column.foreignKey &&
        column.foreignKey.columnName === columnName &&
        column.foreignKey.tableName === tableName
      ) {
        return column.name;
      }
    }
    return '';
  }

  static getLinkTable(
    tableName: string,
    otherTableName: string,
    tables: TableSchema[],
  ): TableSchema {
    return tables.find(
      ({ name }) =>
        name === `${tableName}_${otherTableName}` ||
        name === `${otherTableName}_${tableName}`,
    );
  }

  static getNameInObject(columnName: string, map: TableMap<any>): string {
    const column = map.columns.find(({ columnName: cn }) => cn === columnName);
    if (column == null) return columnName;

    return column.fieldName;
  }

  static getKeyNames(
    map: TableMap<any>,
    schema: TableSchema,
  ): [string, string] {
    const inDb = schema.columns.find(({ isPrimaryKey }) => isPrimaryKey).name;
    return [inDb, TableSchemaHelpers.getNameInObject(inDb, map)];
  }
}
