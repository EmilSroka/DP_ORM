import { Relationship } from '../main/models/relationships';
import { JsType, RelationshipType } from '../common/models/field-types';
import { AttributeConfiguration } from '../configuration/models/attribute-configuration';
import { ColumnMap } from '../common/models/column-map';

export const tablesFixtures = {
  abc: {
    tableName: 'abc',
    constructor: () => null,
    columns: [],
  },
};

export const attributeConfigurationFixtures: {
  [key: string]: AttributeConfiguration;
} = {
  jsTypeFixture: {
    type: JsType.string,
  },
  allSettingsFixture: {
    type: JsType.string,
    columnName: 'pyrpyrpyr',
    isPrimaryKey: true,
    isNullable: false,
    isUnique: true,
  },
  oneToManyFixture: {
    type: {
      type: RelationshipType.oneToMany,
      with: 'xyz',
    },
  },
  manyToManyFailFixture: {
    type: {
      type: RelationshipType.manyToMany,
      with: 'ppp',
    },
  },
  manyToManyFixture: {
    type: {
      type: RelationshipType.manyToMany,
      with: 'xyz',
    },
  },
  oneToOneFixture: {
    type: {
      type: RelationshipType.oneToOne,
      with: 'xyz',
    },
  },
};

export const columnMapFixtures: {
  [key: string]: ColumnMap;
} = {
  jsTypeFixture: {
    type: JsType.string,
    fieldName: 'fn',
    columnName: 'fn',
    isPrimaryKey: true,
    isNullable: false,
    isUnique: true,
  },
  allSettingsFixture: {
    type: JsType.string,
    columnName: 'pyrpyrpyr',
    fieldName: 'fn',
    isPrimaryKey: true,
    isNullable: false,
    isUnique: true,
  },
  oneToManyFixture: {
    type: {
      type: RelationshipType.oneToMany,
      with: 'xyz',
    },
    fieldName: 'fn',
    columnName: 'fn',
    isPrimaryKey: true,
    isNullable: false,
    isUnique: true,
  },
  manyToManyFixture: {
    type: {
      type: RelationshipType.manyToMany,
      with: 'xyz',
    },
    fieldName: 'fn',
    columnName: 'fn',
    isPrimaryKey: true,
    isNullable: false,
    isUnique: true,
  },
  oneToOneFixture: {
    type: {
      type: RelationshipType.oneToOne,
      with: 'xyz',
    },
    fieldName: 'fn',
    columnName: 'fn',
    isPrimaryKey: true,
    isNullable: false,
    isUnique: true,
  },
};

export const relationshipsFixtures: {
  [key: string]: Relationship;
} = {
  oneToManyFixture: {
    type: RelationshipType.oneToMany,
    fromTableName: 'abc',
    toTableName: 'xyz',
  },
  manyToManyFailFixture: {
    type: RelationshipType.manyToMany,
    fromTableName: 'ppp',
    toTableName: 'abc',
  },
  manyToManyFixture: {
    type: RelationshipType.manyToMany,
    fromTableName: 'abc',
    toTableName: 'xyz',
  },
  oneToOneFixture: {
    type: RelationshipType.oneToOne,
    fromTableName: 'abc',
    toTableName: 'xyz',
  },
};
