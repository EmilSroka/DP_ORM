import {
  relationshipsFixtures,
  tablesFixtures,
  attributeConfigurationFixtures,
  columnMapFixtures,
} from '../../../fixtures/attribute';
import { Tables } from '../../../main/metadata-containers/tables';
import { Relationships } from '../../../main/metadata-containers/relationships';
import { Attribute } from '../attribute';
import Mock = jest.Mock;

const tableNameField = '_orm_table_name';
const tableNameValue = 'abc';
const filedName = 'fn';
const target = {};
Object.getPrototypeOf(target)[tableNameField] = tableNameValue;

describe('Attribute (decorator)', () => {
  let tables: Tables;
  let relationships: Relationships;

  beforeEach(() => {
    jest.clearAllMocks();

    tables = new Tables();
    relationships = new Relationships();
  });

  afterEach(() => {
    tablesFixtures[target[tableNameField]].columns = [];
  });

  it.skip('should get TableMap from Tables container', () => {
    const { jsTypeFixture: settings } = attributeConfigurationFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);

    expect(tables.get).toHaveBeenCalledTimes(1);
    expect(tables.get).toHaveBeenCalledWith(tableNameValue);
  });

  it.skip('should fill optional properties with default values (if not provided)', () => {
    const { jsTypeFixture: settings } = attributeConfigurationFixtures;
    const { jsTypeFixture: result } = columnMapFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);
    const columnMap = tablesFixtures[target[tableNameField]].columns[0];

    expect(columnMap).toEqual(result);
  });

  it.skip('should create ColumnMap based on provided settings', () => {
    const { allSettingsFixture: settings } = attributeConfigurationFixtures;
    const { allSettingsFixture: result } = columnMapFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);
    const columnMap = tablesFixtures[target[tableNameField]].columns[0];

    expect(columnMap).toEqual(result);
  });

  it.skip('should insert relationship if included in the settings', () => {
    const { manyToManyFixture: settings } = attributeConfigurationFixtures;
    const { manyToManyFixture: result } = relationshipsFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);
    const callAttribute = (relationships.add as Mock).mock.calls[0][0];

    expect(relationships.add).toHaveBeenCalledTimes(1);
    expect(callAttribute).toEqual(result);
  });

  it('cannot insert relationship if not included in the settings', () => {
    const { jsTypeFixture: settings } = attributeConfigurationFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);

    expect(relationships.add).not.toHaveBeenCalled();
  });

  it.skip('should handle one to many relationship', () => {
    const { oneToManyFixture: settings } = attributeConfigurationFixtures;
    const { oneToManyFixture: result } = columnMapFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);
    const columnMap = tablesFixtures[target[tableNameField]].columns[0];

    expect(columnMap).toEqual(result);
  });

  it.skip('should handle many to many relationship', () => {
    const { manyToManyFixture: settings } = attributeConfigurationFixtures;
    const { manyToManyFixture: result } = columnMapFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);
    const columnMap = tablesFixtures[target[tableNameField]].columns[0];

    expect(columnMap).toEqual(result);
  });

  it.skip('should handle one to one relationship', () => {
    const { oneToOneFixture: settings } = attributeConfigurationFixtures;
    const { oneToOneFixture: result } = columnMapFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);
    const columnMap = tablesFixtures[target[tableNameField]].columns[0];

    expect(columnMap).toEqual(result);
  });

  it('cannot insert many to many relationship if exists already', () => {
    const { manyToManyFailFixture: settings } = attributeConfigurationFixtures;
    const attribute = Attribute(tables, relationships, settings);
    attribute(target, filedName);

    expect(relationships.add).not.toHaveBeenCalled();
  });
});

jest.mock('../../../main/metadata-containers/tables', () => {
  return {
    Tables: function () {
      return {
        get: jest.fn((name: string) => tablesFixtures[name]),
      };
    },
  };
});

jest.mock('../../../main/metadata-containers/relationships', () => {
  return {
    Relationships: function () {
      return {
        add: jest.fn(),
        get: jest.fn(() => [relationshipsFixtures.manyToManyFailFixture]),
        getByType: jest.fn(() => [relationshipsFixtures.manyToManyFailFixture]),
      };
    },
  };
});
