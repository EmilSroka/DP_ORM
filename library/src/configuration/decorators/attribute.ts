import { AttributeConfiguration } from '../models/attribute-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { ColumnMap } from '../../common/models/column-map';

export function Attribute(tables: Tables, settings: AttributeConfiguration) {
  return function (target: any, key: string | symbol) {
    const cb = (
      tableName: string,
      validation: { havePK: boolean; columnNames: string[] },
    ) => {
      const tableMap = tables.get(tableName);
      if (settings.columnName)
        settings.columnName = settings.columnName.toLowerCase();

      const columnMap: ColumnMap = {
        ...getDefaultSettings(key.toString()),
        ...settings,
      };

      if (validation.columnNames.includes(columnMap.columnName))
        throw new Error(
          'ORM: Column of given name already exists (names ar case insensitive)',
        );

      tableMap.columns.push(columnMap);
      validation.columnNames.push(columnMap.columnName);
    };

    if (!target._orm_attributes) {
      target._orm_attributes = [];
    }
    target._orm_attributes.push(cb);
  };

  function getDefaultSettings(fieldName: string) {
    return {
      fieldName: fieldName,
      columnName: fieldName.toLowerCase(),
      isPrimaryKey: false,
      isNullable: true,
      isUnique: false,
    };
  }
}

export type AttributeDecorator = (
  settings: AttributeConfiguration,
) => (target: any, key: string | symbol) => undefined;
