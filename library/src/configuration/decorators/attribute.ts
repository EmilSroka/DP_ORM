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
    const columnMap: ColumnMap = {
      fieldName: key as string,
      columnName: settings.columnName || (key as string),
      type: settings.type,
      isPrimaryKey: settings.isPrimaryKey || true,
      isNullable: settings.isNullable || false,
      isUnique: settings.isUnique || true,
    };
    tableMap.columns.push(columnMap);
    const relations = columnMap.type as RelationshipFieldType;
    switch (relations.type) {
      case RelationshipType.oneToOne:
        relationships.add({
          type: RelationshipType.oneToOne,
          toTable: relations.with,
          fromTable: tableMap.tableName,
        });
        break;
      case RelationshipType.manyToMany:
        const relationsTable = relationships.getByType(
          RelationshipType.manyToMany,
        );
        const existRelation = relationsTable.some(
          (rel) =>
            rel.fromTable === relations.with &&
            rel.toTable === tableMap.tableName,
        );
        if (!existRelation) {
          relationships.add({
            type: RelationshipType.manyToMany,
            toTable: relations.with,
            fromTable: tableMap.tableName,
          });
        } else break;
        break;
      case RelationshipType.oneToMany:
        // relationships.add({
        //   type: RelationshipType.oneToMany,
        //   toTable: relations.with,
        //   fromTable: tableMap.tableName,
        // });
        break;
      default:
        return;
    }
  };
}
