import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { Column, TableSchema } from '../../common/models/database-schema';
import {
  DbType,
  isRelationshipField,
  RelationshipType,
} from '../../common/models/field-types';
import { ColumnMap } from '../../common/models/column-map';
import { deepCopy } from '../../utils/copy';

export class TableConstructor {
  private tableNameToForeignKeyColumns: Map<string, Column[]> = new Map();
  constructor(private tables: Tables, private relationships: Relationships) {}

  getDatabaseScheme(): TableSchema[] {
    const tablesNames = this.getTableMapsNamesInCreationOrder();
    const tableSchemas = tablesNames.map((name) => this.toTableSchema(name));
    this.insertLinkTables(tableSchemas);
    return tableSchemas;
  }

  getTableMapsNamesInCreationOrder(): string[] {
    const result: string[] = this.tables
      .getNames()
      .filter((tableName) => !this.relationships.hasForeignKey(tableName));

    const queue = [...result];

    // BFS for dependencies
    while (queue.length > 0) {
      const queueTable = queue.shift();
      this.relationships
        .getAssociatedTablesNames(queueTable)
        .forEach((associatedTableName) => {
          if (!result.includes(associatedTableName)) {
            result.push(associatedTableName);
            queue.push(associatedTableName);
          }
        });
    }
    return result;
  }

  toTableSchema(tableName: string): TableSchema {
    const tableMap = this.tables.get(tableName);

    const { primaryKeys, relationships, others } = split(tableMap.columns);

    const primaryKeyColumns = mapToColumns(primaryKeys);
    const othersColumns = mapToColumns(others);

    getForeignKeys(this.tableNameToForeignKeyColumns);

    if (primaryKeyColumns.length === 0) {
      createPrimaryKey();
    }

    setForeignKeysFromRelationships(this.tableNameToForeignKeyColumns);

    return {
      name: tableMap.tableName,
      columns: [...primaryKeyColumns, ...othersColumns],
    };

    function split(
      columnMaps: ColumnMap[],
    ): {
      primaryKeys: ColumnMap[];
      relationships: ColumnMap[];
      others: ColumnMap[];
    } {
      const primaryKeys = [];
      const relationships = [];
      const others = [];
      for (const columnMap of columnMaps) {
        if (columnMap.isPrimaryKey) {
          primaryKeys.push(columnMap);
        } else if (isRelationshipField(columnMap.type)) {
          relationships.push(columnMap);
        } else {
          others.push(columnMap);
        }
      }

      return {
        primaryKeys,
        relationships,
        others,
      };
    }

    function mapToColumns(columnMaps: ColumnMap[]): Column[] {
      return columnMaps.map((columnMap) => {
        const { fieldName: _, columnName: name, type, ...rest } = columnMap;
        if (isRelationshipField(type)) return {} as Column;
        return { name, type, ...rest };
      });
    }

    function getForeignKeys(map: Map<string, Column[]>) {
      const foreignKeyColumns = map.get(tableMap.tableName) || [];
      for (const column of foreignKeyColumns) {
        if (
          containsColumnOfGivenName(
            [...primaryKeyColumns, ...othersColumns],
            column.name,
          )
        ) {
          const index = getFirstFreeIndex(
            [...primaryKeyColumns, ...othersColumns],
            'foreignKey',
          );
          column.name = `foreignKey${index}`;
        }
        if (column.isPrimaryKey) {
          primaryKeyColumns.push(column);
        } else {
          othersColumns.push(column);
        }
      }
    }

    function createPrimaryKey() {
      const index = getFirstFreeIndex(
        [...primaryKeyColumns, ...othersColumns],
        'id',
      );
      primaryKeyColumns.push({
        name: `id${index}`,
        type: DbType.autoincrement,
        isNullable: false,
        isUnique: true,
        isPrimaryKey: true,
      });
    }

    function setForeignKeysFromRelationships(map: Map<string, Column[]>) {
      for (const relationship of relationships) {
        if (!isRelationshipField(relationship.type)) continue;

        const type = relationship.type.type;
        const tableName = relationship.type.with;

        if (type === RelationshipType.manyToMany) continue;

        if (!map.has(tableName)) map.set(tableName, []);

        const target = map.get(tableName);
        for (const primaryKey of primaryKeyColumns) {
          const copy = deepCopy(primaryKey);
          copy.foreignKey = {
            columnName: primaryKey.name,
            tableName: tableMap.tableName,
          };
          if (type === RelationshipType.oneToMany) copy.isPrimaryKey = false;

          target.push(copy);
        }
      }
    }

    function containsColumnOfGivenName(
      columns: Column[],
      name: string,
    ): boolean {
      return columns.some((column) => {
        return column.name === name;
      });
    }

    function getFirstFreeIndex(columns: Column[], prefix: string): number {
      let index = 1;
      while (containsColumnOfGivenName(columns, `${prefix}${index}`)) {
        index++;
      }
      return index;
    }
  }

  insertLinkTables(schema: TableSchema[]): TableSchema[] {
    const relationships = this.relationships.getByType(
      RelationshipType.manyToMany,
    );

    for (const { fromTableName, toTableName } of relationships) {
      const fromTable = schema.find(({ name }) => name === fromTableName);
      const toTable = schema.find(({ name }) => name === toTableName);
      const keysFromTable = deepCopy(
        fromTable.columns.filter(isPrimaryKey),
      ) as Column[];
      const keysToTable = deepCopy(
        toTable.columns.filter(isPrimaryKey),
      ) as Column[];

      for (const key of keysFromTable) {
        key.foreignKey = {
          columnName: key.name,
          tableName: fromTableName,
        };
        key.isPrimaryKey = false;
      }

      for (const key of keysToTable) {
        key.foreignKey = {
          columnName: key.name,
          tableName: toTableName,
        };
        key.isPrimaryKey = false;
      }

      for (const keyFromTable of keysFromTable) {
        for (const keyToTable of keysToTable) {
          if (keyFromTable.name === keyToTable.name) {
            keyFromTable.name = `${keyFromTable.name}1`;
            keyToTable.name = `${keyToTable.name}2`;
          }
        }
      }

      const linkTable = {
        name: `${fromTableName}_${toTableName}`,
        columns: [
          {
            name: '_dp_orm_primary_key',
            type: DbType.autoincrement,
            isNullable: false,
            isUnique: true,
            isPrimaryKey: true,
          },
          ...keysFromTable,
          ...keysToTable,
        ],
      };

      schema.push(linkTable);
    }

    return schema;

    function isPrimaryKey({ isPrimaryKey }: Column): boolean {
      return isPrimaryKey;
    }
  }
}
