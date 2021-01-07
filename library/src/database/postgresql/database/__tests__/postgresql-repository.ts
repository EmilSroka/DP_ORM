import { PostgresqlRepository } from '../postgresql-repository';
import { PoolClient } from 'pg';
import {
  basicOutput,
  fieldsBasicInput,
  fieldsMultiInput,
  insertPromiseValue,
  multiOutput,
  tableNameBasicInput,
  tableNameMultiInput,
  valuesBasicInput,
  valuesMultiInput,
  selectQueryInputFixture,
  selectQueryOutputFuture,
  deleteQueryInputFixture,
  deleteQueryOutputFuture,
  updateQueryInputFixture,
  updateQueryOutputFuture,
} from '../../../../fixtures/postgresql-repository';
import { CreateQueryPartFactory } from '../create-query-part';
import { TableSchemaFixture } from '../../../../fixtures/postgresql-repository';
import Mock = jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PostgresqlRepository', () => {
  let repository: PostgresqlRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PostgresqlRepository(
      poolClientMock,
      createQueryPartFactoryMock,
    );
  });

  it('method: insert should call query on PoolClient with proper "Query config object"', async () => {
    expect.assertions(3);

    await repository.insert(
      tableNameBasicInput,
      fieldsBasicInput,
      valuesBasicInput,
    );

    expect(poolClientMock.query).toHaveBeenCalledTimes(1);
    const argument = (poolClientMock.query as Mock).mock.calls[0][0];
    expect(basicOutput.text.test(argument.text)).toBeTruthy();
    expect(argument.values).toEqual(basicOutput.values);
  });

  it('method: insert should handle inserting multiple objects', async () => {
    expect.assertions(3);

    await repository.insert(
      tableNameMultiInput,
      fieldsMultiInput,
      valuesMultiInput,
    );

    expect(poolClientMock.query).toHaveBeenCalledTimes(1);
    const argument = (poolClientMock.query as Mock).mock.calls[0][0];
    expect(multiOutput.text.test(argument.text)).toBeTruthy();
    expect(argument.values).toEqual(multiOutput.values);
  });

  it('method: insert should return output from PoolClient.query function', () => {
    expect.assertions(1);
    expect(
      repository.insert(
        tableNameBasicInput,
        fieldsBasicInput,
        valuesBasicInput,
      ),
    ).resolves.toBe(insertPromiseValue);
  });

  it('method: create should get query part for every column from proper CreateQueryPart taken from CreateQueryPartFactory', async () => {
    expect.assertions(2 + TableSchemaFixture.columns.length);
    await repository.create(TableSchemaFixture);
    expect(getPartMock).toBeCalledTimes(TableSchemaFixture.columns.length);
    expect(getMock).toBeCalledTimes(TableSchemaFixture.columns.length);

    for (const column of TableSchemaFixture.columns) {
      expect(getMock).toBeCalledWith(column);
    }
  });

  it('method: create should create table in database by calling proper query on PoolClient', async () => {
    expect.assertions(1);
    await repository.create(TableSchemaFixture);
    const expected = `CREATE TABLE ${TableSchemaFixture.name} (${', '.repeat(
      TableSchemaFixture.columns.length - 1,
    )});`;
    expect(queryMock).toHaveBeenCalledWith(expected);
  });

  it("method: select should create proper query string and pass it to PoolClient's query method", async () => {
    expect.assertions(3);
    await expect(
      repository.select(...selectQueryInputFixture),
    ).resolves.toBeTruthy();
    expect(poolClientMock.query).toHaveBeenCalledTimes(1);
    expect(poolClientMock.query).toHaveBeenCalledWith(selectQueryOutputFuture);
  });

  it(`method: update should create proper "query config object" and pass it to PoolClient's query method`, async () => {
    expect.assertions(4);
    await expect(
      repository.update(...updateQueryInputFixture),
    ).resolves.toBeTruthy();
    expect(poolClientMock.query).toHaveBeenCalledTimes(1);
    const output = (poolClientMock.query as Mock).mock.calls[0][0];
    expect(updateQueryOutputFuture.text.test(output.text)).toBeTruthy();
    expect(output.values).toEqual(updateQueryOutputFuture.values);
  });

  it("method: delete should create proper query string and pass it to PoolClient's query method", async () => {
    expect.assertions(3);
    await expect(
      repository.delete(...deleteQueryInputFixture),
    ).resolves.toBeTruthy();
    expect(poolClientMock.query).toHaveBeenCalledTimes(1);
    expect(poolClientMock.query).toHaveBeenCalledWith(deleteQueryOutputFuture);
  });
});

const queryMock = jest.fn((_) => Promise.resolve(insertPromiseValue));
const getPartMock = jest.fn((_) => '');
const getMock = jest.fn((_) => ({
  getPart: getPartMock,
}));

const poolClientMock = ({
  query: queryMock,
} as unknown) as PoolClient;

const createQueryPartFactoryMock = ({
  get: getMock,
} as unknown) as CreateQueryPartFactory;
