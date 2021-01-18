import { TableSchema } from '../common/models/database-schema';

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
}
