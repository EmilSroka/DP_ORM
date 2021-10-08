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

  it('cannot insert relationship if not included in the settings', () => {
    const { jsTypeFixture: settings } = attributeConfigurationFixtures;
    //const attribute = Attribute(tables, relationships, settings);
    //attribute(target, filedName);

    expect(relationships.add).not.toHaveBeenCalled();
  });

  it('cannot insert many to many relationship if exists already', () => {
    const { manyToManyFailFixture: settings } = attributeConfigurationFixtures;
    // const attribute = Attribute(tables, relationships, settings);
    // attribute(target, filedName);

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
