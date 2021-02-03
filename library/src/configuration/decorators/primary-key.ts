import { Tables } from '../../main/metadata-containers/tables';
import { ColumnMap } from '../../common/models/column-map';
import { PrimaryKeyConfiguration } from '../models/primary-key-configuration';

export function PrimaryKey(tables: Tables, settings: PrimaryKeyConfiguration) {
  return function (target: any, key: string | symbol) {
    const cb = (
      tableName: string,
      validation: { havePK: boolean; columnNames: string[] },
    ) => {
      const tableMap = tables.get(tableName);

      const columnMap: ColumnMap = getDefaultSettings(key.toString());
      columnMap.type = settings.type;
      if (settings.columnName)
        columnMap.columnName = settings.columnName.toLowerCase();

      if (validation.columnNames.includes(columnMap.columnName))
        throw new Error(
          'ORM: Column of given name already exists (names ar case insensitive)',
        );

      if (columnMap.isPrimaryKey && validation.havePK)
        throw new Error(
          'ORM: Column with key already exists (entity can have only one primary key)',
        );

      tableMap.columns.push(columnMap);
      validation.columnNames.push(columnMap.columnName);
    };

    if (!target._orm_attributes) {
      target._orm_attributes = [];
    }
    target._orm_attributes.push(cb);
  };

  function getDefaultSettings(fieldName: string): ColumnMap {
    return {
      type: undefined,
      fieldName: fieldName,
      columnName: fieldName.toLowerCase(),
      isPrimaryKey: true,
      isNullable: false,
      isUnique: true,
    };
  }
}

export type PrimaryKeyDecorator = (
  settings: PrimaryKeyConfiguration,
) => (target: any, key: string | symbol) => undefined;
