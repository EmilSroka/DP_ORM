import { DbFieldTypes, JsFieldTypes } from '../../common/models/field-types';

export interface AttributeConfiguration {
  type: JsFieldTypes | DbFieldTypes;
  columnName?: string;
  isNullable?: boolean;
  isUnique?: boolean;
}
