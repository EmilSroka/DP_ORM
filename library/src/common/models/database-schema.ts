import { DbFieldTypes, JsFieldTypes } from './field-types';

type ColumnType = JsFieldTypes | DbFieldTypes;

export interface Column {
  name: string;
  type: ColumnType;
  isNullable: boolean;
  isUnique: boolean;
  isPrimaryKey: boolean;
  foreignKey?: {
    tableName: string;
    columnName: string;
  };
}

export interface TableSchema {
  name: string;
  columns: Column[];
}
