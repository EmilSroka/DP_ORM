import { PoolClient } from 'pg';
import any = jasmine.any;

export class PostgresqlRepository {
  constructor(private client: PoolClient) {}

  insert(tableName: string, fields: string[], values: any[][]): Promise<any> {
    let queryText = 'INSERT INTO ' + tableName + ' (' + fields[0];

    for (let i = 1; i < fields.length; i++) {
      queryText += ', ' + fields[i];
    }

    queryText += ') VALUES';

    const flattenedValues: string[] = values.flat();

    queryText += '($1';

    for (let i = 2; i <= flattenedValues.length; i++) {
      if (i - 1 === values[0].length) {
        queryText += '), ($' + String(i);
      } else {
        queryText += ', $' + String(i);
      }
    }

    queryText += ')';

    const queryObj = {
      text: queryText,
      values: flattenedValues,
    };

    return this.client.query(queryObj);
  }
}
