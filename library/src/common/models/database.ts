export interface Database {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  transaction: (actions: Array<() => Promise<boolean>>) => Promise<boolean>;
}
