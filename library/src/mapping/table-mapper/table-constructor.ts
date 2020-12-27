import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { Column, TableSchema } from '../../common/models/database-schema';
import { Relationship } from '../../main/models/relationships';
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
    const tableSchemas = tablesNames.map(this.toTableSchema);
    return [];
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
    const resultSchema: TableSchema[] = [];

    const manyToManyRelationships: Relationship[] = this.relationships.getByType(
      RelationshipType.manyToMany,
    );

    manyToManyRelationships.forEach((relationship) => {
      let columnsFound = 0;
      let keyColumnForFromTable: Column;
      let keyColumnForToTable: Column;

      for (let i = 0; i < schema.length; i++) {
        if (schema[i].name === relationship.fromTable) {
          keyColumnForFromTable = JSON.parse(
            JSON.stringify(
              schema[i].columns.filter((column) => column.isPrimaryKey)[0],
            ),
          );
          columnsFound += 1;
        } else if (schema[i].name === relationship.toTable) {
          keyColumnForToTable = JSON.parse(
            JSON.stringify(
              schema[i].columns.filter((column) => column.isPrimaryKey)[0],
            ),
          );
          columnsFound += 1;
        }
      }

      if (columnsFound === 0) return;

      const keyColumnForFromTableName = JSON.parse(
        JSON.stringify(keyColumnForFromTable.name),
      );
      const keyColumnForToTableName = JSON.parse(
        JSON.stringify(keyColumnForToTable.name),
      );

      if (keyColumnForToTable.name === keyColumnForFromTable.name) {
        keyColumnForFromTable.name = keyColumnForFromTable.name.concat('2');
        keyColumnForToTable.name = keyColumnForToTable.name.concat('1');
      }

      keyColumnForFromTable.foreignKey = {
        columnName: keyColumnForToTableName,
        tableName: relationship.toTable,
      };
      keyColumnForToTable.foreignKey = {
        columnName: keyColumnForFromTableName,
        tableName: relationship.fromTable,
      };

      const newTableSchemaColumns: Column[] = [
        keyColumnForToTable,
        keyColumnForFromTable,
      ];

      const newTableSchema: TableSchema = {
        name: relationship.fromTable.concat('_', relationship.toTable),
        columns: newTableSchemaColumns,
      };

      resultSchema.push(newTableSchema);
    });

    return resultSchema;
  }
}
