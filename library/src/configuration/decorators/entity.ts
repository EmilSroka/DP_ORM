import { EntityConfiguration } from '../models/entity-configuration';
import { Tables } from '../../main/metadata-containers/tables';

// Resources about ts decorators:
// https://www.youtube.com/watch?v=O6A-u_FoEX8
// https://www.typescriptlang.org/docs/handbook/decorators.html

export function Entity(tables: Tables, settings?: EntityConfiguration) {
  return function (constructor: () => void): void {
    // TODO:
    // 1. create DataMap
    // 2. insert create DataMap into tables
    // 3. add table name to object prototype -> _orm_table_name
  };
}
