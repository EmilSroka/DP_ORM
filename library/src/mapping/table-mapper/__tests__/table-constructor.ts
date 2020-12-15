import { Tables } from '../../../main/metadata-containers/tables';
import { Relationships } from '../../../main/metadata-containers/relationships';
import {
  hasForeignKeyFixture,
  hasForeignKeyFromFixture,
  relationshipsByTypeFixture,
  relationshipsFixture,
  tablesFixtures,
  tablesNamesFixtures,
  tablesNamesInOrderFixtures,
} from '../../../fixtures/table-constructor';
import { RelationshipType } from '../../../common/models/field-types';
import { TableConstructor } from '../table-constructor';

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
  });
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
        tablesThatHaveForeignKeyFrom: jest.fn(
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
