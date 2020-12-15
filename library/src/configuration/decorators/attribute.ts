import { AttributeConfiguration } from '../models/attribute-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';

export function Attribute(
  tables: Tables,
  relationships: Relationships,
  settings: AttributeConfiguration,
) {
  return function (target: any, key: string | symbol) {
    // TODO:
    // 1. create ColumnMap
    // -> fieldName -> columnName | key
    // -> columnName -> key
    // -> isPrimaryKey -> isPrimaryKey | false
    // -> type -> type
    // -> isNullable -> isNullable | true
    // -> isUnique -> isUnique | false
    // 2. add created ColumnMap to proper DataMap
    // -> name can by taken from field _orm_table_name (target)
    // -> DataMap can by taken form Tables
    // 3. if it is a relationship -> create and add relationship to Relationships
    // -> edge case: when we have many to many, we should check if reversed relation doesnt exist:
    // eg. we have table 'abc' and relation many to many 'abc' <-> 'xyz'
    //     we should check if relation 'xyz' <-> 'abc' isn't in Relationships already
  };
}
