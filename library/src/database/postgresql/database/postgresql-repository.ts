import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import { TableSchema } from '../../../common/models/database-schema';
import { CreateQueryPartFactory } from './create-query-part';
import { Condition } from '../model/condition';

export class PostgresqlRepository {
  constructor(
    private client: PoolClient,
    private partsFactory: CreateQueryPartFactory,
  ) {}

  insert(
    tableName: string,
    fields: string[],
    values: any[][],
    returning: string[] = [],
  ): Promise<any> {
    // TODO
    // add to end of the query text ' RETURNING <returning>, <returning>, <returning>;' ~ depends of returning size
    // but only, when returning is not empty

    let queryText = `INSERT INTO ${tableName} (${fields.join(', ')})`;

    const flattenedValues: string[] = values.flat();

    queryText = `${queryText} VALUES`;

    let index = 0;

    for (let i = 0; i < values.length; i++) {
      queryText += '($';
      queryText += new Array(values[i].length)
        .fill(1)
        .map((_, j) => j + index + 1)
        .join(', $');
      if (i != values.length - 1) {
        queryText += '), ';
        index += values[i].length;
      } else {
        queryText += ')';
      }
    }

    const queryObj = {
      text: queryText,
      values: flattenedValues,
    };

    return this.client.query(queryObj);
  }

  async create(schema: TableSchema): Promise<any> {
    const parts = schema.columns.map((column) =>
      this.partsFactory.get(column).getPart(),
    );
    const query = `CREATE TABLE ${schema.name} (${parts.join(', ')});`;

    return this.client.query(query);
  }

  select(
    tableName: string,
    fieldNames: string[],
    condition: Condition,
  ): Promise<QueryResult<QueryResultRow>> {
    let query = 'SELECT';

    if (fieldNames.length > 0) {
      query += ' ';
    }

    query += `${fieldNames.join(
      ', ',
    )} FROM ${tableName} WHERE ${condition.toString()};`;

    return this.client.query(query);
  }

  update(
    tableName: string,
    fieldNames: string[],
    values: any[],
    condition: Condition,
    returning: string[] = [],
  ): Promise<any> {
    // TODO:
    // 1. create "query config object" for update query. eg:
    //    text: UPDATE <tableName> SET <fieldName1> = $1, <fieldName2> = $2 WHERE <condition.toString()> RETURNING <>;
    //          - RETURNING only when returning parameter is not empty
    //    values: values parameter
    // 2. call query with "query config object" as argument, and return it's result
    // additional link, might be helpful:
    // https://node-postgres.com/features/queries
    return Promise.resolve();
  }

  delete(tableName: string, condition: Condition): Promise<any> {
    // TODO:
    // 1. create query text:
    //    DELETE FROM <tableName> WHERE <condition.toString()>;
    // 2. call query with created text as argument, and return it's result
    return Promise.resolve();
  }
}
