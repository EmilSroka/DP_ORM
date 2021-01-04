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
} from '../../../../fixtures/postgresql-repository';
import Mock = jest.Mock;

const poolClientMock = ({
  query: jest.fn(() => Promise.resolve(insertPromiseValue)),
} as unknown) as PoolClient;

describe('PostgresqlRepository', () => {
  const repository = new PostgresqlRepository(poolClientMock);

  beforeEach(() => {
    jest.clearAllMocks();
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
});
