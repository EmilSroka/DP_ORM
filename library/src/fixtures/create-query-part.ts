import { NumericType } from '../database/postgresql/model/configuration';
import { Column } from '../common/models/database-schema';
import { DbType, JsType } from '../common/models/field-types';
import {
  AutoincrementCreateQueryPart,
  BooleanCreateQueryPart,
  DateCreateQueryPart,
  NumberCreateQueryPart,
  StringCreateQueryPart,
} from '../database/postgresql/database/create-query-part';

export const createSettingsBaseFixture = {
  number: { type: 'float' as NumericType, precision: 53 },
  stringMaxSize: 512,
};

export const createSettingsOutputsFixture = [
  'boolean',
  `float(${createSettingsBaseFixture.number.precision})`,
  `char(${createSettingsBaseFixture.stringMaxSize})`,
  'date',
  'serial',
];

export const createSettingsCustomFixture = {
  number: { type: 'numeric' as NumericType, precision: 20, scale: 5 },
  stringMaxSize: 30,
};

export const createSettingsCustomOutputsFixture = [
  'boolean',
  `numeric(${createSettingsCustomFixture.number.precision},${createSettingsCustomFixture.number.scale})`,
  `char(${createSettingsCustomFixture.stringMaxSize})`,
  'date',
  'serial',
];

export const queryBaseInputFixture: Column = {
  isNullable: true,
  isPrimaryKey: true,
  isUnique: false,
  name: 'testName1',
  type: undefined,
};

export const queryBaseOutputFixture = {
  columnName: 'testName1',
  parts: [' PRIMARY KEY ?', ' type ?'],
};

export const queryForeignKeyInputFixture: Column = {
  isNullable: false,
  isPrimaryKey: false,
  isUnique: true,
  name: 'testName2',
  type: undefined,
  foreignKey: {
    tableName: 'table_name',
    columnName: 'column_name',
  },
};

export const queryForeignKeyOutputFixture = {
  columnName: 'testName2',
  parts: [
    ' NOT NULL ?',
    ' UNIQUE ?',
    ' type ?',
    ' REFERENCES table_name\\(column_name\\) ?',
  ],
};

export const factoryFixture: Array<[Column, any]> = [
  [{ type: JsType.boolean } as Column, BooleanCreateQueryPart],
  [{ type: JsType.number } as Column, NumberCreateQueryPart],
  [{ type: JsType.string } as Column, StringCreateQueryPart],
  [{ type: DbType.date } as Column, DateCreateQueryPart],
  [{ type: DbType.autoincrement } as Column, AutoincrementCreateQueryPart],
];
