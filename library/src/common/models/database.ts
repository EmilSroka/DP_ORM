import { DBAction } from './db-action';

export interface Database {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  transaction: (actions: DBAction[]) => Promise<boolean>;
}
