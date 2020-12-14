import { EntityConfiguration } from '../models/entity-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { TableMap } from '../../common/models/table-map';

export function Entity(tables: Tables, settings?: EntityConfiguration) {
  return function (constructor: () => void): void {
    const dataMap: TableMap = {
      tableName: 'Avasdasdbsd',
      columns: [],
      constructor,
    };
    if (settings) {
      dataMap.tableName = settings.tableName;
      constructor.prototype['_orm_table_name'] = settings.tableName;
    } else {
      constructor.prototype['_orm_table_name'] = constructor.name;
    }
    tables.add(dataMap);
  };
}
