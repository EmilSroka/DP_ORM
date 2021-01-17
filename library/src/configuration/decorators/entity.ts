import { EntityConfiguration } from '../models/entity-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { TableMap } from '../../common/models/table-map';
import { EntityClass } from '../../common/models/entity';

export function Entity(tables: Tables, settings?: EntityConfiguration) {
  return function <T extends { name: string; new (...args: any[]): any }>(
    constructor: T,
  ): void {
    const dataMap: TableMap<T> = {
      tableName: settings
        ? settings.tableName.toLowerCase()
        : constructor.name.toLowerCase(),
      columns: [],
      constructor: constructor as any,
    };
    tables.add(dataMap);

    for (const cb of (constructor as any).prototype._orm_attributes) {
      cb(dataMap.tableName);
    }
    delete (constructor as any).prototype._orm_attributes;
    (constructor as any).prototype._orm_table_name = dataMap.tableName;
  };
}

export const asEntityClass = <
  T extends { name: string; new (...args: any[]): any }
>(
  x: T,
): T & EntityClass => x;

export type EntityDecorator = (
  settings?: EntityConfiguration,
) => (constructor: any) => undefined;
