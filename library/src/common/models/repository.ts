import { Condition } from '../../database/postgresql/model/condition';

export interface Repository {
  create: () => void;
  insert: (
    tableName: string,
    columnNames: string[],
    data: any[][],
  ) => Promise<any>;
  update: (
    tableName: string,
    columnNames: string[],
    data: any[],
    condition: Condition,
  ) => Promise<any>;
  delete: () => void;
  select: () => void;
}
