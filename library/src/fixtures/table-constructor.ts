import { DbType, JsType, RelationshipType } from '../common/models/field-types';
import { TableMap } from '../common/models/table-map';
import { TableSchema } from '../common/models/database-schema';

export const tablesFixtures: {
  [key: string]: TableMap<any>;
} = {
  clients: {
    tableName: 'clients',
    constructor: class {},
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
    constructor: class {},
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
    constructor: class {},
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
    constructor: class {},
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
    constructor: class {},
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
    constructor: class {},
    columns: [
      {
        fieldName: 'date',
        columnName: 'date',
        type: DbType.date,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  compositionCreators: {
    tableName: 'compositionCreators',
    constructor: class {},
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
      fromTableName: 'clients',
      toTableName: 'orders',
    },
    {
      type: RelationshipType.oneToMany,
      fromTableName: 'receivers',
      toTableName: 'orders',
    },
    {
      type: RelationshipType.oneToMany,
      fromTableName: 'compositions',
      toTableName: 'orders',
    },
  ],
  [RelationshipType.oneToOne]: [
    {
      type: RelationshipType.oneToOne,
      fromTableName: 'compositions',
      toTableName: 'compositionDetails',
    },
    {
      type: RelationshipType.oneToOne,
      fromTableName: 'compositionDetails',
      toTableName: 'extraDetails',
    },
  ],
  [RelationshipType.manyToMany]: [
    {
      type: RelationshipType.manyToMany,
      fromTableName: 'compositions',
      toTableName: 'compositionCreators',
    },
  ],
};

export const relationshipsFixture = [
  ...relationshipsByTypeFixture[RelationshipType.oneToMany],
  ...relationshipsByTypeFixture[RelationshipType.oneToOne],
  ...relationshipsByTypeFixture[RelationshipType.manyToMany],
];

export const tableSchemaFixtures: {
  [key: string]: TableSchema;
} = {
  clients: {
    name: 'clients',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'name',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  orders: {
    name: 'orders',
    columns: [
      {
        name: 'id1',
        type: DbType.autoincrement,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'priceColumn',
        type: JsType.number,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: false,
      },
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'clients',
          columnName: 'id',
        },
      },
      {
        name: 'foreignKey1',
        type: JsType.number,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'receivers',
          columnName: 'id',
        },
      },
      {
        name: 'foreignKey2',
        type: JsType.number,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositions',
          columnName: 'id',
        },
      },
    ],
  },
  receivers: {
    name: 'receivers',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'name',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  compositions: {
    name: 'compositions',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
    ],
  },
  compositionDetails: {
    name: 'compositionDetails',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositions',
          columnName: 'id',
        },
      },
      {
        name: 'description',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  extraDetails: {
    name: 'extraDetails',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositionDetails',
          columnName: 'id',
        },
      },
      {
        name: 'date',
        type: DbType.date,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
    ],
  },
  compositionCreators: {
    name: 'compositionCreators',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'name',
        type: JsType.string,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
      },
      {
        name: 'expLoL',
        type: JsType.boolean,
        isPrimaryKey: false,
        isNullable: false,
        isUnique: false,
      },
    ],
  },
};

export const linkTablesSchemaFixtures: {
  [key: string]: TableSchema;
} = {
  ...tableSchemaFixtures,
  compositions_compositionCreators: {
    name: 'compositions_compositionCreators',
    columns: [
      {
        name: 'id1',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositions',
          columnName: 'id',
        },
      },
      {
        name: 'id2',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositionCreators',
          columnName: 'id',
        },
      },
    ],
  },
};

export const compositionDetailsWithDifferentKey: TableSchema = {
  name: 'compositionDetails',
  columns: [
    {
      name: 'diff',
      type: JsType.number,
      isPrimaryKey: true,
      isNullable: false,
      isUnique: true,
      foreignKey: {
        tableName: 'compositions',
        columnName: 'id',
      },
    },
    {
      name: 'description',
      type: JsType.string,
      isPrimaryKey: false,
      isNullable: true,
      isUnique: false,
    },
  ],
};

export const difLinkTablesSchemaFixtures: {
  [key: string]: TableSchema;
} = {
  ...tableSchemaFixtures,
  compositions_compositionCreators: {
    name: 'compositions_compositionCreators',
    columns: [
      {
        name: 'id',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositions',
          columnName: 'id',
        },
      },
      {
        name: 'diff',
        type: JsType.number,
        isPrimaryKey: true,
        isNullable: false,
        isUnique: true,
        foreignKey: {
          tableName: 'compositionCreators',
          columnName: 'diff',
        },
      },
    ],
  },
};

export const oneToManyForeignKeysFixture = [
  'compositions',
  'receivers',
  'clients',
];
