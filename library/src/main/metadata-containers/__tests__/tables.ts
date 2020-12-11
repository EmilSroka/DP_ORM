import { tableMapsFixture } from '../../../fixtures/table-map';
import { Tables } from '../tables';

describe('Tables (container)', () => {
  let tables: Tables;

  beforeEach(() => {
    tables = new Tables();
    tableMapsFixture.forEach((tableMap) => {
      tables.add(tableMap);
    });
  });

  it('should allow to get TableMap by name', () => {
    tableMapsFixture.forEach((tableMap) => {
      expect(tables.get(tableMap.tableName)).toBe(tableMap);
    });
  });

  it('should throw an error when user try to get TableMap that does not exist', () => {
    expect(() => tables.get('')).toThrowError();
  });

  it('should allow to get names of all stored TableMaps', () => {
    const expectedNames = tableMapsFixture.map(({ tableName }) => tableName);
    const resultNames = tables.getNames();
    expect(resultNames).toEqual(expectedNames);
  });
});
