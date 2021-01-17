import { ColumnMap } from './column-map';

export interface TableMap<T> {
  tableName: string;
  constructor: { new (...args: any[]): T };
  columns: ColumnMap[];
}
