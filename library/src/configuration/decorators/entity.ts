import { EntityConfiguration } from '../models/entity-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { TableMap } from '../../common/models/table-map';

export function Entity(tables: Tables, settings?: EntityConfiguration) {
  return function (constructor: () => void): void {
    const dataMap: TableMap = {
      tableName: settings ? settings.tableName : constructor.name,
      columns: [],
      constructor,
    };
    constructor.prototype['_orm_table_name'] = dataMap.tableName;

    tables.add(dataMap);
  };
}
