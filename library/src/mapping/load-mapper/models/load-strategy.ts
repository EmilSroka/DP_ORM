import { ColumnMap } from '../../../common/models/column-map';
import { EntityLoader } from '../entity-loader';
import { TableSchema } from '../../../common/models/database-schema';

export type LoadStrategy = {
  load: (
    field: ColumnMap,
    tableName: string,
    [keyName, keyValue]: [string, any],
    loader: EntityLoader,
    repository: any,
    dbSchema: TableSchema[],
  ) => any; // Entity, DBAction;
};
