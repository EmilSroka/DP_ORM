import { Column, TableSchema } from '../common/models/database-schema';
import { DbType, JsType } from '../common/models/field-types';
import { Condition } from '../database/postgresql/model/condition';

type insertQueryInput = [string, string[], Condition];

export const insertPromiseValue = 'asdwefjnsakh';

export const tableNameBasicInput = 'users';
export const fieldsBasicInput = ['name', 'email'];
export const valuesBasicInput = [['brianc', 'brian.m.carlson@gmail.com']];
export const basicOutput = {
  text: /INSERT INTO users ?\(name, ?email\) VALUES\(\$1, ?\$2\)/,
  values: ['brianc', 'brian.m.carlson@gmail.com'],
};

export const tableNameMultiInput = 'czekoladki';
export const fieldsMultiInput = [
  'idczekoladki',
  'nazwa',
  'czekolada',
  'opis',
  'koszt',
  'masa',
];
export const valuesMultiInput = [
  [
    'X91',
    'Nieznana Nieznajoma',
    null,
    'Niewidzialna czekoladka wspomagajaca odchudzanie.',
    0.26,
    0,
  ],
  [
    'M99',
    'Mleczny Raj',
    'mleczna',
    'Aksamitna mleczna czekolada w ksztalcie butelki z mlekiem.',
    0.26,
    36,
  ],
  [
    'M98',
    'Mleczny Raj',
    'mleczna',
    'Aksamitna mleczna czekolada w ksztalcie butelki z mlekiem.',
    0.26,
    36,
  ],
];
export const multiOutput = {
  text: /INSERT INTO czekoladki ?\(idczekoladki, ?nazwa, ?czekolada, ?opis, ?koszt, ?masa\) VALUES\(\$1, ?\$2, ?\$3, ?\$4, ?\$5, ?\$6\), \(\$7, ?\$8, ?\$9, ?\$10, ?\$11, ?\$12\), \(\$13, ?\$14, ?\$15, ?\$16, ?\$17, ?\$18\)/,
  values: [
    'X91',
    'Nieznana Nieznajoma',
    null,
    'Niewidzialna czekoladka wspomagajaca odchudzanie.',
    0.26,
    0,
    'M99',
    'Mleczny Raj',
    'mleczna',
    'Aksamitna mleczna czekolada w ksztalcie butelki z mlekiem.',
    0.26,
    36,
    'M98',
    'Mleczny Raj',
    'mleczna',
    'Aksamitna mleczna czekolada w ksztalcie butelki z mlekiem.',
    0.26,
    36,
  ],
};

export const TableSchemaFixture: TableSchema = {
  name: 'testName',
  columns: [
    {
      type: JsType.string,
    } as Column,
    {
      type: JsType.number,
    } as Column,
    {
      type: JsType.boolean,
    } as Column,
    {
      type: DbType.autoincrement,
    } as Column,
    {
      type: DbType.date,
    } as Column,
  ],
};

export const selectQueryInputFixture: insertQueryInput = [
  'table_Name',
  ['c1', 'c2', 'c3', 'cxD'],
  { toString: () => '1 AND 2' },
];

export const selectQueryOutputFuture =
  'SELECT c1, c2, c3, cxD FROM table_Name WHERE 1 AND 2;';
