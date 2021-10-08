import { Tables } from '../../../main/metadata-containers/tables';
import { Relationships } from '../../../main/metadata-containers/relationships';
import {
  compositionDetailsWithDifferentKey,
  difLinkTablesSchemaFixtures,
  hasForeignKeyFixture,
  hasForeignKeyFromFixture,
  oneToManyForeignKeysFixture,
  linkTablesSchemaFixtures,
  relationshipsByTypeFixture,
  relationshipsFixture,
  tableSchemaFixtures,
  tablesFixtures,
  tablesNamesFixtures,
  tablesNamesInOrderFixtures,
} from '../../../fixtures/table-constructor';
import { RelationshipType } from '../../../common/models/field-types';
import { TableConstructor } from '../table-constructor';
import { TableSchema } from '../../../common/models/database-schema';

describe('TableConstructor', () => {
  let tables: Tables;
  let relationships: Relationships;
  let tableConstructor: TableConstructor;

  beforeEach(() => {
    tables = new Tables();
    relationships = new Relationships();
    tableConstructor = new TableConstructor(tables, relationships);
    jest.clearAllMocks();
  });

  it('method: getTableMapsNamesInCreationOrder should return names of tables in creation order', () => {
    const order = tableConstructor.getTableMapsNamesInCreationOrder();
    const {
      layer0: layer0Expected,
      layer1: layer1Expected,
      layer2: layer2Expected,
    } = tablesNamesInOrderFixtures;
    const layer0 = order.slice(0, layer0Expected.length);
    const layer1 = order.slice(
      layer0Expected.length,
      layer0Expected.length + layer1Expected.length,
    );
    const layer2 = order.slice(layer0Expected.length + layer1Expected.length);

    for (const tableName of layer0Expected) {
      expect(layer0).toContain(tableName);
    }
    for (const tableName of layer1Expected) {
      expect(layer1).toContain(tableName);
    }
    for (const tableName of layer2Expected) {
      expect(layer2).toContain(tableName);
    }

    expect(order.length).toBe(tables.getNames().length);
  });

  it('method: insertLinkTables cannot mutate original columns', () => {
    const input = Object.values(tableSchemaFixtures);
    const schemaCopy = JSON.parse(JSON.stringify(tableSchemaFixtures));
    const result = tableConstructor.insertLinkTables(input);

    const differentNameForeignKeyColumns: [string, string][] = [
      ['compositions', 'id'],
      ['compositionCreators', 'id'],
    ];

    schemaAssertion(result, differentNameForeignKeyColumns, schemaCopy);
  });

  it('method: toTableSchema should map non key ColumnMaps from TableMap to TableSchema columns', () => {
    const order = tableConstructor.getTableMapsNamesInCreationOrder();
    const result = order.map(
      tableConstructor.toTableSchema.bind(tableConstructor),
    ) as TableSchema[];

    const simpleColumns: [string, string][] = [
      ['clients', 'name'],
      ['orders', 'priceColumn'],
      ['receivers', 'name'],
      ['compositionDetails', 'description'],
      ['extraDetails', 'description'],
      ['compositionCreators', 'name'],
      ['compositionCreators', 'expLoL'],
    ];

    schemaAssertion(result, simpleColumns);
  });

  it('method: toTableSchema should map primary key ColumnMaps from TableMap to TableSchema columns', () => {
    const order = tableConstructor.getTableMapsNamesInCreationOrder();
    const result = order.map(
      tableConstructor.toTableSchema.bind(tableConstructor),
    ) as TableSchema[];

    const primaryKeyColumns: [string, string][] = [
      ['clients', 'id'],
      ['receivers', 'id'],
      ['compositions', 'id'],
      ['compositionCreators', 'id'],
    ];

    schemaAssertion(result, primaryKeyColumns);
  });

  it('method: toTableSchema should insert missing primary keys', () => {
    const order = tableConstructor.getTableMapsNamesInCreationOrder();
    const result = order.map(
      tableConstructor.toTableSchema.bind(tableConstructor),
    ) as TableSchema[];

    schemaAssertion(result, [['orders', 'id1']]);
  });

  it('method: toTableSchema should insert foreign keys (1toM) to proper tables', () => {
    const order = tableConstructor.getTableMapsNamesInCreationOrder();
    const result = order.map(
      tableConstructor.toTableSchema.bind(tableConstructor),
    ) as TableSchema[];

    const foreignKeyColumns: [string, string][] = [
      ['orders', 'id'],
      ['orders', 'foreignKey1'],
      ['orders', 'foreignKey2'],
    ];

    const resultForeignKeys = [];
    for (const [tableName, columnName] of foreignKeyColumns) {
      resultForeignKeys.push(
        result
          .find(({ name }) => name === tableName)
          .columns.find(({ name }) => name === columnName).foreignKey,
      );
    }
    for (const { tableName, columnName } of resultForeignKeys) {
      expect(columnName).toBe('id');
      expect(oneToManyForeignKeysFixture).toContain(tableName);
    }
  });

  it('method: toTableSchema should insert foreign keys (1to1) to proper tables', () => {
    const order = tableConstructor.getTableMapsNamesInCreationOrder();
    const result = order.map(
      tableConstructor.toTableSchema.bind(tableConstructor),
    ) as TableSchema[];

    const foreignKeyColumns: [string, string][] = [
      ['compositionDetails', 'id'],
      ['extraDetails', 'id'],
    ];
    schemaAssertion(result, foreignKeyColumns);
  });

  const schemaAssertion = (
    result: TableSchema[],
    toCheck: [string, string][],
    fixture = tableSchemaFixtures,
  ) => {
    for (const [tableName, columnName] of toCheck) {
      const resultColumn = result
        .find(({ name }) => name === tableName)
        .columns.find(({ name }) => name === columnName);
      const expectedColumn = fixture[tableName].columns.find(
        ({ name }) => name === columnName,
      );
      expect(resultColumn).toEqual(expectedColumn);
    }
  };
});

jest.mock('../../../main/metadata-containers/tables', () => {
  return {
    Tables: function () {
      return {
        get: jest.fn((name: string) => tablesFixtures[name]),
        getNames: jest.fn(() => tablesNamesFixtures),
      };
    },
  };
});

jest.mock('../../../main/metadata-containers/relationships', () => {
  return {
    Relationships: function () {
      return {
        hasForeignKey: jest.fn((name: string) =>
          hasForeignKeyFixture.includes(name),
        ),
        getAssociatedTablesNames: jest.fn(
          (name: string) => hasForeignKeyFromFixture[name],
        ),
        get: jest.fn(() => relationshipsFixture),
        getByType: jest.fn(
          (type: RelationshipType) => relationshipsByTypeFixture[type],
        ),
      };
    },
  };
});
