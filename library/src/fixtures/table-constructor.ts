import { JsType, RelationshipType } from '../common/models/field-types';
import { TableMap } from '../common/models/table-map';

export const tablesFixtures: {
  [key: string]: TableMap;
} = {
  clients: {
    tableName: 'clients',
    constructor: () => null,
    columns: [
      {
        fieldName: 'id',
        columnName: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        fieldName: 'name',
        columnName: 'name',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        fieldName: 'orders',
        columnName: 'orders',
        type: {
          type: RelationshipType.oneToMany,
          with: 'orders',
        },
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  orders: {
    tableName: 'orders',
    constructor: () => null,
    columns: [
      {
        fieldName: 'price',
        columnName: 'priceColumn',
        type: JsType.number,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: false,
      },
    ],
  },
  receivers: {
    tableName: 'receivers',
    constructor: () => null,
    columns: [
      {
        fieldName: 'id',
        columnName: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        fieldName: 'name',
        columnName: 'name',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        fieldName: 'orders',
        columnName: 'orders',
        type: {
          type: RelationshipType.oneToMany,
          with: 'orders',
        },
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  compositions: {
    tableName: 'compositions',
    constructor: () => null,
    columns: [
      {
        fieldName: 'id',
        columnName: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        fieldName: 'orders',
        columnName: 'orders',
        type: {
          type: RelationshipType.oneToMany,
          with: 'orders',
        },
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        fieldName: 'details',
        columnName: 'details',
        type: {
          type: RelationshipType.oneToOne,
          with: 'compositionDetails',
        },
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        fieldName: 'creators',
        columnName: 'creators',
        type: {
          type: RelationshipType.manyToMany,
          with: 'compositionCreators',
        },
        isPrimaryKey: false,
        isNullable: false,
        isUnique: false,
      },
    ],
  },
  compositionDetails: {
    tableName: 'compositionDetails',
    constructor: () => null,
    columns: [
      {
        fieldName: 'description',
        columnName: 'description',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        fieldName: 'details',
        columnName: 'details',
        type: {
          type: RelationshipType.oneToOne,
          with: 'extraDetails',
        },
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  extraDetails: {
    tableName: 'extraDetails',
    constructor: () => null,
    columns: [
      {
        fieldName: 'date',
        columnName: 'date',
        type: JsType.date,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  compositionCreator: {
    tableName: 'compositionCreators',
    constructor: () => null,
    columns: [
      {
        fieldName: 'id',
        columnName: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        fieldName: 'name',
        columnName: 'name',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        fieldName: 'exp',
        columnName: 'expLoL',
        type: JsType.boolean,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: false,
      },
      {
        fieldName: 'creators',
        columnName: 'creators',
        type: {
          type: RelationshipType.manyToMany,
          with: 'compositions',
        },
        isPrimaryKey: false,
        isNullable: false,
        isUnique: false,
      },
    ],
  },
};

export const tablesNamesInOrderFixtures = {
  layer0: ['clients', 'receivers', 'compositions', 'compositionCreators'],
  layer1: ['orders', 'compositionDetails'],
  layer2: ['extraDetails'],
};

export const tablesNamesFixtures = [
  ...tablesNamesInOrderFixtures.layer0,
  ...tablesNamesInOrderFixtures.layer1,
  ...tablesNamesInOrderFixtures.layer2,
].sort(() => 0.5 - Math.random());

export const hasForeignKeyFixture = [
  ...tablesNamesInOrderFixtures.layer1,
  ...tablesNamesInOrderFixtures.layer2,
];

export const hasForeignKeyFromFixture = {
  clients: ['orders'],
  receivers: ['orders'],
  compositions: ['orders', 'compositionDetails'],
  compositionCreators: [],
  orders: [],
  compositionDetails: ['extraDetails'],
  extraDetails: [],
};

export const relationshipsByTypeFixture = {
  [RelationshipType.oneToMany]: [
    {
      type: RelationshipType.oneToMany,
      fromTable: 'clients',
      toTable: 'orders',
    },
    {
      type: RelationshipType.oneToMany,
      fromTable: 'receivers',
      toTable: 'orders',
    },
    {
      type: RelationshipType.oneToMany,
      fromTable: 'compositions',
      toTable: 'orders',
    },
  ],
  [RelationshipType.oneToOne]: [
    {
      type: RelationshipType.oneToOne,
      fromTable: 'compositions',
      toTable: 'compositionDetails',
    },
    {
      type: RelationshipType.oneToOne,
      fromTable: 'compositionDetails',
      toTable: 'extraDetails',
    },
  ],
  [RelationshipType.manyToMany]: [
    {
      type: RelationshipType.manyToMany,
      fromTable: 'compositions',
      toTable: 'compositionCreators',
    },
  ],
};

export const relationshipsFixture = [
  ...relationshipsByTypeFixture[RelationshipType.oneToMany],
  ...relationshipsByTypeFixture[RelationshipType.oneToOne],
  ...relationshipsByTypeFixture[RelationshipType.manyToMany],
];
