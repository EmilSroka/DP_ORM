import { AttributeConfiguration } from '../models/attribute-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { ColumnMap } from '../../common/models/column-map';
import {
  isRelationshipField,
  RelationshipType,
} from '../../common/models/field-types';
import { Relationship } from '../../main/models/relationships';

export function Attribute(
  tables: Tables,
  relationships: Relationships,
  settings: AttributeConfiguration,
) {
  return function (target: any, key: string | symbol) {
    const tableMap = tables.get(target._orm_table_name);
    const columnMap: ColumnMap = {
      ...getDefaultSettings(key.toString()),
      ...settings,
    };
    tableMap.columns.push(columnMap);

    if (!isRelationshipField(columnMap.type)) return;
    const relation = {
      type: columnMap.type.type,
      toTableName: columnMap.type.with,
      fromTableName: tableMap.tableName,
    };
    if (isExisting(relation)) return;
    relationships.add(relation);
  };

  function getDefaultSettings(fieldName: string) {
    return {
      fieldName: fieldName,
      columnName: fieldName,
      isPrimaryKey: true,
      isNullable: false,
      isUnique: true,
    };
  }

  function isExisting(relation: Relationship): boolean {
    if (relation.type !== RelationshipType.manyToMany) return false;

    const manyToManyRelations = relationships.getByType(relation.type);
    return manyToManyRelations.some(
      (rel) =>
        rel.fromTableName === relation.toTableName &&
        rel.toTableName === relation.fromTableName,
    );
  }
}
