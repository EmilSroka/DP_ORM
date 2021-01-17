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
    const cb = (tableName: string) => {
      const tableMap = tables.get(tableName);
      if (settings.columnName)
        settings.columnName = settings.columnName.toLowerCase();
      if (isRelationshipField(settings.type))
        settings.type.with = settings.type.with.toLowerCase();

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

    if (!target._orm_attributes) {
      target._orm_attributes = [];
    }
    target._orm_attributes.push(cb);
  };

  function getDefaultSettings(fieldName: string) {
    return {
      fieldName: fieldName,
      columnName: fieldName.toLowerCase(),
      isPrimaryKey: false,
      isNullable: true,
      isUnique: false,
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

export type AttributeDecorator = (
  settings: AttributeConfiguration,
) => (target: any, key: string | symbol) => undefined;
