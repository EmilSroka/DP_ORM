import { Tables } from '../../../main/metadata-containers/tables';
import { SaveMapperFactory } from '../save-mapper-factory';
import { EntityRecursiveSaveMapper } from '../entity-recursive-save-mapper';
import { recursiveStrategyFixture } from '../../../fixtures/entity-save-mapper';
import { Repository } from '../../../common/models/repository';

const mockProps = {
  tableSchema: {},
  tableMap: {},
  inDB: false,
};
const actionMock = jest.fn();
const strategyMock = { toAction: jest.fn((_a, _b) => actionMock) };
const getStrategyMock = jest.fn((_) => strategyMock);
jest.mock('../entity-save-mapper', () => {
  return {
    EntitySaveMapper: class {
      getTableSchema() {
        return mockProps.tableSchema;
      }
      getTableMap() {
        return mockProps.tableMap;
      }
      existsInDB() {
        return mockProps.inDB;
      }
      getStrategy = getStrategyMock;
    },
  };
});

describe('Entity recursive save mapper', () => {
  const mapper = new EntityRecursiveSaveMapper(
    {} as Tables,
    [],
    new Set(),
    {} as SaveMapperFactory,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('method: toExtraFields should map dictionary (columnName -> value) to ExtraFields', () => {
    const entity = { _orm_table_name: 'name' };
    const dictionary = { field1: 'lll', field2: 1, lox: true };
    const expected = [
      { tableName: 'name', columnName: 'field1', value: 'lll' },
      { tableName: 'name', columnName: 'field2', value: 1 },
      { tableName: 'name', columnName: 'lox', value: true },
    ];

    expect(mapper.toExtraFields(entity, dictionary)).toEqual(expected);
  });

  it('method: saveRecursively should call proper strategy for every relation', async () => {
    expect.assertions(10);

    const { entity, keys, relationships, map } = recursiveStrategyFixture;
    mockProps.tableMap = map;
    const repositoryMock = {} as Repository;
    await mapper.saveRecursively(entity, keys, repositoryMock);

    expect(getStrategyMock).toHaveBeenCalledTimes(relationships.length);

    expect(strategyMock.toAction).toHaveBeenCalledTimes(relationships.length);
    expect(actionMock).toHaveBeenCalledTimes(relationships.length);
    expect(actionMock).toHaveBeenCalledWith(repositoryMock);
    for (let i = 0; i < relationships.length; i++) {
      const [relationship, field] = relationships[i];
      expect(getStrategyMock).toHaveBeenNthCalledWith(i + 1, relationship);
      expect(strategyMock.toAction).toHaveBeenNthCalledWith(i + 1, field, keys);
    }
  });
});
