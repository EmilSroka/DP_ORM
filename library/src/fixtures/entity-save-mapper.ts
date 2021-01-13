import { TableMap } from '../common/models/table-map';
import { JsType, RelationshipType } from '../common/models/field-types';
import { Column, TableSchema } from '../common/models/database-schema';
import { Condition } from '../database/postgresql/model/condition';
import { ExtraField } from '../mapping/save-mapper/models/extra-fields';
import { deepCopy } from '../utils/copy';

type InsertInput = [string, string[], any[][], string[]];
type UpdateInput = [string, string[], any[], Condition];

export const simpleEntityInsertFixture: InsertInput = [
  'simpleEntity',
  ['id', 'sfs', 'sfi', 'sfd'],
  [[1, '', 12, true]],
  ['id'],
];

export const simpleEntityUpdateFixture: [string, string[], any[], Condition] = [
  'simpleEntity',
  ['id', 'sfs', 'sfi', 'sfd'],
  [1, '', 12, true],
  { toString: () => 'id = 1' },
];

export const simpleEntityFixture = {
  id: 1,
  simpleFieldString: '',
  simpleFieldInt: 12,
  simpleFieldBoolean: true,
  _orm_table_name: 'simpleEntity',
};

export const simpleEntityMapFixture: TableMap = {
  tableName: 'simpleEntity',
  constructor: () => null,
  columns: [
    {
      fieldName: 'id',
      columnName: 'id',
      isPrimaryKey: true,
      type: JsType.number,
      isNullable: false,
      isUnique: true,
    },
    {
      fieldName: 'simpleFieldString',
      columnName: 'sfs',
      isPrimaryKey: false,
      type: JsType.string,
      isNullable: true,
      isUnique: false,
    },
    {
      fieldName: 'simpleFieldInt',
      columnName: 'sfi',
      isPrimaryKey: false,
      type: JsType.number,
      isNullable: true,
      isUnique: false,
    },
    {
      fieldName: 'simpleFieldBoolean',
      columnName: 'sfb',
      isPrimaryKey: false,
      type: JsType.boolean,
      isNullable: true,
      isUnique: false,
    },
  ],
};

export const simpleEntityTableFixture: TableSchema = {
  name: 'simpleEntity',
  columns: [
    {
      name: 'id',
      type: JsType.number,
      isNullable: false,
      isUnique: true,
      isPrimaryKey: true,
    },
    {
      name: 'sfs',
      type: JsType.string,
      isNullable: true,
      isUnique: false,
      isPrimaryKey: false,
    },
    {
      name: 'sfi',
      type: JsType.number,
      isNullable: true,
      isUnique: false,
      isPrimaryKey: false,
    },
    {
      name: 'sfb',
      type: JsType.boolean,
      isNullable: true,
      isUnique: false,
      isPrimaryKey: false,
    },
  ],
};

/* ********************************************************************************************** */

export const entityWithRelationsInsertFixture: InsertInput = [
  'entityWithRelations',
  ['id', 'sf'],
  [[3, 'zxc']],
  ['id'],
];

export const entityWithRelationsUpdateFixture: [
  string,
  string[],
  any[],
  Condition,
] = ['entityWithoutKey', ['id', 'sf'], [3, true], { toString: () => 'id = 3' }];

export const entityWithRelationsFixture = {
  id: 3,
  simpleField: 'zxc',
  otherObjectsMany: [{}, {}],
  otherObject: {},
  otherObjects: [{}, {}],
  _orm_table_name: 'entityWithRelations',
};

