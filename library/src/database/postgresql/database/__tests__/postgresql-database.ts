import { Query as QueryMockFn } from 'pg';
import { PostgresqlDatabase } from '../postgresql-database';
import { PostgresqlRepository } from '../postgresql-repository';
import {
  actionFailByRejectionFixture,
  actionFailFixture,
  actionFixture,
} from '../../../../fixtures/postgresql-database';
import Mock = jest.Mock;

describe('PostgresqlDatabase', () => {
  let postgresqlDatabase: PostgresqlDatabase;

  beforeEach(() => {
    jest.clearAllMocks();
    postgresqlDatabase = new PostgresqlDatabase({
      connection: {
        user: '',
        database: '',
        password: '',
        host: '',
      },
    });
  });

  it('method: transaction should call all actions until once fail (rejected or resolved as false)', async () => {
    expect.assertions(12);

    await postgresqlDatabase.connect();
    await postgresqlDatabase.transaction(actionFixture);
    await postgresqlDatabase.transaction(actionFailFixture).catch();
    await postgresqlDatabase.transaction(actionFailByRejectionFixture).catch();

    expect(actionFixture[0]).toBeCalledTimes(1);
    expect(actionFixture[1]).toBeCalledTimes(1);
    expect(actionFixture[2]).toBeCalledTimes(1);
    expect(actionFixture[3]).toBeCalledTimes(1);
    expect(actionFailFixture[0]).toBeCalledTimes(1);
    expect(actionFailFixture[1]).toBeCalledTimes(1);
    expect(actionFailFixture[2]).toBeCalledTimes(1);
    expect(actionFailFixture[3]).not.toBeCalled();
    expect(actionFailByRejectionFixture[0]).toBeCalledTimes(1);
    expect(actionFailByRejectionFixture[1]).toBeCalledTimes(1);
    expect(actionFailByRejectionFixture[2]).toBeCalledTimes(1);
    expect(actionFailByRejectionFixture[2]).not.toBeCalled();
  });

  it('method: transaction should return a resolved promise on success (all transactions passed)', async () => {
    expect.assertions(1);

    await postgresqlDatabase.connect();

    await expect(
      postgresqlDatabase.transaction(actionFixture),
    ).resolves.toBeTruthy();
  });

  it('method: transaction should return a rejected promise on failure (one transaction failed)', async () => {
    expect.assertions(1);

    await postgresqlDatabase.connect();

    await expect(
      postgresqlDatabase.transaction(actionFailFixture),
    ).rejects.toBeFalsy();
  });

  it('method: transaction should return a rejected promise when there is no connection to database', async () => {
    expect.assertions(1);

    await expect(
      postgresqlDatabase.transaction(actionFixture),
    ).rejects.toBeFalsy();
  });

  it('method: transaction should call all actions within transaction', async () => {
    expect.assertions(3);

    await postgresqlDatabase.connect();
    await postgresqlDatabase.transaction(actionFixture);
    expect(QueryMockFn).toHaveBeenCalledTimes(2);
    expect(QueryMockFn).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(QueryMockFn).toHaveBeenNthCalledWith(2, 'COMMIT');
  });

  it('method: transaction should rollback on fail', async () => {
    expect.assertions(3);

    await postgresqlDatabase.connect();
    await postgresqlDatabase.transaction(actionFailFixture).catch();
    expect(QueryMockFn).toHaveBeenCalledTimes(2);
    expect(QueryMockFn).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(QueryMockFn).toHaveBeenNthCalledWith(2, 'ROLLBACK');
  });

  it('method: transaction should pass PostgresqlRepository instance to actions', async () => {
    expect.assertions(actionFixture.length);

    await postgresqlDatabase.connect();
    await postgresqlDatabase.transaction(actionFixture);
    for (const action of actionFixture) {
      expect((action as Mock).mock.calls[0][0]).toBeInstanceOf(
        PostgresqlRepository,
      );
    }
  });
});

jest.mock('pg', () => {
  const queryMockFn = jest.fn(async () => true);

  return {
    Pool: function () {
      return {
        connect: () =>
          Promise.resolve({
            query: queryMockFn,
          }),
      };
    },
    Query: queryMockFn,
  };
});
