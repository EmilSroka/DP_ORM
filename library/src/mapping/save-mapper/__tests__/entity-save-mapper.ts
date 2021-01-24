import {
  entitySaveFixtures,
  entitySaveInsertCases,
  entitySaveUpdateCases,
  getPrimaryKeysFixture,
  missingFieldsCases,
  missingFieldsFixture,
} from '../../../fixtures/entity-save-mapper';
import { EntitySave } from '../entity-save';
import { Tables } from '../../../main/metadata-containers/tables';
import { SaveMapperFactory } from '../save-mapper-factory';
import { Repository } from '../../../common/models/repository';
import { Condition } from '../../../database/postgresql/model/condition';

let mockProps = {
  tableSchema: {},
  tableMap: {},
  inDB: false,
  getStrategy: jest.fn(),
};
jest.mock('../abstract-save-mapper', () => {
  return {
    AbstractSaveMapper: class {
      getTableSchema() {
        return mockProps.tableSchema;
      }
      getTableMap() {
        return mockProps.tableMap;
      }
      existsInDB() {
        return mockProps.inDB;
      }
      getStrategy() {
        return mockProps.getStrategy;
      }
    },
  };
});

describe('Entity save mapper', () => {
  const mapper = new EntitySave(
    {} as Tables,
    [],
    // new Set(),
    {} as any,
    // {} as SaveMapperFactory,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.skip('method: getPrimaryKeyColumnNames should return names of primary key columns', () => {
    for (const [entity, tableSchema, output] of getPrimaryKeysFixture) {
      mockProps = {
        tableSchema,
        tableMap: () => '',
        inDB: false,
        getStrategy: jest.fn(),
      };
      // expect(mapper.getPrimaryKeyColumnNames(entity)).toEqual(
      //   expect.arrayContaining(output),
      // );
    }
  });

  it.each(entitySaveFixtures)(
    "method: saveEntity should handle %s when object hasn't been saved before",
    (key) => {
      const [
        object,
        output,
        tableMap,
        tableSchema,
        extraFields,
        pkFields,
      ] = entitySaveInsertCases[key];

      mockProps = {
        tableSchema,
        tableMap,
        inDB: false,
        getStrategy: jest.fn(),
      };

      const insertMethod = jest.fn(
        (a: string, b: string[], c: any[][]) => 'abc',
      );
      // const returned = mapper.saveEntity(
      //   object,
      //   extraFields,
      //   ({
      //     insert: insertMethod,
      //   } as unknown) as Repository,
      //   pkFields,
      // );
      // expect(returned).toBe('abc');

      expect(insertMethod).toHaveBeenCalledTimes(1);
      const input = insertMethod.mock.calls[0];
      const [tableName, columns, data] = output;
      expect(input[0]).toBe(tableName);
      expect(input[1]).toEqual(expect.arrayContaining(columns));
      for (let i = 0; i < columns.length; i++) {
        const name = columns[i];
        const index = input[1].indexOf(name);
        expect(input[2][0][index]).toEqual(data[0][i]);
      }
    },
  );

  it.each(entitySaveFixtures)(
    "method: saveEntity should handle %s when object hasn't been saved before",
    (key) => {
      const [
        object,
        output,
        tableMap,
        tableSchema,
        extraFields,
        pkFields,
      ] = entitySaveUpdateCases[key];

      mockProps = {
        tableSchema,
        tableMap,
        inDB: true,
        getStrategy: jest.fn(),
      };

      const updateMethod = jest.fn(
        (a: string, b: string[], c: any[], d: Condition) => 'xyz',
      );
      // const returned = mapper.saveEntity(
      //   object,
      //   extraFields,
      //   ({
      //     update: updateMethod,
      //   } as unknown) as Repository,
      //   pkFields,
      // );
      // expect(returned).toBe('xyz');

      expect(updateMethod).toHaveBeenCalledTimes(1);
      const input = updateMethod.mock.calls[0];
      const [tableName, columns, data] = output;
      expect(input[0]).toBe(tableName);
      expect(input[1]).toEqual(expect.arrayContaining(columns));

      for (let i = 0; i < columns.length; i++) {
        const name = columns[i];
        const index = input[1].indexOf(name);
        expect(input[2][index]).toEqual(data[i]);
      }

      expect(input[3].toString()).toBe(output[3].toString());
    },
  );

  it.skip.each(missingFieldsCases)(
    'method: handleMissingFields should %s',
    (key) => {
      const [entity, tableMap, keys, output] = missingFieldsFixture[key];

      mockProps = {
        tableSchema: [],
        tableMap,
        inDB: true,
        getStrategy: jest.fn(),
      };
      // mapper.handleMissingFields(entity, keys);
      expect(entity).toEqual(output);
    },
  );
});