export const entityWithRelationsMapFixture: TableMap = {
  tableName: 'entityWithRelations',
  constructor: () => null,
  columns: [
    {
      fieldName: 'id',
      columnName: 'id',
      isPrimaryKey: true,
      type: JsType.number,
      isNullable: false,
      isUnique: true,
    },
    {
      fieldName: 'simpleField',
      columnName: 'sf',
      isPrimaryKey: false,
      type: JsType.string,
      isNullable: true,
      isUnique: false,
    },
    {
      fieldName: 'otherObjectsMany',
      columnName: 'mtm',
      isPrimaryKey: false,
      type: {
        type: RelationshipType.manyToMany,
        with: 'someTable1',
      },
      isNullable: true,
      isUnique: false,
    },
    {
      fieldName: 'otherObject',
      columnName: 'oto',
      isPrimaryKey: false,
      type: {
        type: RelationshipType.oneToOne,
        with: 'someTable2',
      },
      isNullable: true,
      isUnique: false,
    },
    {
      fieldName: 'otherObjects',
      columnName: 'otm',
      isPrimaryKey: false,
      type: {
        type: RelationshipType.manyToMany,
        with: 'someTable3',
      },
      isNullable: true,
      isUnique: false,
    },
  ],
};

export const entityWithRelationsTableFixture: TableSchema = {
  name: 'simpleEntity',
  columns: [
    {
      name: 'id',
      type: JsType.number,
      isNullable: false,
      isUnique: true,
      isPrimaryKey: true,
    },
    {
      name: 'sf',
      type: JsType.string,
      isNullable: true,
      isUnique: false,
      isPrimaryKey: false,
    },
  ],
};

/* ********************************************************************************************** */

export const entityWithoutKeyInsertFixture: InsertInput = [
  'entityWithoutKey',
  ['sf'],
  [[true]],
  ['id1'],
];

export const entityWithoutKeyUpdateFixture: [
  string,
  string[],
  any[],
  Condition,
] = [
  'entityWithoutKey',
  ['id1', 'sf'],
  [2, true],
  { toString: () => 'id1 = 2' },
];

export const entityWithoutKeyFixture = {
  simpleField: true,
  _orm_table_name: 'entityWithoutKey',
};

export const entityWithoutKeyFilledFixture = {
  id1: 2,
  simpleField: true,
  _orm_table_name: 'entityWithoutKey',
};

export const entityWithoutKeyMapFixture: TableMap = {
  tableName: 'entityWithoutKey',
  constructor: () => null,
  columns: [
    {
      fieldName: 'simpleField',
      columnName: 'sf',
      isPrimaryKey: false,
      type: JsType.boolean,
      isNullable: true,
      isUnique: false,
    },
  ],
};

export const entityWithoutKeyTableFixture: TableSchema = {
  name: 'entityWithoutKey',
  columns: [
    {
      name: 'id1',
      type: JsType.number,
      isNullable: false,
      isUnique: true,
      isPrimaryKey: true,
    },
    {
      name: 'sf',
      type: JsType.number,
      isNullable: true,
      isUnique: false,
      isPrimaryKey: false,
    },
  ],
};

/* ********************************************************************************************** */

export const entityForeignKeyInsertFixture: InsertInput = [
  'entityForeignKey',
  ['key', 'foreign'],
  [[4, 5]],
  ['key'],
];

export const entityForeignKeyUpdateFixture: [
  string,
  string[],
  any[],
  Condition,
] = [
  'entityForeignKey',
  ['key', 'foreign'],
  [4, 5],
  { toString: () => 'key = 4' },
];

export const entityForeignKeyFixture = {
  id: 4,
  _orm_table_name: 'entityForeignKey',
};

export const entityForeignKeyMapFixture: TableMap = {
  tableName: 'entityForeignKey',
  constructor: () => null,
  columns: [
    {
      fieldName: 'id',
      columnName: 'key',
      isPrimaryKey: true,
      type: JsType.number,
      isNullable: false,
      isUnique: true,
    },
  ],
};

const foreignKey = {
  tableName: 'other',
  columnName: 'id',
  value: 5,
};

export const entityForeignKeyTableFixture: TableSchema = {
  name: 'entityForeignKey',
  columns: [
    {
      name: 'key',
      type: JsType.number,
      isNullable: false,
      isUnique: true,
      isPrimaryKey: true,
    },
    {
      name: 'foreign',
      type: JsType.number,
      isNullable: false,
      isUnique: true,
      isPrimaryKey: false,
      foreignKey: {
        tableName: foreignKey.tableName,
        columnName: foreignKey.columnName,
      },
    },
  ],
};

/* ********************************************************************************************** */

