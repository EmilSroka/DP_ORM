import { ColumnMap } from './column-map';

export interface TableMap {
  tableName: string;
  constructor: () => void;
  columns: ColumnMap[];
}
