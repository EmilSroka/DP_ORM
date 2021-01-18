import { Condition } from '../../database/postgresql/model/condition';
import { TableSchema } from './database-schema';
import { QueryResult, QueryResultRow } from 'pg';

export interface Repository {
  create: (schema: TableSchema) => void;
  insert: (
    tableName: string,
    columnNames: string[],
    data: any[][],
    returning: string[],
  ) => Promise<any>;
  update: (
    tableName: string,
    columnNames: string[],
    data: any[],
    condition: Condition,
    returning: string[],
  ) => Promise<QueryResult<QueryResultRow>>;
  delete: (tableName: string, condition: Condition) => Promise<any>;
  select(
    tableName: string,
    fieldNames: string[],
    condition: Condition,
  ): Promise<QueryResult<QueryResultRow>>;
}
