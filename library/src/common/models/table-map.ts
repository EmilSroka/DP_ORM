import { ColumnMap } from './column-map';

export interface TableMap {
  tableName: string;
  constructor: { name: string; new (...args: any[]): any };
  columns: ColumnMap[];
}
