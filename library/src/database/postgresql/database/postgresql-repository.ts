import { PoolClient } from 'pg';
import { TableSchema } from '../../../common/models/database-schema';
import { CreateQueryPartFactory } from './create-query-part';

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
}
