import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import { TableSchema } from '../../../common/models/database-schema';
import { CreateQueryPartFactory } from './create-query-part';
import { Condition } from '../model/condition';

export class PostgresqlRepository {
  constructor(
    private client: PoolClient,
    private partsFactory: CreateQueryPartFactory,
  ) {}

  insert(tableName: string, fields: string[], values: any[][]): Promise<any> {
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

  async tableExist(tableName: string, schemaName?: string): Promise<boolean> {
    const query = `SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = '${tableName.toLowerCase()}'
    ${schemaName ? `AND table_schema = '${schemaName.toLowerCase()}'` : ''}
    );`;
    const {
      rows: [{ exists: result }],
    } = await this.client.query(query);
    return result;
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
}
