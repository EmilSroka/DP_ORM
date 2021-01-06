import { PoolClient } from 'pg';

export class PostgresqlRepository {
  constructor(private client: PoolClient) {}

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
}
