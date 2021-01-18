import { DbFieldTypes, JsFieldTypes } from '../../common/models/field-types';

export type PrimaryKeyConfiguration = {
  type: JsFieldTypes | DbFieldTypes;
  columnName?: string;
};
