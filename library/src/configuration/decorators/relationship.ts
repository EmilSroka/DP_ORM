import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { ColumnMap } from '../../common/models/column-map';
import { RelationshipType } from '../../common/models/field-types';
import { Relationship } from '../../main/models/relationships';
import {
  isManyToManySetting,
  RelationshipConfiguration,
} from '../models/relationship-configuration';

export function Relationship(
  tables: Tables,
  relationships: Relationships,
  settings: RelationshipConfiguration,
) {
  return function (target: any, key: string | symbol) {
    const cb = (
      tableName: string,
      validation: { havePK: boolean; columnNames: string[] },
    ) => {
      const tableMap = tables.get(tableName);
      const withName = isManyToManySetting(settings)
        ? settings.with.class.prototype._orm_table_name
        : settings.with.prototype._orm_table_name;

      const columnMap = getDefaultSettings(key.toString());
      columnMap.type = {
        type: settings.type,
        with: withName,
      };

      if (validation.columnNames.includes(columnMap.columnName))
        throw new Error(
          'ORM: Column of given name already exists (names ar case insensitive)',
        );

      tableMap.columns.push(columnMap);
      validation.columnNames.push(columnMap.columnName);

      if (isManyToManySetting(settings)) {
        const tableMap = tables.get(withName);
        const columnName = settings.with.columnName
          ? settings.with.columnName.toLowerCase()
          : settings.with.field.toLowerCase();
        const columnMap = getDefaultSettings(columnName);
        columnMap.type = {
          type: settings.type,
          with: tableName,
        };

        if (validation.columnNames.includes(columnMap.columnName))
          throw new Error(
            'ORM: Column of given name already exists (names ar case insensitive)',
          );

        tableMap.columns.push(columnMap);
        validation.columnNames.push(columnMap.columnName);
      }

      relationships.add({
        type: columnMap.type.type,
        toTableName: withName,
        fromTableName: tableMap.tableName,
      });
    };

    if (!target._orm_attributes) {
      target._orm_attributes = [];
    }

    target._orm_attributes.push(cb);
  };

  function getDefaultSettings(fieldName: string): ColumnMap {
    return {
      type: undefined,
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

export type RelationshipDecorator = (
  settings: RelationshipConfiguration,
) => (target: any, key: string | symbol) => undefined;
