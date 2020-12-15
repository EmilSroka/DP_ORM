import { Field } from '../../common/models/field-types';

export interface AttributeConfiguration {
  type: Field;
  columnName?: string;
  isPrimaryKey?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
}
