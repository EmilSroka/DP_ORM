import { Tables } from '../../main/metadata-containers/tables';
import { Relationships } from '../../main/metadata-containers/relationships';
import { Column, TableSchema } from '../../common/models/database-schema';
import {
  DbFieldTypes,
  DbType,
  JsFieldTypes,
  RelationshipFieldType,
  RelationshipType,
} from '../../common/models/field-types';

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
    const table = this.tables.get(tableName);
    let cols: Column[] = table.columns.map((column) => {
      const relType = column.type as RelationshipFieldType;
      if (relType) {
        if (
          relType.type === RelationshipType.oneToMany ||
          relType.type === RelationshipType.oneToOne
        ) {
          const rel = this.tableNameToForeignKeyColumns.get(relType.with);
          if (rel) {
            rel.push({
              name: column.columnName,
              type: column.type as JsFieldTypes | DbFieldTypes,
              isPrimaryKey:
                relType.type === RelationshipType.oneToOne
                  ? false
                  : column.isPrimaryKey,
              isUnique: column.isUnique,
              isNullable: column.isNullable,
              foreignKey: {
                tableName: tableName,
                columnName: column.columnName,
              },
            });
          } else {
            this.tableNameToForeignKeyColumns.set(relType.with, [
              {
                name: column.columnName,
                type: column.type as JsFieldTypes | DbFieldTypes,
                isPrimaryKey: column.isPrimaryKey,
                isUnique: column.isUnique,
                isNullable: column.isNullable,
                foreignKey: {
                  tableName: tableName,
                  columnName: column.columnName,
                },
              },
            ]);
          }
        } else if (relType.type === RelationshipType.manyToMany) {
          return;
        }
      } else {
        return {
          name: column.columnName,
          isPrimaryKey: column.isPrimaryKey,
          isUnique: column.isUnique,
          isNullable: column.isNullable,
          fieldName: column.fieldName,
          type: column.type as JsFieldTypes | DbFieldTypes,
        } as Column;
      }
    });
    cols = cols.filter((c) => c);
    const tableSchema: TableSchema = {
      name: tableName,
      columns: cols,
    };
    const tab = this.tableNameToForeignKeyColumns.get(tableName);
    let counter = 1;
    if (tab) {
      tab.forEach((column) => {
        let name = column.name;
        if (
          tableSchema.columns.some((c) => {
            return c.name === column.name;
          })
        ) {
          name = 'foreignKey' + counter;
          counter++;
        }
        tableSchema.columns.push({ ...column, name: name });
      });
    }
    const existPrimaryKey = table.columns.some((column) => column.isPrimaryKey);
    if (!existPrimaryKey) {
      table.columns.unshift({
        columnName: 'id' + 1,
        type: DbType.autoincrement,
        isNullable: false,
        isUnique: true,
        isPrimaryKey: true,
        fieldName: '',
      });
    }
    return tableSchema as TableSchema;
  }
}
