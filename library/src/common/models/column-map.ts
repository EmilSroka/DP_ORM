import { Field } from './field-types';

export interface ColumnMap {
  fieldName: string;
  columnName: string;
  isPrimaryKey: boolean;
  type: Field;
  isNullable: boolean;
  isUnique: boolean;
}
