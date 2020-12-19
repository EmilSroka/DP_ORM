import { AttributeConfiguration } from '../models/attribute-configuration';
import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { ColumnMap } from '../../common/models/column-map';
import {
  RelationshipFieldType,
  RelationshipType,
} from '../../common/models/field-types';

export function Attribute(
  tables: Tables,
  relationships: Relationships,
  settings: AttributeConfiguration,
) {
  return function (target: any, key: string | symbol) {
    const tableMap = tables.get(target._orm_table_name);
    const defaultSettings = {
      fieldName: key.toString(),
      columnName: key.toString(),
      isPrimaryKey: true,
      isNullable: false,
      isUnique: true,
    };

    const columnMap: ColumnMap = { ...defaultSettings, ...settings };
    tableMap.columns.push(columnMap);
    const relations = columnMap.type as RelationshipFieldType;
    if (!relations.type) return;
    else {
      let existRelation = false;
      if (relations.type === RelationshipType.manyToMany) {
        const relationsTable = relationships.getByType(relations.type);
        existRelation = relationsTable.some(
          (rel) =>
            rel.fromTable === relations.with &&
            rel.toTable === tableMap.tableName,
        );
      }
      if (relations.type === RelationshipType.manyToMany && existRelation)
        return;
      else {
        relationships.add({
          type: relations.type,
          toTable: relations.with,
          fromTable: tableMap.tableName,
        });
      }
    }
  };
}
