import { DBAction } from './db-action';

export interface Database {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  transaction: <T>(actions: DBAction[]) => Promise<T[]>;
}