export const entitySaveFixtures = [
  'simple object',
  'object that contains others',
  'object without key',
  'table that has foreign key',
];

export const getPrimaryKeysFixture: [any, TableSchema, string[]][] = [
  [simpleEntityFixture, simpleEntityTableFixture, ['id']],
  [entityWithRelationsFixture, entityWithRelationsTableFixture, ['id']],
  [entityWithoutKeyFixture, entityWithoutKeyTableFixture, ['id1']],
  [entityForeignKeyFixture, entityForeignKeyTableFixture, ['key']],
  [
    { _orm_table_name: 'ttt' },
    {
      name: 'ttt',
      columns: [
        { name: '123', isPrimaryKey: true } as Column,
        { name: '456', isPrimaryKey: true } as Column,
        { name: '789', isPrimaryKey: false } as Column,
      ],
    },
    ['123', '456'],
  ],
];

export const entitySaveInsertCases: {
  [key: string]: [
    any,
    InsertInput,
    TableMap,
    TableSchema,
    ExtraField[],
    string[],
  ];
} = {
  'simple object': [
    simpleEntityFixture,
    simpleEntityInsertFixture,
    simpleEntityMapFixture,
    simpleEntityTableFixture,
    [],
    ['id'],
  ],
  'object that contains others': [
    entityWithRelationsFixture,
    entityWithRelationsInsertFixture,
    entityWithRelationsMapFixture,
    entityWithRelationsTableFixture,
    [],
    ['id'],
  ],
  'object without key': [
    entityWithoutKeyFixture,
    entityWithoutKeyInsertFixture,
    entityWithoutKeyMapFixture,
    entityWithoutKeyTableFixture,
    [],
    ['id1'],
  ],
  'table that has foreign key': [
    entityForeignKeyFixture,
    entityForeignKeyInsertFixture,
    entityForeignKeyMapFixture,
    entityForeignKeyTableFixture,
    [foreignKey],
    ['key'],
  ],
};

export const entitySaveUpdateCases: {
  [key: string]: [
    any,
    UpdateInput,
    TableMap,
    TableSchema,
    ExtraField[],
    string[],
  ];
} = {
  'simple object': [
    simpleEntityFixture,
    simpleEntityUpdateFixture,
    simpleEntityMapFixture,
    simpleEntityTableFixture,
    [],
    ['id'],
  ],
  'object that contains others': [
    entityWithRelationsFixture,
    entityWithRelationsUpdateFixture,
    entityWithRelationsMapFixture,
    entityWithRelationsTableFixture,
    [],
    ['id'],
  ],
  'object without key': [
    entityWithoutKeyFilledFixture,
    entityWithoutKeyUpdateFixture,
    entityWithoutKeyMapFixture,
    entityWithoutKeyTableFixture,
    [],
    ['id1'],
  ],
  'table that has foreign key': [
    entityForeignKeyFixture,
    entityForeignKeyUpdateFixture,
    entityForeignKeyMapFixture,
    entityForeignKeyTableFixture,
    [foreignKey],
    ['key'],
  ],
};

export const missingFieldsCases = [
  'update existing values',
  'insert non-existing values',
];
export const missingFieldsFixture: {
  [key: string]: [any, TableMap, { [key: string]: any }, any];
} = {
  'update existing values': [
    simpleEntityFixture,
    simpleEntityMapFixture,
    { id: 2 },
    { ...deepCopy(simpleEntityFixture), id: 2 },
  ],
  'insert non-existing values': [
    entityWithoutKeyFixture,
    entityWithoutKeyMapFixture,
    { id1: 5 },
    { ...deepCopy(entityWithoutKeyFixture), id1: 5 },
  ],
};

export const recursiveStrategyFixture = {
  entity: entityWithRelationsFixture,
  keys: [
    {
      tableName: '',
      columnName: 'id',
      value: 3,
    },
  ],
  relationships: [
    [RelationshipType.oneToOne, entityWithRelationsFixture.otherObject],
    [RelationshipType.oneToMany, entityWithRelationsFixture.otherObjects],
    [RelationshipType.manyToMany, entityWithRelationsFixture.otherObjectsMany],
  ],
};
